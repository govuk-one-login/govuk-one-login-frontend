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
