import http from "http";
import https from "https";
import { type EventLoopUtilization } from "perf_hooks";
import { type Express } from "express";
// Importing package.json with the declared type
import pjson from "../package.json";
import { createLogger, TLogLevel } from "./utils/logger";
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
  logLevel: TLogLevel;
  metrics: TMetric[];
  staticPaths: (string | RegExp)[];
}

export const frontendVitalSignsInit = (
  server: http.Server | https.Server,
  options: Partial<IOptions> = {},
) => {
  const {
    interval = 10000,
    logLevel = "info",
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

  const logger = createLogger(logLevel);

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
      avgResponseTime?: {
        dynamic: number | null;
        static: number | null;
      };
      eventLoopDelay?: number;
      eventLoopUtilization?: EventLoopUtilization;
      maxConcurrentConnections?: number;
      requestsPerSecond?: { static: number; dynamic: number };
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
      metricsObject.avgResponseTime = {
        dynamic: getAvgDynamicResponseTime(),
        static: getAvgStaticResponseTime(),
      };
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

/**
 * This function allows us to attach the FE vitals package to an Express.Application for situations
 * where we don't have direct access to the HTTP/S server returned by app.listen. It must be called
 * before app.listen is called.
 *
 * @example
 * const app = express();
 * frontendVitalSignsInitFromApp(app);
 * app.listen(port, () => {
 *   console.log(`Example app listening on port ${port}`);
 * });
 *
 * @param app - An Express.Application that has not yet been started—ie. app.listen hasn't yet been called.
 * @param options - Configuration options for the frontend vitals package.
 */
export function frontendVitalSignsInitFromApp(
  app: Express,
  options: Partial<IOptions> = {},
) {
  let { listen } = app;
  const originalListen = listen;
  listen = function (...args: Parameters<typeof originalListen>) {
    const server = originalListen.apply(app, args);
    frontendVitalSignsInit(server, options);
    return server;
  } as typeof originalListen;
}
