/**
 * Determines whether a form element is optional.
 *
 * Reads aria-required="false" on the element itself (set by hmpo-components for
 * text/textarea/select fields) or on its closest fieldset ancestor (set by
 * hmpo-components for radios/checkboxes). If neither is present, the field is
 * treated as required.
 *
 * @param {HTMLElement} element - The form element to check
 * @return {boolean} true if the field is optional, false otherwise
 */
export const isOptionalField = (element: HTMLElement): boolean => {
  if (element.getAttribute("aria-required") === "false") {
    return true;
  }

  const fieldset = element.closest("fieldset");
  if (fieldset?.getAttribute("aria-required") === "false") {
    return true;
  }

  return false;
};
