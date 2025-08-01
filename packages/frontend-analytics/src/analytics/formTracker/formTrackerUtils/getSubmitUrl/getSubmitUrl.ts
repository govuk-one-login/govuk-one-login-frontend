/**
 * Get the submit URL from the given HTML form element.
 *
 * @param {HTMLFormElement} form - The HTML form element.
 * @return {string} The submit URL or "undefined" if not found.
 */
export const getSubmitUrl = (form: HTMLFormElement): string => {
  return form.action ?? "undefined";
};
