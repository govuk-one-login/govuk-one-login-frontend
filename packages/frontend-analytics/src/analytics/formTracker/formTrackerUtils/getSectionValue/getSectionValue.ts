import { FormField } from "../../formTracker.interface";
import { getHeadingText } from "../getHeadingText/getHeadingText";

/**
 * Get the section value from the label or legend associated with the HTML form element.
 *
 * @param {FormField} element - The form field.
 * @return {string} The label or legend of the field.
 */
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
