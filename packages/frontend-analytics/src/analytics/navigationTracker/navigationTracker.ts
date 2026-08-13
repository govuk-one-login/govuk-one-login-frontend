import logger from "loglevel";
import {
  getDomain,
  getDomainPath,
} from "../../utils/dataScrapersUtils/dataScrapers";
import { pushToDataLayer } from "../../utils/pushToDataLayerUtil/pushToDataLayer";
import { validateParameter } from "../../utils/validateParameterUtils/validateParameter";
import {
  NavigationElement,
  NavigationEventInterface,
} from "./navigationTracker.interface";
import {
  getLinkType,
  getSection,
  getTargetUrl,
} from "./navigationTrackerUtils/navigationTrackerGetUtils";
import {
  isExternalLink,
  isNavigatingElement,
} from "./navigationTrackerUtils/navigationTrackerLinkUtils";
import { hasConsentForAnalytics } from "../../cookie/cookie";

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
   * Finds the nearest anchor or button ancestor from the clicked element.
   * Uses closest() to properly handle event delegation — ensures we always
   * resolve to the actual navigating element regardless of which child
   * element received the click.
   *
   * @param {HTMLElement} target - The element that received the click event.
   * @return {NavigationElement | null} The nearest <a> or <button> ancestor, or null if none found.
   */
  getNavigatingAncestor(target: HTMLElement): NavigationElement | null {
    return target.closest("a, button") as NavigationElement | null;
  }

  /**
   * Tracks navigation click events and sends the relevant data to the data layer.
   *
   * @param {Event} event - The click event.
   * @return {boolean} Returns true if the event was successfully tracked, false otherwise.
   */
  trackNavigation(event: Event): boolean {
    if (!this.isEnabled()) return false;

    const target = event.target as HTMLElement;
    if (!target) return false;

    const element = this.getNavigatingAncestor(target);
    if (!element) return false;

    if (!isNavigatingElement(element)) return false;

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
    if (!hasConsentForAnalytics()) {
      return false;
    }
    if (!this.enableNavigationTracking) {
      return false;
    }
    return true;
  }
}
