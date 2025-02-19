/**
 * Returns a string representing the logged in status.
 *
 * @param {boolean} loggedInStatus - The logged in status.
 * @return {string} The string representation of the logged in status.
 */
export const getLoggedInStatus = (
  loggedInStatus: boolean | undefined,
): string => {
  if (loggedInStatus === undefined) {
    return "undefined";
  }

  return loggedInStatus ? "logged in" : "logged out";
};

/**
 * Returns the value of the 'govuk:first-published-at' meta tag attribute, if it exists.
 *
 * @return {string} The value of the 'govuk:first-published-at' meta tag attribute, or "undefined" if it does not exist.
 */
export const getFirstPublishedAt = (): string =>
  document
    .querySelector('meta[name="govuk:first-published-at"]')
    ?.getAttribute("content") ?? "undefined";

/**
 * Retrieves the value of the 'govuk:updated-at' meta tag attribute from the document.
 *
 * @return {string} The value of the 'govuk:updated-at' meta tag attribute, or "undefined" if it is not found.
 */
export const getUpdatedAt = (): string =>
  document
    .querySelector('meta[name="govuk:updated-at"]')
    ?.getAttribute("content") ?? "undefined";

/**
 * Returns the hostname of the current document location.
 *
 * @return {string} The hostname of the current document location.
 */
export const getRelyingParty = (): string => document.location.hostname;

/**
 * Retrieves the language code from the HTML document and returns it in lowercase.
 *
 * @return {string} The language code. Defaults to "en" if no language code is found.
 */
export const getLanguage = (): string => {
  const languageCode = document.querySelector("html")?.getAttribute("lang");
  return languageCode?.toLowerCase() ?? "undefined";
};

/**
 * Returns the current location URL as a lowercase string.
 *
 * @return {string} The current location URL as a lowercase string, or "undefined" if not available.
 */
export const getLocation = (): string =>
  document.location.href?.toLowerCase() ?? "undefined";

/**
 * Retrieves the referrer of the current document.
 *
 * @return {string} The referrer as a lowercase string, or "undefined" if it is empty.
 */
export const getReferrer = (): string => {
  return document.referrer.length
    ? document.referrer?.toLowerCase()
    : "undefined";
};
