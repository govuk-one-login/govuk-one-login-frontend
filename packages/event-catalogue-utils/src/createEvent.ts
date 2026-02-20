import { type Events } from "@govuk-one-login/event-catalogue";

/**
 * This function provides static type-checking against the event catalogue.
 * @param type - The event name
 * @param entity - The event
 * @returns - The event
 */
export function createEvent<K extends keyof Events>(
  type: K,
  entity: Events[K],
): Events[K] {
  return entity;
}
