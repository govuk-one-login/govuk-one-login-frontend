import { check, fail, group } from "k6";
import http from "k6/http";
import { Trend } from "k6/metrics";
const durations = new Trend("duration", true);
function timeFunction(fn) {
  const start = Date.now();
  const res = fn();
  const end = Date.now();
  return [res, end - start];
}
function timeRequest(fn, checks = {}) {
  const [res, duration] = timeFunction(fn);
  check(res, checks)
    ? durations.add(duration)
    : fail("Response validation failed");
  return res;
}
function timeGroup(name, fn, checks = {}) {
  return group(name, () => timeRequest(fn, checks));
}

// ---

export const options = {
  scenarios: {
    ui: {
      executor: "ramping-arrival-rate",
      startRate: 1,
      timeUnit: "1s",
      preAllocatedVUs: 1,
      maxVUs: 100,
      stages: [
        { target: 500, duration: "120s" }, // Ramps up to target load
        { target: 500, duration: "120s" }, // Holds at target load
      ],
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<1000"], // 95th percntile response time <1000ms
    http_req_failed: ["rate<0.05"], // Error rate <5%
  },
};

export default function pocApp() {
  timeGroup("GET - {pocApp} /", () => http.get("http://localhost:3000"), {
    isStatusCode200(response) {
      return response.status === 200;
    },
    validatePageContent: (r) => r.body.includes("Using your GOV.UK One Login"),
  });
}
