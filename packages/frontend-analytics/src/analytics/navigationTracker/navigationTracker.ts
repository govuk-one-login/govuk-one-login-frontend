import logger from "loglevel";
import {
  NavigationElement,
  NavigationEventInterface,
} from "./navigationTracker.interface";
import { validateParameter } from "../../utils/validateParameter";
import {
  getDomain,
  getDomainPath,
  isChangeLink,
} from "../../utils/dataScrapers";
import { pushToDataLayer } from "../../utils/pushToDataLayer";

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
    element = NavigationTracker.getContainingElement(
      element,
      crownAnchor,
    ) as NavigationElement;

    if (!NavigationTracker.isNavigatingElement(element)) return false;

    const targetUrl = NavigationTracker.getTargetUrl(element);

    const navigationTrackerEvent: NavigationEventInterface = {
      event: this.eventName,
      event_data: {
        event_name: "navigation",
        type: NavigationTracker.getLinkType(element),
        url: validateParameter(targetUrl, 500),
        text: element.textContent
          ? validateParameter(element.textContent.trim(), 100)
          : "undefined",
        section: NavigationTracker.getSection(element),
        action: "undefined",
        external: NavigationTracker.isExternalLink(targetUrl)
          ? "true"
          : "false",
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

  static getTargetUrl(element: NavigationElement) {
    if (element instanceof HTMLAnchorElement) {
      return element.href;
    }

    if (
      element.tagName === "BUTTON" &&
      element.attributes.getNamedItem("data-link")
    ) {
      const dataLinkValue = element.attributes.getNamedItem("data-link")?.value;
      if (dataLinkValue) {
        return `${window.location.protocol}//${window.location.host}${dataLinkValue}`;
      } else {
        return "undefined";
      }
    }

    return "undefined";
  }

  /**
   * Returns the parent element of the given HTMLAnchorElement if it has a specific class.
   *
   * @param {NavigationElement} element - The NavigationElement to check for a specific class.
   * @param {string[]} classes - An array of classes to check against the parent element's class.
   * @return {NavigationElement} - The parent element of the parent element of the given HTMLAnchorElement if it has a specific class, otherwise returns the original element.
   */
  static getContainingElement(
    clickedElement: HTMLElement,
    containerElement?: NavigationElement,
  ): HTMLElement {
    if (containerElement?.contains(clickedElement)) {
      return containerElement;
    }
    return clickedElement;
  }

  /**
   * Determines if the given URL is an external link.
   *
   * @param {string} url - The URL to check.
   * @return {boolean} Returns true if the URL is an external link, false otherwise.
   */
  static isExternalLink(url: string): boolean {
    if (!url) {
      return false;
    }

    return !url.includes("account.gov.uk");
  }

  /**
   * Returns the type of link based on the given HTML link element.
   *
   * @param {NavigationElement} element - The HTML link element to get the type of.
   * @return {string} The type of link: "footer", "header menu bar", "generic link", "generic button", or "undefined".
   */
  static getLinkType(element: NavigationElement): string {
    switch (element.tagName) {
      case "A":
        switch (true) {
          case NavigationTracker.isFooterLink(element):
            return "footer";
          case NavigationTracker.isHeaderMenuBarLink(element) ||
            NavigationTracker.isPhaseBannerLink(element):
            return "header menu bar";
          case element.classList.contains("govuk-button"):
            return "generic button";
          case NavigationTracker.isBackLink(element):
            return "back button";
          default:
            return "generic link";
        }
      case "BUTTON":
        return "generic button";
      default:
        return "undefined";
    }
  }

  /**
   * Returns the type of section based on the given HTML link element.
   *
   * @param {NavigationElement} element - The HTML link element to get the type of.
   * @return {string} The section: "logo", "phase banner", "menu links", "support links", "licence", "copyright" or "undefined".
   */
  static getSection(element: NavigationElement): string {
    // if header
    if (NavigationTracker.isLogoLink(element)) {
      return "logo";
    }
    if (NavigationTracker.isPhaseBannerLink(element)) {
      return "phase banner";
    }
    if (NavigationTracker.isNavLink(element)) {
      return "menu links";
    }
    if (NavigationTracker.isSupportLink(element)) {
      return "support links";
    }
    if (NavigationTracker.isLicenceLink(element)) {
      return "licence";
    }
    if (NavigationTracker.isCopyright(element)) {
      return "copyright";
    }
    return "undefined";
  }

  /**
   * Determines whether the given class name is a footer link.
   *
   * @param {string} element - The HTML link element to get the type of.
   * @return {boolean} Returns true if the footer tag contains this element, false otherwise.
   */
  static isFooterLink(element: NavigationElement): boolean {
    const footer = document.getElementsByTagName("footer")[0];
    return footer && footer.contains(element);
  }

  /**
   * Determines if the given element is a header link
   *
   * @param {string} element - The HTML link element to get the type of.
   * @return {boolean} Returns true if the header or nav tag contains this element, false otherwise.
   */
  static isHeaderMenuBarLink(element: NavigationElement): boolean {
    const header = document.querySelector("header");
    const nav = document.querySelector("nav");

    return header?.contains(element) || nav?.contains(element) || false;
  }

  /**
   * Determines if the given class name is a phase banner link
   *
   * @param {string} element - The HTML link element to get the type of.
   * @return {boolean} Returns true if the class name of this element includes "govuk-phase-banner", false otherwise.
   */
  static isPhaseBannerLink(element: NavigationElement): boolean {
    const phaseBanner =
      document.getElementsByClassName("govuk-phase-banner")[0];
    return phaseBanner && phaseBanner.contains(element);
  }

  /**
   * Determines if the given class name is a back button link.
   *
   * @param {string} element - The HTML link element to get the type of.
   * @return {boolean} Returns true if the class name of this element includes "govuk-back-link", false otherwise.
   */
  static isBackLink(element: NavigationElement): boolean {
    const elementClassName: string = element.className;
    return elementClassName.includes("govuk-back-link");
  }

  /**
   * Determines if the given class name is a logo link
   *
   * @param {string} element - The HTML link element to get the type of.
   * @return {boolean} Returns true if the class name of this element includes "govuk-header__logo", false otherwise.
   */
  static isLogoLink(element: NavigationElement): boolean {
    const logo = document.getElementsByClassName("govuk-header__logo")[0];
    return logo && logo.contains(element);
  }

  /**
   * Determines if the given tagname is a is a nav link
   *
   * @param {string} element - The HTML link element to get the type of.
   * @return {boolean} Returns true if the nav tag contains this element, false otherwise.
   */
  static isNavLink(element: NavigationElement): boolean {
    const elementClassName: string = element.className;
    const isLink = elementClassName.includes("govuk-link");
    const header = document.getElementsByTagName("header")[0];

    return header && header.contains(element) && isLink;
  }

  /**
   * Determines if the given class name is a support link
   *
   * @param {string} element - The HTML link element to get the type of.
   * @return {boolean} Returns true if the class name of this element includes "govuk-footer__inline-list", false otherwise.
   */
  static isSupportLink(element: NavigationElement): boolean {
    const supportLinks = document.getElementsByClassName(
      "govuk-footer__inline-list",
    )[0];
    return supportLinks && supportLinks.contains(element);
  }

  /**
   * Determines if the given class name is a licence link
   *
   * @param {string} element - The HTML link element to get the type of.
   * @return {boolean} Returns true if the class name of this element includes "govuk-footer__licence-description", false otherwise.
   */
  static isLicenceLink(element: NavigationElement): boolean {
    const supportLinks = document.getElementsByClassName(
      "govuk-footer__licence-description",
    )[0];
    return supportLinks && supportLinks.contains(element);
  }

  /**
   * Determines if the given class name is a copyright logo
   *
   * @param {string} element - The HTML link element to get the type of.
   * @return {boolean} Returns true if the class name of this element includes "govuk-footer__copyright-logo", false otherwise.
   */
  static isCopyright(element: NavigationElement): boolean {
    const licenceLinks = document.getElementsByClassName(
      "govuk-footer__copyright-logo",
    )[0];
    return licenceLinks && licenceLinks.contains(element);
  }
}
