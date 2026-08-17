/**
 * k6 performance test for validateEvent.
 *
 * Benchmarks validateEvent directly — no HTTP layer — using the real
 * Event Catalogue schemas precompiled at module load time.
 *
 * Prerequisites:
 *   brew install k6
 *   npm install --save-dev esbuild   (if not already installed)
 *
 * Usage:
 *   npm run perf:k6
 */
import { validateEvent } from "../validateEvent.js";
import { check } from "k6";
import { Counter } from "k6/metrics";

export const options = {
  vus: 10,
  duration: "10s",
  thresholds: {
    checks: ["rate==1.0"],
    valid_event_validations: ["count>0"],
    invalid_event_validations: ["count>0"],
  },
};

const validEventCount = new Counter("valid_event_validations");
const invalidEventCount = new Counter("invalid_event_validations");

const validEvent = {
  component_id: "component_id",
  event_name: "AIS_EVENT_TRANSITION_APPLIED",
  event_timestamp_ms: Date.now(),
  timestamp: Date.now(),
};

const invalidNameEvent = {
  event_name: "UNAPPROVED_EVENT_TYPE",
};

const invalidShapeEvent = {
  component_id: "component_id",
  event_name: "AIS_EVENT_TRANSITION_APPLIED",
  event_timestamp_ms: Date.now(),
  timestamp: Date.now(),
  junk: {},
};

export default function () {
  check(validateEvent(validEvent), {
    "valid event accepted": (result) => result === true,
  });
  validEventCount.add(1);

  check(validateEvent(invalidNameEvent), {
    "invalid event name rejected": (result) => result === false,
  });
  invalidEventCount.add(1);

  check(validateEvent(invalidShapeEvent), {
    "invalid event shape rejected": (result) => result === false,
  });
  invalidEventCount.add(1);
}
