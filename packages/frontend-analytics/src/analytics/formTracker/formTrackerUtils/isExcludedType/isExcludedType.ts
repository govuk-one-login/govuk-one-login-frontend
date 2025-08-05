export const isExcludedType = (element: HTMLInputElement): boolean => {
  return (
    element.type === "hidden" ||
    element.type === "fieldset" ||
    element.type === "button" ||
    element.type === "submit"
  );
};
