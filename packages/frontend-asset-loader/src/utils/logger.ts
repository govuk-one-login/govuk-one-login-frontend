import pino from "pino";

let logger: pino.Logger | undefined | CustomLogger;

export type CustomLogger = {
  trace: (message: string) => void;
  warn: (message: string) => void;
};

export const setLogger = (customLogger?: CustomLogger) => {
  if (logger) {
    logger.warn("Warning: Logging instance already exists");
    return;
  }

  if (customLogger) {
    logger = customLogger;
    return;
  }

  logger = pino({
    name: "@govuk-one-login/frontend-asset-loader",
    level: process.env.LOG_LEVEL ?? process.env.LOGS_LEVEL ?? "warn",
  });
};

export const getLogger = (): pino.Logger | CustomLogger => {
  if (!logger) {
    console.warn("Warning: Logger is undefined");
    return console;
  }
  return logger;
};
