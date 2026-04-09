import { type FormField } from "../formTracker/formTracker.interface";

/**
   Retrieve the text content of an error message associated with a specific form field.

   * @param {FormField} field - The form field.
   * @return returns a string representing the text content of the error message associated with the specified form field. 
   * If no error message is found, it returns the string "undefined
  */
export function getErrorMessage(field: FormField) {
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
}
