import { FormField } from "../../formTracker.interface";

export const getElementValue = (element: HTMLInputElement): string => {
  const label = document.querySelector(`label[for="${element.id}"]`);
  return label?.textContent?.trim() || "undefined";
};

/**
 * Retrieves the first HTMLFormElement within the specified document's main content.
 *
 * @return {HTMLFormElement | null} The first HTMLFormElement found within the main content, or null if none is found.
 */
export const getFormElement = (): HTMLFormElement | null => {
  return document.querySelector("#main-content form");
};

/**
 * Retrieves the field value from an array of form fields.
 *
 * @param {FormField[]} elements - The array of form fields.
 * @return {string} The concatenated field values separated by a comma (if there is more than one field).
 */
export const getFieldValue = (elements: FormField[]): string => {
  let value = "";
  const separator = elements.length > 1 ? ", " : "";
  elements.forEach((element) => {
    if (
      element.type === "checkbox" ||
      element.type === "radio" ||
      element.type === "select-one"
    ) {
      value += element.value + separator;
    }
  });
  return value;
};
