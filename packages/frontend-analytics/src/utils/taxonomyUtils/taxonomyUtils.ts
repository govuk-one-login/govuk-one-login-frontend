import logger from "loglevel";
import {
  type PageViewParametersInterface,
  TaxonomyLevels,
} from "../../analytics/pageViewTracker/pageViewTracker.interface";

const PERSISTED_FROM_PREVIOUS_PAGE = "persisted from previous page";

/**
 * Feature-tests whether localStorage is available and usable.
 *
 * Covers both the case where `window.localStorage` is null/undefined and the
 * case where accessing it or writing to it throws (e.g. Safari private mode
 * raising SecurityError / QuotaExceededError). Returns false instead of
 * throwing so callers can bypass storage gracefully.
 *
 * @return {boolean} True if localStorage can be written to and read from.
 */
const isLocalStorageAvailable = (): boolean => {
  try {
    const storage = window.localStorage;
    if (!storage) {
      return false;
    }
    const testKey = "__taxonomy_storage_test__";
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

export const setTaxonomies = (pageViewParams: PageViewParametersInterface) => {
  if (!isLocalStorageAvailable()) {
    logger.warn(
      "localStorage is unavailable; skipping persistence of taxonomy levels.",
    );
    return;
  }

  for (const [key, value] of Object.entries(pageViewParams)) {
    if (key.includes("taxonomy") && value !== PERSISTED_FROM_PREVIOUS_PAGE) {
      // if taxonomy is not "persisted from...", then store this into localStorage
      localStorage.setItem(`${key}`, value);
    }
  }
};

export const getTaxonomy = (
  taxonomy: string | undefined,
  level: string,
): string => {
  if (taxonomy === PERSISTED_FROM_PREVIOUS_PAGE) {
    if (!isLocalStorageAvailable()) {
      logger.warn(
        "localStorage is unavailable; cannot retrieve persisted taxonomy level, " +
          `falling back to "${PERSISTED_FROM_PREVIOUS_PAGE}".`,
      );
      return PERSISTED_FROM_PREVIOUS_PAGE;
    }

    return (
      localStorage.getItem(
        `${TaxonomyLevels[level as keyof typeof TaxonomyLevels]}`,
      ) ?? PERSISTED_FROM_PREVIOUS_PAGE
    );
  }

  return taxonomy!;
};
