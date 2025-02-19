import { FormField } from "../../../utils/formUtils/formTracker.interface";

/**
 Retrieve the text content of an error message associated with a specific form field.

 * @param {FormField} field - The form field.
 * @return returns a string representing the text content of the error message associated with the specified form field. 
 * If no error message is found, it returns the string "undefined
*/
export const getErrorMessage = (field: FormField) => {
  const error = document.getElementById(`${field.id}-error`);
  if (error) {
    return error?.textContent?.trim();
  }
  // If no error message is found, try to find an error message using the "parent" id of the form field
  const fieldNameInput = field.id.split("-");
  if (fieldNameInput.length > 1) {
    const inputError = document.getElementById(`${fieldNameInput[0]}-error`);
    if (inputError) {
      return inputError?.textContent?.trim();
    }
  }

  return "undefined";
};

/**
 * Querys first input, textarea, or select element within each form group that has an error message.
 * If element is found, creates a FormField object with information about the element
 * (id, name, value, type) and pushes this FormField object into the errorFields array.
 *
 * @return {FormField[]} elements - The array containing information about form fields associated with errors..
 */
export const getErrorFields = (): FormField[] => {
  const errorFields: FormField[] = [];
  const formGroups = document.querySelectorAll(".govuk-form-group--error");

  formGroups.forEach((formGroup) => {
    const element = formGroup.querySelector(
      "input, textarea,select,password,checkbox",
    ) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

    if (element) {
      errorFields.push({
        id: element.id,
        name: element.name,
        value: element.value,
        type: element.type,
      });
    }
  });

  return errorFields;
};
