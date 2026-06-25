import pino from "pino";

const logger = pino({
  name: "@govuk-one-login/alpha-app",
});

export { logger };
