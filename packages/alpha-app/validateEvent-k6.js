// Standalone validateEvent implementation for k6
// Based on @govuk-one-login/event-catalogue-utils

// Simplified AJV-like validator for k6 compatibility
function createValidator(schema) {
  return function validate(data) {
    if (!data || typeof data !== 'object') {
      return false;
    }

    // Check required fields
    if (schema.required) {
      for (const field of schema.required) {
        if (!(field in data)) {
          console.error(`Missing required field: ${field}`);
          return false;
        }
      }
    }

    // Check properties
    if (schema.properties) {
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        if (key in data) {
          const value = data[key];
          
          if (propSchema.type === 'string' && typeof value !== 'string') {
            console.error(`Field ${key} must be a string`);
            return false;
          }
          
          if (propSchema.type === 'number' && typeof value !== 'number') {
            console.error(`Field ${key} must be a number`);
            return false;
          }
          
          if (propSchema.type === 'object' && (typeof value !== 'object' || value === null)) {
            console.error(`Field ${key} must be an object`);
            return false;
          }
          
          if (propSchema.const && value !== propSchema.const) {
            console.error(`Field ${key} must equal ${propSchema.const}`);
            return false;
          }
        }
      }
    }

    return true;
  };
}

// Event schemas from the catalogue
const EVENT_SCHEMAS = {
  "AUTH_ACCOUNT_CREATION_REQUEST_SENT": {
    type: "object",
    required: ["component_id", "event_name", "event_timestamp_ms", "timestamp"],
    properties: {
      component_id: { type: "string" },
      event_name: { type: "string", const: "AUTH_ACCOUNT_CREATION_REQUEST_SENT" },
      event_timestamp_ms: { type: "number" },
      timestamp: { type: "number" },
      user: {
        type: "object",
        properties: {
          user_id: { type: "string" },
          session_id: { type: "string" }
        }
      }
    }
  },
  "AUTH_ACCOUNT_USER_LOGIN_START": {
    type: "object",
    required: ["component_id", "event_name", "event_timestamp_ms", "timestamp"],
    properties: {
      component_id: { type: "string" },
      event_name: { type: "string", const: "AUTH_ACCOUNT_USER_LOGIN_START" },
      event_timestamp_ms: { type: "number" },
      timestamp: { type: "number" },
      user: {
        type: "object",
        properties: {
          user_id: { type: "string" },
          session_id: { type: "string" }
        }
      }
    }
  },
  "AUTH_ACCOUNT_USER_LOGIN_END": {
    type: "object",
    required: ["component_id", "event_name", "event_timestamp_ms", "timestamp"],
    properties: {
      component_id: { type: "string" },
      event_name: { type: "string", const: "AUTH_ACCOUNT_USER_LOGIN_END" },
      event_timestamp_ms: { type: "number" },
      timestamp: { type: "number" },
      user: {
        type: "object",
        properties: {
          user_id: { type: "string" },
          session_id: { type: "string" }
        }
      }
    }
  }
};

// Main validateEvent function matching the API from event-catalogue-utils
export function validateEvent(event) {
  if (!event || typeof event !== 'object') {
    console.error('Event must be an object');
    return false;
  }

  const eventName = event.event_name;
  if (!eventName) {
    console.error('Missing event_name');
    return false;
  }

  const schema = EVENT_SCHEMAS[eventName];
  if (!schema) {
    console.error(`Invalid event_name: ${eventName}`);
    return false;
  }

  const validator = createValidator(schema);
  const isValid = validator(event);
  
  if (!isValid) {
    console.error(`Errors found in ${eventName} event`);
  }

  return isValid;
}