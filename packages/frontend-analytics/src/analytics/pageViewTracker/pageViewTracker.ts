import {
  PageViewParametersInterface,
  PageViewEventInterface,
} from "./pageViewTracker.interface";
import { validateParameter } from "../../utils/validateParameter";
import { trackFormError } from "../formErrorTracker/formErrorTracker";
import { OptionsInterface } from "../core/core.interface";
import { getTaxonomy, setTaxonomies } from "../../utils/taxonomyUtils";
import { pushToDataLayer } from "../../utils/pushToDataLayer";
import {
  getLanguage,
  getLocation,
  getReferrer,
  getLoggedInStatus,
  getFirstPublishedAt,
  getUpdatedAt,
  getRelyingParty,
} from "./utils/pageViewTracker.utils";

export class PageViewTracker {
  eventName: string = "page_view_ga4";
  enableGa4Tracking: boolean;
  enableFormErrorTracking: boolean;
  enablePageViewTracking: boolean;
  organisations: string = "<OT1056>";
  primary_publishing_organisation: string =
    "government digital service - digital identity";

  constructor(options: OptionsInterface) {
    this.enableGa4Tracking = options.enableGa4Tracking ?? false;
    this.enableFormErrorTracking = options.enableFormErrorTracking ?? true;
    this.enablePageViewTracking = options.enablePageViewTracking ?? true;
  }

  trackOnPageLoad(parameters: PageViewParametersInterface): void {
    if (
      window.DI.analyticsGa4.cookie.hasCookie &&
      !window.DI.analyticsGa4.cookie.consent
    ) {
      return;
    }
    if (!this.enableGa4Tracking) {
      return;
    }

    // trigger form error tracking if pageView is enabled
    const errorTrigger = document.getElementsByClassName("govuk-error-message");

    if (errorTrigger.length) {
      if (this.enableFormErrorTracking) {
        trackFormError();
      }
      return;
    }

    if (!this.enablePageViewTracking) {
      return;
    }

    setTaxonomies(parameters);

    const pageViewTrackerEvent: PageViewEventInterface = {
      event: this.eventName,
      page_view: {
        language: getLanguage(),
        location: getLocation(),
        organisations: this.organisations,
        primary_publishing_organisation: this.primary_publishing_organisation,
        referrer: getReferrer(),
        status_code: validateParameter(parameters.statusCode.toString(), 3),
        title: validateParameter(parameters.englishPageTitle, 300),
        taxonomy_level1: validateParameter(parameters.taxonomy_level1, 100),
        taxonomy_level2: validateParameter(
          getTaxonomy(parameters.taxonomy_level2, "Level2"),
          100,
        ),
        content_id: validateParameter(parameters.content_id, 100),
        logged_in_status: getLoggedInStatus(parameters.logged_in_status),
        dynamic: parameters.dynamic.toString(),
        first_published_at: getFirstPublishedAt(),
        updated_at: getUpdatedAt(),
        relying_party: getRelyingParty(),
        taxonomy_level3: validateParameter(
          getTaxonomy(parameters.taxonomy_level3, "Level3"),
          100,
        ),
        taxonomy_level4: validateParameter(
          getTaxonomy(parameters.taxonomy_level4, "Level4"),
          100,
        ),
        taxonomy_level5: validateParameter(
          getTaxonomy(parameters.taxonomy_level5, "Level5"),
          100,
        ),
      },
    };

    pushToDataLayer(pageViewTrackerEvent);
  }
}
