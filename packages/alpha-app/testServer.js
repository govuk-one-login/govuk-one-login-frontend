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
        { target: 100, duration: "30s" },
        { target: 100, duration: "30s" },
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
    "http://localhost:3000/test-submit-button",
  );

  // const responseWithOutEvent = http.get("http://localhost:3000/api");

  check(responseWithEvent, {
    "status is 200": (r) => r.status === 200,
    "page contains expected content": (r) =>
      r.body && r.body.includes("GOV.UK One Login"),
  }) ||
    console.log(`Request failed: ${response.error || "Connection refused"}`);

  // check(responseWithOutEvent, {
  //   "status is 200": (r) => r.status === 200,
  //   "page contains expected content": (r) =>
  //     r.body && r.body.includes("GOV.UK One Login"),
  // }) ||
  //   console.log(`Request failed: ${response.error || "Connection refused"}`);
}
