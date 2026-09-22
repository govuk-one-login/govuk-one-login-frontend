import {
  getFingerprint,
  getFingerprintData,
  setFingerprintCookie,
} from "./fingerprint/functions";
import "./components";
import type log from "loglevel";
import logger from "./logger";

export const setLogLevel = (level: log.LogLevelDesc) => {
  logger.setLevel(level);
};

export { getFingerprint, getFingerprintData, setFingerprintCookie };
