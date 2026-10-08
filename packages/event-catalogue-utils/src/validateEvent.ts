import * as schemas from "@govuk-one-login/event-catalogue-schemas";
import type { ValidateFunction } from "ajv/dist/2019.js";
import Ajv2019 from "ajv/dist/2019.js";
import logger from "./logger.js";
import { isEventKey, type UnknownEvent } from "./types.js";

// Config MUST match the generator in tools/generate-validators.mjs so that the
// precompiled fast path and this runtime fallback validate identically.
const ajv = new Ajv2019({ strict: true });

/**
 * Module-scoped cache of precompiled validators resolved via dynamic import,
 * keyed by event name. Avoids repeating the dynamic import() on every call.
 * The value is `null` when we have determined no precompiled validator exists
 * for that event (so we go straight to the fallback without retrying import).
 */
const precompiledCache = new Map<string, ((data: unknown) => boolean) | null>();

type StandaloneValidator = ((data: unknown) => boolean) & {
  errors?: unknown;
};

/**
 * Attempt to load a precompiled, standalone validator for the given event from
 * the (optional) `@govuk-one-login/event-catalogue-schemas` validators subpath.
 * These modules have the AJV runtime inlined, so no AJV instance is needed.
 *
 * Returns the validator function, or `null` if no precompiled artifact exists
 * (e.g. the installed schemas package predates precompiled validators, or the
 * event's schema was skipped during generation).
 */
async function loadPrecompiledValidator(
  eventName: string,
): Promise<((data: unknown) => boolean) | null> {
  if (precompiledCache.has(eventName)) {
    return precompiledCache.get(eventName) ?? null;
  }

  let validator: ((data: unknown) => boolean) | null = null;
  try {
    // The `.mjs` suffix is kept in the static part of the import so bundlers
    // (Vite/esbuild dynamic-import-vars) can statically analyse it. Resolves via
    // the schemas package "./validators/*.mjs" export subpath.
    const mod = (await import(
      `@govuk-one-login/event-catalogue-schemas/validators/${eventName}.mjs`
    )) as { default?: StandaloneValidator };
    if (typeof mod.default === "function") {
      validator = mod.default;
    }
  } catch {
    // No precompiled validator available for this event — fall back to AJV.
    validator = null;
  }

  precompiledCache.set(eventName, validator);
  return validator;
}

/**
 * Compile (or retrieve a cached) AJV validator for the given schema. Uses the
 * schema's stable `$id` so AJV compiles each schema at most once per process:
 * `getSchema($id)` returns the previously compiled function if present,
 * otherwise `compile` both compiles and registers it under its `$id`.
 */
function getFallbackValidator(schema: object): ValidateFunction {
  const id = (schema as { $id?: string }).$id;
  const cached = id ? ajv.getSchema(id) : undefined;
  return (cached as ValidateFunction) ?? ajv.compile(schema);
}

/**
 * Validates a preexisting event matches the event catalogue schema.
 *
 * Prefers a precompiled, standalone validator shipped by
 * `@govuk-one-login/event-catalogue-schemas` (fast path — no AJV compilation,
 * only the single required validator is loaded). Falls back to compiling the
 * schema at runtime with AJV when no precompiled validator is available.
 *
 * @param event - The event to validate (must carry an `event_name`).
 * @returns - Promise resolving to whether the event is valid.
 */
export async function validateEvent(event: UnknownEvent): Promise<boolean> {
  // Check event name matches a valid schema.
  const eventName = event.event_name;
  const eventKey = `${eventName}Schema`;
  if (!isEventKey(eventKey)) {
    logger.error(`Invalid event_name: ${eventName}`);
    return false;
  }

  // Fast path: precompiled standalone validator (if the schemas package ships one).
  const precompiled = await loadPrecompiledValidator(eventName);
  if (precompiled) {
    const valid = precompiled(event);
    if (!valid) {
      logger.error(`Errors found in ${eventName} event`);
    }
    return valid;
  }

  // Fallback path: compile the schema at runtime with AJV.
  const schema = schemas[eventKey];
  if (!schema) {
    logger.error(`Valid key given but no schema found for: ${eventKey}`);
    return false;
  }

  const validate = getFallbackValidator(schema);
  const valid = validate(event) as boolean;
  if (!valid) {
    logger.error(`Errors found in ${eventName} event`);
  }

  return valid;
}
