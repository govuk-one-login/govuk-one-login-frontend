import { validateEvent } from "@govuk-one-login/event-catalogue-utils";
import { check, group } from "k6";

function testEventValidation(eventName, eventData) {
  const testEvent = {
    component_id: "alpha-app",
    event_name: eventName,
    event_timestamp_ms: Date.now(),
    timestamp: Date.now(),
    ...eventData,
  };

  const isValid = validateEvent(testEvent);
  check(isValid, {
    [`Event ${eventName} validation passed`]: (valid) => valid === true,
  });

  return isValid;
}

export const options = {
  scenarios: {
    validation_only: {
      executor: "shared-iterations",
      iterations: 5,
      vus: 1,
    },
  },
};

export default function eventValidationTest() {
  group("Event Validation Tests", () => {
    // Test valid events with proper structure
    testEventValidation("AUTH_ACCOUNT_CREATION_REQUEST_SENT", {
      user: {
        user_id: "test-user-123",
        session_id: "test-session-456",
      },
    });

    testEventValidation("AUTH_ACCOUNT_USER_LOGIN_START", {
      user: {
        user_id: "test-user-123",
        session_id: "test-session-456",
      },
    });

    // Test invalid event name
    const invalidResult = testEventValidation("INVALID_EVENT_NAME", {});
    check(!invalidResult, {
      "Invalid event correctly rejected": (rejected) => rejected === true,
    });

    // Test missing required fields
    const incompleteEvent = {
      event_name: "AUTH_ACCOUNT_CREATION_REQUEST_SENT",
      // Missing required fields like component_id, timestamps
    };
    const incompleteResult = validateEvent(incompleteEvent);
    check(!incompleteResult, {
      "Incomplete event correctly rejected": (rejected) => rejected === true,
    });
  });
}
