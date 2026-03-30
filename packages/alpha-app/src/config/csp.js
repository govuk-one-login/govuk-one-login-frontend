/* eslint-disable @typescript-eslint/no-require-imports */
const { promisify } = require("node:util");
const crypto = require("node:crypto");

const randomBytes = promisify(crypto.randomBytes);

const cspNonce = async (req, res, next) => {
  res.locals.cspNonce = (await randomBytes(16)).toString("hex");

  next();
};

module.exports = {
  cspNonce,
};
