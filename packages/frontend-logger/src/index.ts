import type { Logger as PinoLogger, LoggerOptions } from "pino";
import { pino } from "pino";

export type TLogLevel =
  | "fatal"
  | "error"
  | "warn"
  | "info"
  | "debug"
  | "trace"
  | "silent";

export type CustomLogger = {
  trace: (message: unknown) => void;
  warn: (message: unknown) => void;
  info: (message: unknown) => void;
  error: (message: unknown) => void;
};

export type Logger = PinoLogger | CustomLogger;

let logger: Logger | undefined;

const initialiseDefaultLogger = () => {
  logger = pino({
    name: "@govuk-one-login/default-logger",
    level: process.env.LOG_LEVEL ?? process.env.LOGS_LEVEL ?? "warn",
  });
};

export const setCustomLogger = (customLogger: CustomLogger) => {
  if (logger) {
    logger.warn("Setting custom logger when one already exists");
  }

  logger = customLogger;
};

export const getLogger = (): Logger => {
  if (!logger) {
    initialiseDefaultLogger();
    if (!logger) {
      throw new Error("Error initialising default logger");
    }
  }

  return logger;
};

export const createLogger = (loggerOptions: LoggerOptions) => {
  if (logger) {
    logger.warn("Creating new logger with config when one already exists");
  }

  logger = pino(loggerOptions);

  return logger;
};

export const resetLogger = () => {
  logger = undefined;
};
