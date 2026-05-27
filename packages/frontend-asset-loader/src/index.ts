import fg from "fast-glob";
import { Express } from "express";
import {
  getDuplicateHashedFileName,
  mapAssetsToLocal,
  parseAssets,
} from "./utils/utils";
import {
  getLogger,
  setCustomLogger,
  type CustomLogger,
} from "@govuk-one-login/frontend-logger";

export const loadAssets = (
  app: Express,
  assetPath: string,
  hashBetween = { start: "-", end: "." },
  customLogger?: CustomLogger,
) => {
  if (customLogger) {
    setCustomLogger(customLogger);
  }
  const logger = getLogger();
  const assets = fg.sync(assetPath);
  const pathsAndFiles = parseAssets(assets, hashBetween);

  const duplicateFileName = getDuplicateHashedFileName(pathsAndFiles);
  if (duplicateFileName) {
    logger.warn(
      `Warning: Duplicate asset name detected. Each asset must have a unique name. Duplicate found: ${duplicateFileName}`,
    );
  }

  mapAssetsToLocal(app, pathsAndFiles);
};
