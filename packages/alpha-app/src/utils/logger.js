/* eslint-disable @typescript-eslint/no-require-imports */
const pino = require("pino");

const logger = pino({
  name: "@govuk-one-login/alpha-app",
});

module.exports = {
  logger,
};
