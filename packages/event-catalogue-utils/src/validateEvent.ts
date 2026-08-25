import type { Events } from "@govuk-one-login/event-catalogue";
import * as schemas from "@govuk-one-login/event-catalogue-schemas";
import Ajv2019, { ValidateFunction } from "ajv/dist/2019.js";
import logger from "./logger.js";
import { isEventKey, type UnknownEvent } from "./types.js";

const ajv = new Ajv2019({ strict: true });

const compiledValidators = new Map<EventSchemaKey, ValidateFunction>(
  (Object.keys(schemas) as EventSchemaKey[]).map((key) => [
    key,
    ajv.compile(schemas[key]),
  ]),
);

/**
 * Validates a preexisting event matches event catalogue schema.
 * @param event - The event name
 * @returns - The event
 */
export function validateEvent<K extends keyof Events>(
  event: UnknownEvent,
): event is Events[K] {
  const eventName = event.event_name;
  const eventKey = `${eventName}Schema`;
  if (!isEventKey(eventKey)) {
    logger.error(`Invalid event_name: ${eventName}`);
    return false;
  }

  const validate = compiledValidators.get(eventKey);
  if (!validate) {
    logger.error(`Valid key given but no schema found for: ${eventKey}`);
    return false;
  }

  const valid = validate(event);
  if (!valid) {
    logger.error(`Errors found in ${eventName} event`);
  }

  return valid as boolean;
}
