/* eslint-disable @typescript-eslint/no-require-imports */
const pino = require("pino");

const logger = pino({});

module.exports = {
  logger,
};
