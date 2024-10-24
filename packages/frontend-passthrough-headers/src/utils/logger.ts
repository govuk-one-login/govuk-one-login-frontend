import { pino } from "pino";

export const logger = pino({
  name: "@govuk-one-login/frontend-passthrough-headers",
  level: process.env.LOG_LEVEL ?? process.env.LOGS_LEVEL ?? "warn",
});

export type CustomLogger = {
  trace: (message: string) => void;
  warn: (message: string) => void;
};
