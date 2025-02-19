import { FormField } from "./formTracker.interface";

export const FREE_TEXT_FIELD_TYPE = "free text field";
export const DROPDOWN_FIELD_TYPE = "drop-down list";
export const RADIO_FIELD_TYPE = "radio buttons";

/**
 * Retrieves the first HTMLFormElement within the specified document's main content.
 *
 * @return {HTMLFormElement | null} The first HTMLFormElement found within the main content, or null if none is found.
 */
// common to formChange/Error/Response
export const getFormElement = (): HTMLFormElement | null => {
  return document.querySelector("#main-content form");
};

/**
 * Returns the field type based on the given FormField array.
 *
 * @param {FormField[]} elements - An array of FormField objects.
 * @return {string} The field type based on the elements.
 */
// common to formError/Response
export const getFieldType = (elements: FormField[]): string => {
  switch (elements[0].type) {
    case "select-one":
      return DROPDOWN_FIELD_TYPE;
    case "radio":
      return RADIO_FIELD_TYPE;
    case "checkbox":
      return elements[0].type;
    default:
      return FREE_TEXT_FIELD_TYPE;
  }
};

/**
 * Get the heading text associated with the specified HTML element ID.
 *
 * @param {string} elementId - The ID of the HTML element.
 * @return {string} The heading text of the element, or "undefined" if not found.
 */
// only used within this file
const getHeadingText = (elementId: string): string => {
  const commonId = elementId.split("-")[0];
  const h1OrH2WithRel = document.querySelector(
    `h1[rel="${commonId}"], h2[rel="${commonId}"]`,
  );
  if (h1OrH2WithRel?.textContent) return h1OrH2WithRel.textContent.trim();

  const firstH1 = document.querySelector("h1");
  if (firstH1?.textContent) return firstH1.textContent.trim();

  const firstH2 = document.querySelector("h2");
  if (firstH2?.textContent) return firstH2.textContent.trim();

  return "undefined";
};

/**
 * Get the section value from the label or legend associated with the HTML form element.
 *
 * @param {FormField} element - The form field.
 * @return {string} The label or legend of the field.
 */
// common to formError/Response
export const getSectionValue = (element: FormField): string => {
  const field = document.getElementById(element.id);
  const fieldset = field?.closest("fieldset");
  const isCheckboxType = element.type === "checkbox";
  const isRadioType = element.type === "radio";
  const isDateType = element.type === "date";

  if (fieldset) {
    // If it's a child of a fieldset ,look for the legend if not check for backup conditions
    const legendElement = fieldset.querySelector("legend");
    if (legendElement?.textContent) {
      return legendElement.textContent.trim();
    }

    return getHeadingText(element.id);

    // if it is a checkbox or radio or date not in a fieldset, then check for backup conditions
  }

  if (isCheckboxType || isRadioType || isDateType) {
    return getHeadingText(element.id);
  }

  // If not within a fieldset and not a checkbox / radio button/ date/s field ,e.g free text field or dropdown check for label
  const labelElement = document.querySelector(`label[for="${element.id}"]`);
  if (labelElement?.textContent) {
    return labelElement.textContent.trim();
  }

  // If not within a fieldset or no legend or label found or no h1/h2 with rel attribute or no h1 or h2 then, return a "undefined" string
  return "undefined";
};

/**
 * Get the submit URL from the given HTML form element.
 *
 * @param {HTMLFormElement} form - The HTML form element.
 * @return {string} The submit URL or "undefined" if not found.
 */
// common to formError/Response
export const getSubmitUrl = (form: HTMLFormElement): string => {
  return form.action ?? "undefined";
};
