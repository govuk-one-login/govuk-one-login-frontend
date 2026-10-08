import { check } from "k6";
import http from "k6/http";

export const options = {
  scenarios: {
    ui: {
      executor: "ramping-arrival-rate",
      startRate: 1,
      timeUnit: "1s",
      preAllocatedVUs: 1,
      maxVUs: 100,
      stages: [
        { target: 400, duration: "30s" },
        { target: 400, duration: "30s" },
      ],
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<1000"],
    http_req_failed: ["rate<0.05"],
  },
};

export default function pocApp() {
  const responseWithEvent = http.get(
    "http://localhost:3000/api/test-event-validation",
  );

  check(responseWithEvent, {
    "status is 200": (r) => r.status === 200
  }) ||
    console.log(`Request failed: ${response.error || "Connection refused"}`);
}
