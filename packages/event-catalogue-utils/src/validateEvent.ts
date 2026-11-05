import type { ValidateFunction } from "ajv/dist/2019.js";
import logger from "./logger.js";
import type { UnknownEvent } from "./types.js";

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
 * the (optional) `@govuk-one-login/event-catalogue-typescript-validators`
 * package. These modules have the AJV runtime inlined, so no AJV instance is
 * needed.
 *
 * Returns the validator function, or `null` if no precompiled artifact exists
 * (e.g. the validators package is not installed, or the event's schema was
 * skipped during generation).
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
    // (Vite/esbuild dynamic-import-vars) can statically analyse it. Resolves to
    // one standalone validator per event in the
    // `@govuk-one-login/event-catalogue-typescript-validators` package.
    const mod = (await import(
      `@govuk-one-login/event-catalogue-typescript-validators/${eventName}.mjs`
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
 * Lazily loaded AJV + schemas fallback. The AJV runtime and the schemas
 * catalogue are only imported the first time the fallback path is needed, so
 * the precompiled fast path carries none of their import cost.
 */
let fallbackPromise:
  | Promise<{
      schemas: Record<string, object>;
      getValidator: (schema: object) => ValidateFunction;
    }>
  | undefined;

function loadFallback() {
  if (!fallbackPromise) {
    fallbackPromise = (async () => {
      const [{ default: Ajv2019 }, { default: addFormats }, schemas] =
        await Promise.all([
          import("ajv/dist/2019.js"),
          import("ajv-formats"),
          import("@govuk-one-login/event-catalogue-schemas"),
        ]);

      // `strict: true` keeps the fallback honest about malformed schemas, while
      // `ajv-formats` registers the standard `format` keywords (e.g. `uri`,
      // `date-time`). Without it, strict AJV throws on an unknown format at
      // compile time. The precompiled validators inline their own format
      // handling, so registering formats here keeps the runtime fallback
      // consistent with the fast path rather than crashing on format-bearing
      // schemas.
      const ajv = addFormats(new Ajv2019({ strict: true }));

      // Compile (or retrieve a cached) AJV validator for the given schema. Uses
      // the schema's stable `$id` so AJV compiles each schema at most once per
      // process: `getSchema($id)` returns the previously compiled function if
      // present, otherwise `compile` both compiles and registers it.
      const getValidator = (schema: object): ValidateFunction => {
        const id = (schema as { $id?: string }).$id;
        const cached = id ? ajv.getSchema(id) : undefined;
        return (cached as ValidateFunction) ?? ajv.compile(schema);
      };

      return {
        schemas: schemas as unknown as Record<string, object>,
        getValidator,
      };
    })();
  }
  return fallbackPromise;
}

/**
 * Validates a preexisting event matches the event catalogue schema.
 *
 * Prefers a precompiled, standalone validator shipped by
 * `@govuk-one-login/event-catalogue-typescript-validators` (fast path — no AJV
 * compilation, only the single required validator is loaded). Falls back to
 * compiling the schema at runtime with AJV when no precompiled validator is
 * available. The AJV runtime and the schemas package are loaded lazily, only on
 * the first fallback, so the fast path carries none of their import cost.
 *
 * @param event - The event to validate (must carry an `event_name`).
 * @returns - Promise resolving to whether the event is valid.
 */
export async function validateEvent(event: UnknownEvent): Promise<boolean> {
  const eventName = event.event_name;

  // Fast path: precompiled standalone validator (if one ships for this event).
  // Tried first so the AJV/schemas fallback is never loaded when it hits.
  const precompiled = await loadPrecompiledValidator(eventName);
  if (precompiled) {
    const valid = precompiled(event);
    if (!valid) {
      logger.error(`Errors found in ${eventName} event`);
    }
    return valid;
  }

  // Fallback path: lazily load AJV + the schemas catalogue and compile at
  // runtime. Reached only when no precompiled validator exists for the event.
  const { schemas, getValidator } = await loadFallback();
  const eventKey = `${eventName}Schema`;
  const schema = schemas[eventKey];
  if (!schema) {
    // No precompiled validator AND no schema for this key — unknown event name.
    logger.error(`Invalid event_name: ${eventName}`);
    return false;
  }

  const validate = getValidator(schema);
  const valid = validate(event) as boolean;
  if (!valid) {
    logger.error(`Errors found in ${eventName} event`);
  }

  return valid;
}
