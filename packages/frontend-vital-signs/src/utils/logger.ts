import pino from "pino";

export function createLogger() {
  const logLevelSet = process.env.LOG_LEVEL || process.env.LOGS_LEVEL;

  let logLevel = "";
  let warning = "";

  const validLogLevels = [
    "fatal",
    "error",
    "warn",
    "info",
    "debug",
    "trace",
    "silent",
  ];

  if (logLevelSet === undefined) {
    logLevel = "warn"; // Default log level
    warning = `Log level is undefined. Must be one of ${validLogLevels.join(", ")}`;
  } else if (!validLogLevels.includes(logLevelSet)) {
    logLevel = "warn"; // Default log level
    warning = `Invalid log level: ${logLevelSet}. Must be one of ${validLogLevels.join(", ")}`;
  } else {
    logLevel = logLevelSet; // Valid log level
  }

  const logger = pino({
    name: "@govuk-one-login/frontend-vital-signs",
    level: logLevel,
  });

  if (warning) {
    logger.warn(warning);
  }

  return logger;
}
