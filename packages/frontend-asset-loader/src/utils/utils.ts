import { PathAndFile } from "./utils.types";
import { getLogger } from "../utils/logger";
import { Express } from "express";

declare module "express" {
  interface Application {
    locals: { [key: string]: unknown };
  }
}

export const getDuplicateHashedFileName = (
  array: PathAndFile[],
): string | null => {
  const seen = new Set<string>();

  for (const obj of array) {
    if (seen.has(obj.hashedFileName)) {
      return obj.hashedFileName;
    }
    seen.add(obj.hashedFileName);
  }

  return null;
};

export const isValidHashName = (
  hashName: string,
  hashStart: string,
  hashEnd: string,
): boolean => {
  const hashStartCount = hashName.split(hashStart).length - 1;
  const hashEndCount = hashName.split(hashEnd).length - 1;
  const logger = getLogger();

  if (hashStartCount !== 1 && hashEndCount !== 1) {
    logger.warn(
      `Warning: Incorrect number of hash start "${hashStart}" and hash end "${hashEnd}" identifiers found in ${hashName}`,
    );
    return false;
  }

  if (hashStartCount !== 1) {
    logger.warn(
      hashStartCount > 1
        ? `Warning: Too many hash start "${hashStart}" identifers found in ${hashName}`
        : `Warning: No hash start "${hashStart}" identifer found in ${hashName}`,
    );
    return false;
  }

  if (hashEndCount !== 1) {
    logger.warn(
      hashEndCount > 1
        ? `Warning: Too many hash end "${hashEnd}" identifers found in ${hashName}`
        : `Warning: No hash end "${hashEnd}" identifer found in ${hashName}`,
    );
    return false;
  }

  return true;
};

export const parseAssets = (
  assets: string[],
  hashBetween: { start: string; end: string },
): PathAndFile[] => {
  return assets.map((asset) => {
    const pathParts = asset.split("/");
    const hashedFileName = pathParts[pathParts.length - 1];

    if (isValidHashName(hashedFileName, hashBetween.start, hashBetween.end)) {
      const [fileName, hashedExtension] = hashedFileName.split(
        hashBetween.start,
      );
      const [hash, extension] = hashedExtension.split(hashBetween.end);
      return {
        hashedFileName,
        hash: hash,
        fileName: `${fileName}.${extension}`,
      };
    }

    return { hashedFileName, fileName: hashedFileName };
  });
};

export const mapAssetsToLocal = (
  app: Express,
  pathsAndFiles: PathAndFile[],
) => {
  app.locals = app.locals || {};

  pathsAndFiles.forEach((pathAndFile) => {
    app.locals.assets = app.locals.assets || {};
    app.locals.assets[pathAndFile.fileName] = pathAndFile.hashedFileName;
  });
};
