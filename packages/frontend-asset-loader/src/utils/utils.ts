import { PathAndFile } from "./utils.types";
import { getLogger } from "../utils/logger";

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
