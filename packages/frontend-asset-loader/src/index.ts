
import fg from "fast-glob";
import { Express } from "express";
import {
  getDuplicateHashedFileName,
  isValidHashName,
} from "./utils/utils";
import { PathAndFile } from "./utils/utils.types";
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

export const parseAssets = (assets: string[], hashBetween: { start: string; end: string }): PathAndFile[] => {
  return assets.map((asset) => {
    const pathParts = asset.split("/");
    const hashedFileName = pathParts[pathParts.length - 1];

    if (isValidHashName(hashedFileName, hashBetween.start, hashBetween.end)){
      
      const [fileName, hashedExtension] = hashedFileName.split(hashBetween.start);
      const [hash, extension] = hashedExtension.split(hashBetween.end);
      return { hashedFileName, hash: hash, fileName: `${fileName}.${extension}`};
    }

    return { hashedFileName, fileName: hashedFileName };
  });
};

export const mapAssetsToLocal = (app: Express, pathsAndFiles: PathAndFile[]) => {
  pathsAndFiles.forEach((pathAndFile) => {
    app.locals.assets = app.locals.assets || {};
    app.locals.assets[pathAndFile.fileName] = pathAndFile.hashedFileName;
  });
};
