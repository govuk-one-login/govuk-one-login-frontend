const VALID_EVENT_NAMES = [
  "AIS_EVENT_TRANSITION_APPLIED",
  "AUTH_ACCOUNT_CREATION_REQUEST_SENT",
  "AUTH_ACCOUNT_CREATION_REQUEST_RECEIVED",
  "AUTH_ACCOUNT_USER_LOGIN_START",
  "AUTH_ACCOUNT_USER_LOGIN_END",
];

function validateEventStructure(event) {
  const requiredFields = [
    "component_id",
    "event_name",
    "event_timestamp_ms",
    "timestamp",
  ];

  for (const field of requiredFields) {
    if (!event.hasOwnProperty(field)) {
      console.error(`Missing required field: ${field}`);
      return false;
    }
  }

  if (!VALID_EVENT_NAMES.includes(event.event_name)) {
    console.error(`Invalid event_name: ${event.event_name}`);
    return false;
  }

  if (
    typeof event.event_timestamp_ms !== "number" ||
    event.event_timestamp_ms <= 0
  ) {
    console.error("Invalid event_timestamp_ms");
    return false;
  }

  if (typeof event.timestamp !== "number" || event.timestamp <= 0) {
    console.error("Invalid timestamp");
    return false;
  }

  return true;
}

export { validateEventStructure };
