import { check, group } from "k6";
import { validateEventStructure } from "./k6-event-validator.js";

function testEventValidation(eventName, eventData) {
  const testEvent = {
    component_id: "alpha-app",
    event_name: eventName,
    event_timestamp_ms: Date.now(),
    timestamp: Date.now(),
    ...eventData
  };
  
  const isValid = validateEventStructure(testEvent);
  check(isValid, {
    [`Event ${eventName} validation passed`]: (valid) => valid === true,
  });
  
  return isValid;
}

export const options = {
  scenarios: {
    validation_only: {
      executor: "shared-iterations",
      iterations: 10,
      vus: 1,
    },
  },
};

export default function eventValidationTest() {
  group("Event Validation Tests", () => {
    testEventValidation("AIS_EVENT_TRANSITION_APPLIED", {});
    
    // Test invalid event
    const invalidResult = testEventValidation("INVALID_EVENT_NAME", {});
    check(!invalidResult, {
      "Invalid event correctly rejected": (rejected) => rejected === true,
    });
    
    // Test missing fields
    const incompleteEvent = {
      event_name: "AIS_EVENT_TRANSITION_APPLIED",
      // Missing required fields
    };
    const incompleteResult = validateEventStructure(incompleteEvent);
    check(!incompleteResult, {
      "Incomplete event correctly rejected": (rejected) => rejected === true,
    });
  });
}