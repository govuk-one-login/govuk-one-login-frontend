import { FormField } from "../../../utils/formUtils/formTracker.interface";

/**
 * Redacts field value if data is flagged as sensitive
 *
 * @param {string} string - Text field input
 * @return {string} The text field or undefined
 */
export const redactPII = (
  parameter: string,
  isDataSensitive: boolean,
  isPageDataSensitive: boolean,
): string => {
  return isPageDataSensitive || isDataSensitive ? "undefined" : parameter.trim();
};

/**
 * Retrieves the label of a button from a SubmitEvent.
 *
 * @param {SubmitEvent} event - The SubmitEvent object containing the button.
 * @return {string} The label of the button, or "undefined" if it is not found.
 */
export const getButtonLabel = (event: SubmitEvent): string => {
  return event.submitter?.textContent
    ? event.submitter.textContent.trim()
    : "undefined";
};

/**
 * Check if the form fields are valid.
 *
 * @param {FormField[]} fields - array of form fields
 * @return {boolean} true if all fields are valid, false otherwise
 */
export const isFormValid = (fields: FormField[]): boolean => {
  return fields.every((field) => !!field.value);
};

/**
 * Checks if the given array of form fields represents a date field.
 *
 * @param {FormField[]} fields - The array of form fields to check.
 * @return {boolean} Returns true if the fields represent a date field, false otherwise.
 */
export const isDateFields = (fields: FormField[]): boolean => {
  // get 3 date fields
  const dayField = fields.find((field) => field.id.endsWith("day"));
  const monthField = fields.find((field) => field.id.endsWith("month"));
  const yearField = fields.find((field) => field.id.endsWith("year"));

  // check if we have the 3 date fields
  if (!dayField || !monthField || !yearField) {
    return false;
  }

  // all field ids need to be linked to the same prefix id
  const idPrefixDayField = dayField.id.split("-")[0];
  const idPrefixMonthField = monthField.id.split("-")[0];
  const idPrefixYearField = yearField.id.split("-")[0];
  if (
    idPrefixDayField !== idPrefixMonthField ||
    idPrefixDayField !== idPrefixYearField ||
    idPrefixMonthField !== idPrefixYearField
  ) {
    return false;
  }

  return true;
};

/**
 * Combines the date fields into a single form field.
 *
 * @param {FormField[]} fields - array of form fields
 * @return {FormField[]} array containing the combined date field
 */
export const combineDateFields = (fields: FormField[]): FormField[] => {
  const newArrayFields: FormField[] = [];
  fields.forEach((field) => {
    if (field.name.includes("-")) {
      const fieldName = field.name.split("-")[0];
      if (
        !newArrayFields.find(
          (newArrayField) => newArrayField.name === fieldName,
        )
      ) {
        const dayField = fields.find(
          (dField) => dField.id === `${fieldName}-day`,
        );
        const monthField = fields.find(
          (mField) => mField.id === `${fieldName}-month`,
        );
        const yearField = fields.find(
          (yField) => yField.id === `${fieldName}-year`,
        );
        if (dayField && monthField && yearField) {
          const combinedDateField: FormField = {
            id: `${fieldName}-day`,
            name: fieldName,
            value: `${dayField.value}-${monthField.value}-${yearField.value}`,
            type: "date",
          };
          newArrayFields.push(combinedDateField);
        }
      }
    } else {
      // not a date field
      newArrayFields.push(field);
    }
  });
  return newArrayFields;
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

/**
 * Retrieves the selected fields from an HTML form.
 *
 * @param {HTMLFormElement} form - The HTML form element.
 * @return {FormField[]} An array of selected form fields.
 */
export const getFormFields = (form: HTMLFormElement): FormField[] => {
  const formFields: FormField[] = [];
  [...form.elements].forEach((element) => {
    const inputElement = element as HTMLInputElement;

    if (isExcludedType(inputElement)) {
      return;
    }

    if (inputElement.type === "checkbox") {
      processCheckbox(inputElement, formFields);
    } else if (inputElement.type === "radio") {
      processRadio(inputElement, formFields);
    } else if (inputElement.type === "select-one") {
      processSelectOne(
        inputElement as unknown as HTMLSelectElement,
        formFields,
      );
    } else {
      processTextElement(inputElement, formFields);
    }
  });

  return formFields;
};

const processCheckbox = (
  element: HTMLInputElement,
  formFields: FormField[],
): void => {
  if (!element.checked) {
    return;
  }

  const checkboxInSameGroup = formFields.find(
    (field) => field.name === element.name,
  );

  if (checkboxInSameGroup) {
    checkboxInSameGroup.value += `, ${getElementValue(element)}`;
  } else {
    formFields.push({
      id: element.id,
      name: element.name,
      value: getElementValue(element),
      type: element.type,
    });
  }
};

const processRadio = (
  element: HTMLInputElement,
  formFields: FormField[],
): void => {
  if (!element.checked) {
    return;
  }

  formFields.push({
    id: element.id,
    name: element.name,
    value: getElementValue(element),
    type: element.type,
  });
};

const processTextElement = (
  element: HTMLInputElement | HTMLTextAreaElement,
  formFields: FormField[],
): void => {
  formFields.push({
    id: element.id,
    name: element.name,
    value: element.value,
    type: element.type,
  });
};

const processSelectOne = (
  element: HTMLSelectElement,
  formFields: FormField[],
): void => {
  formFields.push({
    id: element.id,
    name: element.name,
    value: element.options[element.selectedIndex].text,
    type: element.type,
  });
};

const getElementValue = (element: HTMLInputElement): string => {
  const label = document.querySelector(`label[for="${element.id}"]`);
  return label?.textContent?.trim() || "undefined";
};

export const isExcludedType = (element: HTMLInputElement): boolean => {
  return (
    element.type === "hidden" ||
    element.type === "fieldset" ||
    element.type === "button" ||
    element.type === "submit"
  );
};
