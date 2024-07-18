import http from "http";
import https from "https";
// Importing package.json with the declared type
import pjson from "../package.json";
import { getLogger } from "./utils/logger";
import {
  getRequestsPerSecondValues,
  trackRequestsPerSecond,
} from "./metrics/requestsPerSecond";

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
    metrics = ["requestsPerSecond"],
    staticPaths = [],
  } = options;

  const staticPathsRegexp = staticPaths.map((path) => {
    if (path instanceof RegExp) return path;
    return new RegExp(`^${path}`);
  });

  const logger = getLogger();

  if (metrics.includes("requestsPerSecond")) {
    trackRequestsPerSecond(server, staticPathsRegexp);
  }

  const metricsInterval = setInterval(() => {
    logger.info({
      version: pjson.version,
      ...(metrics.includes("requestsPerSecond")
        ? { requestsPerSecond: getRequestsPerSecondValues(interval) }
        : {}),
    });
  }, interval);

  process.on("exit", () => {
    clearInterval(metricsInterval);
  });
};
