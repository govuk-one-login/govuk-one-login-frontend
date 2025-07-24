import logger from "loglevel";
import {
  NavigationElement,
  NavigationEventInterface,
} from "./navigationTracker.interface";
import { validateParameter } from "../../utils/validateParameterUtils/validateParameter";
import {
  getDomain,
  getDomainPath,
  isChangeLink,
} from "../../utils/dataScrapersUtils/dataScrapers";
import { pushToDataLayer } from "../../utils/pushToDataLayerUtil/pushToDataLayer";
import { isExternalLink } from "./navigationTrackerUtils/navigationTrackerLinkUtils";
import {
  getContainingElement,
  getTargetUrl,
  getLinkType,
  getSection,
} from "./navigationTrackerUtils/navigationTrackerGetUtils";

export class NavigationTracker {
  eventName: string = "event_data";
  enableNavigationTracking: boolean;

  constructor(enableNavigationTracking: boolean) {
    this.enableNavigationTracking = enableNavigationTracking;
    this.initialiseEventListener();
  }

  /**
   * Initialises the event listener for the document click event.
   *
   * @param {type} None
   * @return {type} None
   */
  initialiseEventListener() {
    document.addEventListener("click", this.trackNavigation.bind(this), false);
  }

  /**
   * Tracks the page load event and sends the relevant data to the data layer.
   *
   * @param {PageViewParametersInterface} parameters - The parameters for the page view event.
   * @return {boolean} Returns true if the event was successfully tracked, false otherwise.
   */
  trackNavigation(event: Event): boolean {
    if (!this.isEnabled()) return false;

    let element: NavigationElement = event.target as NavigationElement;
    const crownAnchor: NavigationElement = document.querySelector(
      "a.govuk-header__link",
    ) as NavigationElement;
    element = getContainingElement(element, crownAnchor) as NavigationElement;

    if (!NavigationTracker.isNavigatingElement(element)) return false;

    const targetUrl = getTargetUrl(element);

    const navigationTrackerEvent: NavigationEventInterface = {
      event: this.eventName,
      event_data: {
        event_name: "navigation",
        type: getLinkType(element),
        url: validateParameter(targetUrl, 500),
        text: element.textContent
          ? validateParameter(element.textContent.trim(), 100)
          : "undefined",
        section: getSection(element),
        action: "undefined",
        external: isExternalLink(targetUrl) ? "true" : "false",
        link_domain: getDomain(targetUrl),
        "link_path_parts.1": getDomainPath(targetUrl, 0),
        "link_path_parts.2": getDomainPath(targetUrl, 1),
        "link_path_parts.3": getDomainPath(targetUrl, 2),
        "link_path_parts.4": getDomainPath(targetUrl, 3),
        "link_path_parts.5": getDomainPath(targetUrl, 4),
      },
    };

    try {
      pushToDataLayer(navigationTrackerEvent);
      return true;
    } catch (err) {
      logger.error("Error in trackNavigation", err);
      return false;
    }
  }

  isEnabled() {
    if (!window.DI.analyticsGa4.cookie.consent) {
      return false;
    }
    if (!this.enableNavigationTracking) {
      return false;
    }
    return true;
  }

  static isNavigatingElement(element: NavigationElement) {
    /**
     * Navigation tracker is only for links and navigation buttons
     */
    if (element.tagName !== "A" && element.tagName !== "BUTTON") {
      return false;
    }

    /*
     * Navigation tracker is only for links and navigation buttons outside of error summary list
     */
    if (
      element.parentElement?.parentElement?.className.includes(
        "govuk-error-summary__list",
      )
    ) {
      return false;
    }

    if (element instanceof HTMLAnchorElement) {
      if (
        !element.href?.length ||
        element.href === "#" ||
        element.href === `${window.location.href}#`
      ) {
        return false;
      }
    }

    if (
      element.tagName === "BUTTON" &&
      !element.attributes.getNamedItem("data-nav")
    ) {
      return false;
    }

    // Ignore change links
    if (isChangeLink(element)) {
      return false;
    }

    return true;
  }
}
