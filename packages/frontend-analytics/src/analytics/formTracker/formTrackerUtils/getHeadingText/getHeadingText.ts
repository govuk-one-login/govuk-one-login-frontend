/**
 * Get the heading text associated with the specified HTML element ID.
 *
 * @param {string} elementId - The ID of the HTML element.
 * @return {string} The heading text of the element, or "undefined" if not found.
 */
export const getHeadingText = (elementId: string): string => {
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
