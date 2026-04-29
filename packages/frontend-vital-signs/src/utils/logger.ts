import {
  createLogger as createPinoLogger,
  type TLogLevel,
} from "@govuk-one-login/frontend-logger";

export function createLogger(logLevel: TLogLevel) {
  const logger = createPinoLogger({
    name: "@govuk-one-login/frontend-vital-signs",
    level: logLevel,
  });

  return logger;
}
