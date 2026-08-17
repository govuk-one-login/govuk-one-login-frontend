/**
 * k6 performance test for validateEvent.
 *
 * Prerequisites:
 *   1. Build the package:  npm run build
 *   2. Start the harness:  node src/perf/harness.js
 *   3. Run this script:    k6 run src/perf/validateEvent.k6.js
 */
import http from "k6/http";
import { check } from "k6";

export const options = {
  vus: 10,
  duration: "10s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<50"],
  },
};

const BASE_URL = "http://localhost:3001";

const validEvent = JSON.stringify({
  component_id: "component_id",
  event_name: "AIS_EVENT_TRANSITION_APPLIED",
  event_timestamp_ms: Date.now(),
  timestamp: Date.now(),
});

const invalidEvent = JSON.stringify({
  event_name: "UNAPPROVED_EVENT_TYPE",
});

export default function () {
  const headers = { "Content-Type": "application/json" };

  const validRes = http.post(`${BASE_URL}/validate`, validEvent, { headers });
  check(validRes, {
    "valid event accepted": (r) => r.status === 200 && JSON.parse(r.body).valid === true,
  });

  const invalidRes = http.post(`${BASE_URL}/validate`, invalidEvent, { headers });
  check(invalidRes, {
    "invalid event rejected": (r) => r.status === 200 && JSON.parse(r.body).valid === false,
  });
}
