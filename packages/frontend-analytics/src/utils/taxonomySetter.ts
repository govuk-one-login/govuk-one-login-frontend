import { PageViewParametersInterface } from "../analytics/pageViewTracker/pageViewTracker.interface";

export const setTaxonomies = (pageViewParams: PageViewParametersInterface) => {
  pageViewParams.filter();
};
