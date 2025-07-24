import {
  PageViewParametersInterface,
  TaxonomyLevels,
} from "../../analytics/pageViewTracker/pageViewTracker.interface";

export const setTaxonomies = (pageViewParams: PageViewParametersInterface) => {
  for (const [key, value] of Object.entries(pageViewParams)) {
    if (key.includes("taxonomy") && value !== "persisted from previous page") {
      // if taxonomy is not "persisted from...", then store this into localStorage
      localStorage.setItem(`${key}`, value);
    }
  }
};

export const getTaxonomy = (
  taxonomy: string | undefined,
  level: string,
): string => {
  if (taxonomy === "persisted from previous page") {
    return localStorage.getItem(
      `${TaxonomyLevels[level as keyof typeof TaxonomyLevels]}`,
    )!;
  }

  return taxonomy!;
};
