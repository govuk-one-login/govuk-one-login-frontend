import { createEvent, sendEventToSQS, validateEvent } from ".";
import { EventKey, Events } from "./types";

export function sendToTXMA<K extends EventKey>(
  type: K,
  entity: Events[K],
  queueUrl: string,
) {
  const event = createEvent(type, entity);
  const valid = validateEvent<K>(event);
  if (!valid)
    throw new Error("Invalid event created: " + JSON.stringify(event));
  sendEventToSQS(event, queueUrl);
}
