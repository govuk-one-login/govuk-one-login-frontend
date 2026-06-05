import { check, group } from "k6";
import http from "k6/http";
import { validateEvent } from "./k6-event-validator.js";

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
    ui: {
      executor: "ramping-arrival-rate",
      startRate: 1,
      timeUnit: "1s",
      preAllocatedVUs: 1,
      maxVUs: 100,
      stages: [
        { target: 500, duration: "120s" },
        { target: 500, duration: "120s" },
      ],
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<1000"],
    http_req_failed: ["rate<0.05"],
  },
};

export default function pocApp() {
  const response = http.get("http://localhost:3000/test-val");

  check(response, {
    "status is 200": (r) => r.status === 200,
    "page contains expected content": (r) =>
      r.body && r.body.includes("Using your GOV.UK One Login"),
  }) ||
    console.log(`Request failed: ${response.error || "Connection refused"}`);

  group("Event Validation Tests", () => {
    testEventValidation("AIS_EVENT_TRANSITION_APPLIED", {});
  });
}
