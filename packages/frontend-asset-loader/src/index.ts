import {
  type CustomLogger,
  getLogger,
  setCustomLogger,
} from "@govuk-one-login/frontend-logger";
import type { Express } from "express";
import fg from "fast-glob";
import {
  getDuplicateHashedFileName,
  mapAssetsToLocal,
  parseAssets,
} from "./utils/utils";

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
