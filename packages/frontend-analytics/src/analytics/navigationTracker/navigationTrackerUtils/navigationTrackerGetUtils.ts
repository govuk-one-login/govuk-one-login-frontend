import { NavigationElement } from "../navigationTracker.interface";
import {
  isBackLink,
  isCopyright,
  isFooterLink,
  isHeaderMenuBarLink,
  isLicenceLink,
  isLogoLink,
  isNavLink,
  isPhaseBannerLink,
  isSupportLink,
} from "./navigationTrackerLinkUtils";

export const getTargetUrl = (element: NavigationElement) => {
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
};

/**
 * Returns the parent element of the given HTMLAnchorElement if it has a specific class.
 *
 * @param {NavigationElement} element - The NavigationElement to check for a specific class.
 * @param {string[]} classes - An array of classes to check against the parent element's class.
 * @return {NavigationElement} - The parent element of the parent element of the given HTMLAnchorElement if it has a specific class, otherwise returns the original element.
 */
export const getContainingElement = (
  clickedElement: HTMLElement,
  containerElement?: NavigationElement,
): HTMLElement => {
  if (containerElement?.contains(clickedElement)) {
    return containerElement;
  }
  return clickedElement;
};

/**
 * Returns the type of link based on the given HTML link element.
 *
 * @param {NavigationElement} element - The HTML link element to get the type of.
 * @return {string} The type of link: "footer", "header menu bar", "generic link", "generic button", or "undefined".
 */
export const getLinkType = (element: NavigationElement): string => {
  switch (element.tagName) {
    case "A":
      switch (true) {
        case isFooterLink(element):
          return "footer";
        case isHeaderMenuBarLink(element) || isPhaseBannerLink(element):
          return "header menu bar";
        case element.classList.contains("govuk-button"):
          return "generic button";
        case isBackLink(element):
          return "back button";
        default:
          return "generic link";
      }
    case "BUTTON":
      return "generic button";
    default:
      return "undefined";
  }
};

/**
 * Returns the type of section based on the given HTML link element.
 *
 * @param {NavigationElement} element - The HTML link element to get the type of.
 * @return {string} The section: "logo", "phase banner", "menu links", "support links", "licence", "copyright" or "undefined".
 */
export const getSection = (element: NavigationElement): string => {
  // if header
  if (isLogoLink(element)) {
    return "logo";
  }
  if (isPhaseBannerLink(element)) {
    return "phase banner";
  }
  if (isNavLink(element)) {
    return "menu links";
  }
  if (isSupportLink(element)) {
    return "support links";
  }
  if (isLicenceLink(element)) {
    return "licence";
  }
  if (isCopyright(element)) {
    return "copyright";
  }
  return "undefined";
};
