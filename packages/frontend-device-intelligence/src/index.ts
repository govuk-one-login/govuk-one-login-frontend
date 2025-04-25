import { getFingerprint, getFingerprintData, setFingerprintCookie } from "./fingerprint/functions";
import "./components";
import logger from "./logger";
import log from "loglevel";

export const setLogLevel = (level: log.LogLevelDesc) => {
    logger.setLevel(level);
};

export { getFingerprint, getFingerprintData, setFingerprintCookie };
