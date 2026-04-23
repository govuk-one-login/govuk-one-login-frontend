import { type EventKey, Events } from "./types.js";

/**
 * This function provides static type-checking against the event catalogue.
 * @param type - The event name
 * @param entity - The event
 * @returns - The event
 */
export function createEvent<K extends EventKey>(
  type: K,
  entity: Events[K],
): Events[K] {
  return entity;
}
