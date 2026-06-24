import { check, group } from "k6";
import { validateEvent } from "../src/validateEvent.js";

//k6 run testValidateEvent.js
export const options = {
  scenarios: {
    event_validation: {
      executor: "shared-iterations",
      iterations: 5,
      vus: 1,
    },
  },
};

function testEventValidation(eventName, eventData) {
  console.log(`Testing event: ${eventName}`);

  try {
    const isValid = validateEvent(eventData);

    check(isValid, {
      [`${eventName} validation passed`]: (valid) => valid === true,
    });

    if (isValid) {
      console.log(`✓ ${eventName} is valid`);
    } else {
      console.log(`✗ ${eventName} is invalid`);
    }

    return isValid;
  } catch (error) {
    console.error(`Error validating ${eventName}: ${error.message}`);

    check(false, {
      [`${eventName} validation error`]: () => false,
    });

    return false;
  }
}

export default function () {
  group("Event Catalogue Validation Tests", () => {
    console.log(
      "Testing validateEvent function from @govuk-one-login/event-catalogue-utils",
    );

    // Test with a properly structured event
    const validEvent = {
      component_id: "alpha-app",
      event_name: "AUTH_ACCOUNT_CREATION_REQUEST_SENT",
      event_timestamp_ms: Date.now(),
      timestamp: Date.now(),
      user: {
        user_id: "test-user-123",
        session_id: "test-session-456",
      },
    };

    testEventValidation("VALID_EVENT_TEST", validEvent);

    // Test invalid event - missing required fields
    group("Invalid Event Tests", () => {
      const invalidEvent = {
        event_name: "AUTH_ACCOUNT_CREATION_REQUEST_SENT",
        // Missing component_id, timestamps, etc.
      };

      const invalidResult = testEventValidation(
        "INVALID_INCOMPLETE_EVENT",
        invalidEvent,
      );

      check(!invalidResult, {
        "Incomplete event correctly rejected": (rejected) => rejected === true,
      });
    });

    // Test invalid event name
    group("Unknown Event Tests", () => {
      const unknownEvent = {
        component_id: "alpha-app",
        event_name: "UNKNOWN_EVENT_TYPE",
        event_timestamp_ms: Date.now(),
        timestamp: Date.now(),
      };

      const unknownResult = testEventValidation(
        "UNKNOWN_EVENT_TYPE",
        unknownEvent,
      );

      check(!unknownResult, {
        "Unknown event correctly rejected": (rejected) => rejected === true,
      });
    });
  });
}
