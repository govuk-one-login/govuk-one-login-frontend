import { FormField } from "./formTrackerUtils/formTracker.interface";

/**
 * pushToDataLayer
 */

export const getDomain = (url: string): string => {
  if (url === "undefined") {
    return "undefined";
  }
  const newUrl = new URL(url);
  return `${newUrl.protocol}//${newUrl.host}`;
};

export const getDomainPath = (url: string, part: number): string => {
  if (url === "undefined") {
    return "undefined";
  }

  // Google Tag Manager takes a maximum string length of 500
  const start = part * 500;
  const end = start + 500;
  const newUrl = new URL(url);
  const domainPath = newUrl.pathname.substring(start, end);
  return domainPath.length ? domainPath : "undefined";
};

// check for change links used by both navigationTracker and formChangeTracker
export const isChangeLink = (element: HTMLElement): boolean => {
  if (element.tagName === "A") {
    const anchorElement = element as HTMLAnchorElement;
    return new URL(anchorElement.href).searchParams.get("edit") === "true";
  }
  return false;
};

/**
 * pageViewTracker
 */

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

/**
 * formChangeTracker
 */

export const getSection = (element: HTMLElement): string => {
  const { parentElement } = element;

  // Ensure the parent element exists
  if (!parentElement) {
    return "undefined";
  }

  let parentSiblingElement = parentElement?.previousElementSibling;
  while (parentSiblingElement) {
    if (parentSiblingElement.classList.contains("govuk-summary-list__key")) {
      const sectionValue =
        parentSiblingElement.textContent?.trim() || "undefined";
      return sectionValue;
    }
    parentSiblingElement = parentSiblingElement.previousElementSibling;
  }
  // If no matching sibling is found, check the parent element
  let parentTextContent = "";
  parentElement.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      parentTextContent += node.textContent?.trim() || "";
    }
  });
  return parentTextContent || "undefined";
};

/**
 * formErrorTracker
 */

/**
 Retrieve the text content of an error message associated with a specific form field.

 * @param {FormField} field - The form field.
 * @return returns a string representing the text content of the error message associated with the specified form field. 
 * If no error message is found, it returns the string "undefined
*/
export const getErrorMessage = (field: FormField) => {
  const error = document.getElementById(`${field.id}-error`);
  if (error) {
    return error?.textContent?.trim();
  }
  // If no error message is found, try to find an error message using the "parent" id of the form field
  const fieldNameInput = field.id.split("-");
  if (fieldNameInput.length > 1) {
    const inputError = document.getElementById(`${fieldNameInput[0]}-error`);
    if (inputError) {
      return inputError?.textContent?.trim();
    }
  }

  return "undefined";
};

/**
 * Querys first input, textarea, or select element within each form group that has an error message.
 * If element is found, creates a FormField object with information about the element
 * (id, name, value, type) and pushes this FormField object into the errorFields array.
 *
 * @return {FormField[]} elements - The array containing information about form fields associated with errors..
 */
export const getErrorFields = (): FormField[] => {
  const errorFields: FormField[] = [];
  const formGroups = document.querySelectorAll(".govuk-form-group--error");

  formGroups.forEach((formGroup) => {
    const element = formGroup.querySelector(
      "input, textarea,select,password,checkbox",
    ) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

    if (element) {
      errorFields.push({
        id: element.id,
        name: element.name,
        value: element.value,
        type: element.type,
      });
    }
  });

  return errorFields;
};
