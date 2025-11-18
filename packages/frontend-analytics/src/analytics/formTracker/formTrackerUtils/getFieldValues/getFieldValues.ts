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
 * Retrieves the label of a field.
 *
 * @return {string} The label of the field.
 */
export const getFieldLabel = (): string => {
  let labels: HTMLCollectionOf<HTMLLegendElement | HTMLLabelElement> =
    document.getElementsByTagName("legend");
  if (!labels.length) {
    labels = document.getElementsByTagName("label");
  }
  let label: string = "";
  for (let i = 0; i < labels.length; i++) {
    if (labels[i].textContent) {
      label += labels[i].textContent!.trim();
      if (i > 1 && i < labels.length - 1) {
        label += ", ";
      }
    }
  }
  return label;
};
