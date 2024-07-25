import http from "http";
import https from "https";
import { type EventLoopUtilization } from "perf_hooks";
// Importing package.json with the declared type
import pjson from "../package.json";
import { createLogger } from "./utils/logger";
import {
  calculateAvgResponseTime,
  getAvgDynamicResponseTime,
  getAvgStaticResponseTime,
} from "./metrics/avgResponseTime";
import { trackEventLoopDelay } from "./metrics/eventLoopDelay";
import { trackEventLoopUtilization } from "./metrics/eventLoopUtilization";
import {
  calculateMaxConcurrentConnections,
  getMaxConcurrentConnections,
} from "./metrics/maxConcurrentConnections";
import { trackRequestsPerSecond } from "./metrics/requestsPerSecond";

type TMetric =
  | "avgResponseTime"
  | "eventLoopDelay"
  | "eventLoopUtilization"
  | "maxConcurrentConnections"
  | "requestsPerSecond";

interface IOptions {
  interval: number;
  metrics: TMetric[];
  staticPaths: (string | RegExp)[];
}

export const frontendVitalsInit = (
  server: http.Server | https.Server,
  options: Partial<IOptions> = {},
) => {
  const {
    interval = 10000,
    metrics = [
      "avgResponseTime",
      "eventLoopDelay",
      "eventLoopUtilization",
      "maxConcurrentConnections",
      "requestsPerSecond",
    ],
    staticPaths = [],
  } = options;

  const staticPathsRegexp = staticPaths.map((path) => {
    if (path instanceof RegExp) return path;
    return new RegExp(`^${path}`);
  });

  const logger = createLogger();

  const eventLoopDelay = metrics.includes("eventLoopDelay")
    ? trackEventLoopDelay()
    : undefined;

  const getEventLoopUtilization = metrics.includes("eventLoopUtilization")
    ? trackEventLoopUtilization()
    : undefined;

  const getRequestsPerSecond = metrics.includes("requestsPerSecond")
    ? trackRequestsPerSecond(server, staticPathsRegexp)
    : undefined;

  if (metrics.includes("avgResponseTime")) {
    calculateAvgResponseTime(server, staticPathsRegexp);
  }
  if (metrics.includes("maxConcurrentConnections")) {
    calculateMaxConcurrentConnections(server);
  }

  const metricsInterval = setInterval(() => {
    const metricsObject: {
      version: string;
      requestsPerSecond?: { static: number; dynamic: number };
      avgStaticResponseTime?: number | null;
      avgDynamicResponseTime?: number | null;
      maxConcurrentConnections?: number;
      eventLoopDelay?: number;
      eventLoopUtilization?: EventLoopUtilization;
    } = {
      version: pjson.version,
    };

    if (eventLoopDelay) {
      metricsObject.eventLoopDelay = eventLoopDelay.getEventLoopDelay();
    }

    if (getEventLoopUtilization) {
      metricsObject.eventLoopUtilization = getEventLoopUtilization();
    }

    if (getRequestsPerSecond) {
      metricsObject.requestsPerSecond = getRequestsPerSecond(interval);
    }

    if (metrics.includes("avgResponseTime")) {
      metricsObject.avgStaticResponseTime = getAvgStaticResponseTime();
    }

    if (metrics.includes("avgResponseTime")) {
      metricsObject.avgDynamicResponseTime = getAvgDynamicResponseTime();
    }

    if (metrics.includes("maxConcurrentConnections")) {
      metricsObject.maxConcurrentConnections = getMaxConcurrentConnections();
    }

    logger.info(metricsObject);
  }, interval);

  function stop() {
    if (metricsInterval) clearInterval(metricsInterval);
    if (eventLoopDelay) eventLoopDelay.stop();
  }

  process.on("exit", stop);

  return stop;
};
