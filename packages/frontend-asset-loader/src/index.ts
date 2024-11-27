
import fg from "fast-glob";
import { Express } from "express";
import {
  getDuplicateHashedFileName,
  mapAssetsToLocal,
  parseAssets,
} from "./utils/utils";

import { getLogger, CustomLogger, setLogger } from "./utils/logger";

export const loadAssets = (
  app: Express,
  assetPath: string,
  hashBetween = { start: "-", end: "." },
  customLogger?: CustomLogger
) => {
  setLogger(customLogger);
  const assets = fg.sync(assetPath);
  const pathsAndFiles = parseAssets(assets, hashBetween);
  const logger = getLogger();

  const duplicateFileName = getDuplicateHashedFileName(pathsAndFiles);
  if (duplicateFileName) {
    logger.warn(
      `Warning: Duplicate asset name detected. Each asset must have a unique name. Duplicate found: ${duplicateFileName}`
    );
  }

  mapAssetsToLocal(app, pathsAndFiles);
};

