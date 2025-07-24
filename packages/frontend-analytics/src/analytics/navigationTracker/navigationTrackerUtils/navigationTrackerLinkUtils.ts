import { isChangeLink } from "../../../utils/dataScrapersUtils/dataScrapers";
import { NavigationElement } from "../navigationTracker.interface";

/**
 * Determines if the given URL is an external link.
 *
 * @param {string} url - The URL to check.
 * @return {boolean} Returns true if the URL is an external link, false otherwise.
 */
export const isExternalLink = (url: string): boolean => {
  if (!url) {
    return false;
  }

  return !url.includes("account.gov.uk");
};

/**
 * Determines whether the given class name is a footer link.
 *
 * @param {string} element - The HTML link element to get the type of.
 * @return {boolean} Returns true if the footer tag contains this element, false otherwise.
 */
export const isFooterLink = (element: NavigationElement): boolean => {
  const footer = document.getElementsByTagName("footer")[0];
  return footer?.contains(element);
};

/**
 * Determines if the given element is a header link
 *
 * @param {string} element - The HTML link element to get the type of.
 * @return {boolean} Returns true if the header or nav tag contains this element, false otherwise.
 */
export const isHeaderMenuBarLink = (element: NavigationElement): boolean => {
  const header = document.querySelector("header");
  const nav = document.querySelector("nav");

  return header?.contains(element) || nav?.contains(element) || false;
};

/**
 * Determines if the given class name is a phase banner link
 *
 * @param {string} element - The HTML link element to get the type of.
 * @return {boolean} Returns true if the class name of this element includes "govuk-phase-banner", false otherwise.
 */
export const isPhaseBannerLink = (element: NavigationElement): boolean => {
  const phaseBanner = document.getElementsByClassName("govuk-phase-banner")[0];
  return phaseBanner?.contains(element);
};

/**
 * Determines if the given class name is a back button link.
 *
 * @param {string} element - The HTML link element to get the type of.
 * @return {boolean} Returns true if the class name of this element includes "govuk-back-link", false otherwise.
 */
export const isBackLink = (element: NavigationElement): boolean => {
  const elementClassName: string = element.className;
  return elementClassName.includes("govuk-back-link");
};

/**
 * Determines if the given class name is a logo link
 *
 * @param {string} element - The HTML link element to get the type of.
 * @return {boolean} Returns true if the class name of this element includes "govuk-header__logo", false otherwise.
 */
export const isLogoLink = (element: NavigationElement): boolean => {
  const logo = document.getElementsByClassName("govuk-header__logo")[0];
  return logo?.contains(element);
};

/**
 * Determines if the given tagname is a is a nav link
 *
 * @param {string} element - The HTML link element to get the type of.
 * @return {boolean} Returns true if the nav tag contains this element, false otherwise.
 */
export const isNavLink = (element: NavigationElement): boolean => {
  const elementClassName: string = element.className;
  const isLink = elementClassName.includes("govuk-link");
  const header = document.getElementsByTagName("header")[0];

  return header && header.contains(element) && isLink;
};

/**
 * Determines if the given class name is a support link
 *
 * @param {string} element - The HTML link element to get the type of.
 * @return {boolean} Returns true if the class name of this element includes "govuk-footer__inline-list", false otherwise.
 */
export const isSupportLink = (element: NavigationElement): boolean => {
  const supportLinks = document.getElementsByClassName(
    "govuk-footer__inline-list",
  )[0];
  return supportLinks?.contains(element);
};

/**
 * Determines if the given class name is a licence link
 *
 * @param {string} element - The HTML link element to get the type of.
 * @return {boolean} Returns true if the class name of this element includes "govuk-footer__licence-description", false otherwise.
 */
export const isLicenceLink = (element: NavigationElement): boolean => {
  const supportLinks = document.getElementsByClassName(
    "govuk-footer__licence-description",
  )[0];
  return supportLinks?.contains(element);
};

/**
 * Determines if the given class name is a copyright logo
 *
 * @param {string} element - The HTML link element to get the type of.
 * @return {boolean} Returns true if the class name of this element includes "govuk-footer__copyright-logo", false otherwise.
 */
export const isCopyright = (element: NavigationElement): boolean => {
  const licenceLinks = document.getElementsByClassName(
    "govuk-footer__copyright-logo",
  )[0];
  return licenceLinks?.contains(element);
};

export const isNavigatingElement = (element: NavigationElement) => {
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
};
