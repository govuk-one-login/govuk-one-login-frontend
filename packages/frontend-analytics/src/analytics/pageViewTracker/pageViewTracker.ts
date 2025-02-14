import {
  PageViewParametersInterface,
  PageViewEventInterface,
} from "./pageViewTracker.interface";
import { validateParameter } from "../../utils/validateParameter";
import { FormErrorTracker } from "../formErrorTracker/formErrorTracker";
import { OptionsInterface } from "../core/core.interface";
import { getTaxonomy, setTaxonomies } from "../../utils/taxonomyUtils";
import { pushToDataLayer } from "../../utils/pushToDataLayer";

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
        const formErrorTracker = new FormErrorTracker();
        formErrorTracker.trackFormError();
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
        language: PageViewTracker.getLanguage(),
        location: PageViewTracker.getLocation(),
        organisations: this.organisations,
        primary_publishing_organisation: this.primary_publishing_organisation,
        referrer: PageViewTracker.getReferrer(),
        status_code: validateParameter(parameters.statusCode.toString(), 3),
        title: validateParameter(parameters.englishPageTitle, 300),
        taxonomy_level1: validateParameter(parameters.taxonomy_level1, 100),
        taxonomy_level2: validateParameter(
          getTaxonomy(parameters.taxonomy_level2, "Level2"),
          100,
        ),
        content_id: validateParameter(parameters.content_id, 100),
        logged_in_status: PageViewTracker.getLoggedInStatus(
          parameters.logged_in_status,
        ),
        dynamic: parameters.dynamic.toString(),
        first_published_at: PageViewTracker.getFirstPublishedAt(),
        updated_at: PageViewTracker.getUpdatedAt(),
        relying_party: PageViewTracker.getRelyingParty(),
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

  /**
   * Returns a string representing the logged in status.
   *
   * @param {boolean} loggedInStatus - The logged in status.
   * @return {string} The string representation of the logged in status.
   */
  static getLoggedInStatus(loggedInStatus: boolean | undefined): string {
    if (loggedInStatus === undefined) {
      return "undefined";
    }

    return loggedInStatus ? "logged in" : "logged out";
  }

  /**
   * Returns the value of the 'govuk:first-published-at' meta tag attribute, if it exists.
   *
   * @return {string} The value of the 'govuk:first-published-at' meta tag attribute, or "undefined" if it does not exist.
   */
  static getFirstPublishedAt(): string {
    return (
      document
        .querySelector('meta[name="govuk:first-published-at"]')
        ?.getAttribute("content") ?? "undefined"
    );
  }

  /**
   * Retrieves the value of the 'govuk:updated-at' meta tag attribute from the document.
   *
   * @return {string} The value of the 'govuk:updated-at' meta tag attribute, or "undefined" if it is not found.
   */
  static getUpdatedAt(): string {
    return (
      document
        .querySelector('meta[name="govuk:updated-at"]')
        ?.getAttribute("content") ?? "undefined"
    );
  }

  /**
   * Returns the hostname of the current document location.
   *
   * @return {string} The hostname of the current document location.
   */
  static getRelyingParty(): string {
    return document.location.hostname;
  }

  /**
   * Retrieves the language code from the HTML document and returns it in lowercase.
   *
   * @return {string} The language code. Defaults to "en" if no language code is found.
   */
  static getLanguage(): string {
    const languageCode = document.querySelector("html")?.getAttribute("lang");
    return languageCode?.toLowerCase() ?? "undefined";
  }

  /**
   * Returns the current location URL as a lowercase string.
   *
   * @return {string} The current location URL as a lowercase string, or "undefined" if not available.
   */
  static getLocation(): string {
    return document.location.href?.toLowerCase() ?? "undefined";
  }

  /**
   * Retrieves the referrer of the current document.
   *
   * @return {string} The referrer as a lowercase string, or "undefined" if it is empty.
   */
  static getReferrer(): string {
    return document.referrer.length
      ? document.referrer?.toLowerCase()
      : "undefined";
  }
}
