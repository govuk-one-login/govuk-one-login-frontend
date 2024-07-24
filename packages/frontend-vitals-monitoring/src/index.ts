import http from "http";
import https from "https";
// Importing package.json with the declared type
import pjson from "../package.json";
import { createLogger } from "./utils/logger";
import {
  getRequestsPerSecondValues,
  trackRequestsPerSecond,
} from "./metrics/requestsPerSecond";
import {
  calculateAvgResponseTime,
  getAvgDynamicResponseTime,
  getAvgStaticResponseTime,
} from "./avgResponseTime/avgResponseTime";

interface IOptions {
  interval: number;
  metrics: string[];
  staticPaths: (string | RegExp)[];
}

export const frontendVitalsInit = (
  server: http.Server | https.Server,
  options: Partial<IOptions> = {},
) => {
  const {
    interval = 10000,
    metrics = ["requestsPerSecond", "avgResponseTime"],
    staticPaths = [],
  } = options;

  const staticPathsRegexp = staticPaths.map((path) => {
    if (path instanceof RegExp) return path;
    return new RegExp(`^${path}`);
  });

  const logger = createLogger();

  if (metrics.includes("requestsPerSecond")) {
    trackRequestsPerSecond(server, staticPathsRegexp);
  }
  if (metrics.includes("avgResponseTime")) {
    calculateAvgResponseTime(server, staticPathsRegexp);
  }

  const metricsInterval = setInterval(() => {
    const metricsObject: {
      version: string;
      requestsPerSecond?: { static: number; dynamic: number };
      avgStaticResponseTime?: number | null;
      avgDynamicResponseTime?: number | null;
    } = {
      version: pjson.version,
    };

    if (metrics.includes("requestsPerSecond")) {
      metricsObject.requestsPerSecond = getRequestsPerSecondValues(interval);
    }

    if (metrics.includes("avgResponseTime")) {
      metricsObject.avgStaticResponseTime = getAvgStaticResponseTime();
    }

    if (metrics.includes("avgResponseTime")) {
      metricsObject.avgDynamicResponseTime = getAvgDynamicResponseTime();
    }

    logger.info(metricsObject);
  }, interval);

  process.on("exit", () => {
    clearInterval(metricsInterval);
  });
};
