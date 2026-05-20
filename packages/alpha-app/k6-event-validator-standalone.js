// Standalone event validator for k6 using event catalogue validation logic
// This includes the core validation without external npm dependencies

// Event schemas - simplified version for k6 compatibility
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

function validateEvent(event) {
  if (!event || typeof event !== 'object') {
    console.error('Event must be an object');
    return false;
  }

  const eventName = event.event_name;
  if (!eventName) {
    console.error('Missing event_name');
    return false;
  }

  const schemaKey = eventName + "Schema";
  const schema = EVENT_SCHEMAS[eventName];
  
  if (!schema) {
    console.error(`Invalid event_name: ${eventName}`);
    return false;
  }

  // Validate required fields
  for (const field of schema.required) {
    if (!(field in event)) {
      console.error(`Missing required field: ${field}`);
      return false;
    }
  }

  // Validate field types
  for (const [fieldName, fieldSchema] of Object.entries(schema.properties)) {
    if (fieldName in event) {
      const value = event[fieldName];
      
      if (fieldSchema.type === 'string' && typeof value !== 'string') {
        console.error(`Field ${fieldName} must be a string`);
        return false;
      }
      
      if (fieldSchema.type === 'number' && typeof value !== 'number') {
        console.error(`Field ${fieldName} must be a number`);
        return false;
      }
      
      if (fieldSchema.type === 'object' && (typeof value !== 'object' || value === null)) {
        console.error(`Field ${fieldName} must be an object`);
        return false;
      }
      
      if (fieldSchema.const && value !== fieldSchema.const) {
        console.error(`Field ${fieldName} must equal ${fieldSchema.const}`);
        return false;
      }
    }
  }

  return true;
}

export { validateEvent };