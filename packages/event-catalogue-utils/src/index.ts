import { type Events } from "@govuk-one-login/event-catalogue";

function createEvent<K extends keyof Events>(
  type: K,
  entity: Events[K],
): Events[K] {
  // validate against schema here
  // insert any metadata eg. event version, catalogue version, validation outcome...
  return entity;
}

// Usage
createEvent("AUTH_ACCOUNT_MANAGEMENT_AUTHENTICATE", {
  component_id: "",
  event_name: "",
  event_timestamp_ms: 0,
  timestamp: 0,
});

createEvent("AUTH_CREATE_ACCOUNT", {});
