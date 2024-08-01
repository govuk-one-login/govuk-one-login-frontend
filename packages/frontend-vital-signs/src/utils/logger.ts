import pino from "pino";

export type TLogLevel =
  | "fatal"
  | "error"
  | "warn"
  | "info"
  | "debug"
  | "trace"
  | "silent";

export function createLogger(logLevel: TLogLevel) {
  const logger = pino({
    name: "@govuk-one-login/frontend-vital-signs",
    level: logLevel,
  });

  return logger;
}
