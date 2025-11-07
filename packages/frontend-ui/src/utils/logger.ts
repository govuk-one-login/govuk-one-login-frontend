import type { Logger } from "pino";
import { pino } from "pino";

let logger: Logger | undefined | CustomLogger;

export type CustomLogger = {
  trace: (message: string) => void;
  warn: (message: string) => void;
};

export const setCustomLogger = (customLogger: CustomLogger) => {
  logger = customLogger;
};

export const getLogger = (): Logger | CustomLogger => {
  if (!logger) {
    logger = pino({
      name: "@govuk-one-login/frontend-passthrough-headers",
      level: process.env.LOG_LEVEL ?? process.env.LOGS_LEVEL ?? "warn",
    });

    return logger;
  }

  return logger;
};

export const resetLogger = () => {
  logger = undefined;
};
