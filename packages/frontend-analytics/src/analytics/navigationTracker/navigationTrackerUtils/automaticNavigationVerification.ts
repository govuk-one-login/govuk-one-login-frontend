/**
 * Determine whether the button can be located
 * @param element - The HTML element to check
 * @returns {boolean} - Returns true if the element is a button, false otherwise.
 */

export const isButton = (element: HTMLElement): boolean => {
  const button = document.querySelector("button");
  return button!.contains(element);
};

/**
 * Determine if data attribute data-nav is present on the element
 * @param element - The HTML element to check
 * @returns {boolean} - Returns true if the data attribute is present, false otherwise.
 */
export const hasDataNavAttribute = (element: HTMLElement): boolean => {
  return element.hasAttribute("data-nav");
};

/**
 * Determine if data attribute data-link is present on the element
 * @param element - The HTML element to check
 * @returns {boolean} - Returns true if the data attribute is present, false otherwise.
 */
export const hasDataLinkAttribute = (element: HTMLElement): boolean => {
  return element.hasAttribute("data-link");
};
