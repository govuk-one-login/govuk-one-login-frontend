import { readFileSync } from "fs";
import { join } from "path";
import pino from "pino";

const packageJsonPath = join(__dirname, "../package.json");
const pjson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

const logLevel = process.env.LOG_LEVEL || process.env.LOGS_LEVEL || "warn";

const validLogLevels = [
  "fatal",
  "error",
  "warn",
  "info",
  "debug",
  "trace",
  "silent",
];
if (!validLogLevels.includes(logLevel)) {
  throw new Error(
    `Invalid log level: ${logLevel}. Must be one of ${validLogLevels.join(", ")}`,
  );
}

const metricsObject = {
  version: pjson.version,
};

export const logger = pino({
  name: "@govuk-one-login/frontend-vital-signs",
  // level: logLevel,
});

const logMessage = () => {
  logger.info(metricsObject);
};

export const frontendVitalsInit = (interval: number) => {
  setInterval(logMessage, interval);
};

if (logLevel === "warn") {
  logger.warn(
    "Log level is set to default 'warn'. Please set the LOG_LEVEL or LOGS_LEVEL environment variable.",
  );
}
