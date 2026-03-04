import { Events } from "@govuk-one-login/event-catalogue";
import * as schemas from "@govuk-one-login/event-catalogue-schemas";
import Ajv2019 from "ajv/dist/2019";
import logger from "./logger";

const ajv = new Ajv2019({ strict: true });

type EventKey = keyof typeof schemas;
type UnknownEvent = { event_name: string };

const isEventKey = (key: string): key is EventKey =>
  Object.keys(schemas).includes(key);

/**
 * Validates a preexisting event matches event catalogue schema.
 * @param event - The event name
 * @returns - The event
 */
export function validateEvent<K extends keyof Events>(
  event: UnknownEvent,
): event is Events[K] {
  // Check event name matches valid schema
  const eventName = event.event_name;
  const eventKey = eventName + "Schema";
  if (!isEventKey(eventKey)) {
    logger.error(`Invalid event_name: ${eventName}`);
    return false;
  }
  const schema = schemas[eventKey];
  if (!schema) {
    logger.error(`Valid key given but no schema found for: ${eventKey}`);
    return false;
  }

  const validate = ajv.compile(schema);
  const valid = validate(event);
  if (!valid) {
    logger.error(`Errors found in ${eventName} event`);
  }

  return valid;
}
