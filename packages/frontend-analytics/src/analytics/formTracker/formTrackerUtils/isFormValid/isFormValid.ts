import { FormField } from "../../formTracker.interface";

/**
 * Check if the form fields are valid.
 *
 * @param {FormField[]} fields - array of form fields
 * @return {boolean} true if all fields are valid, false otherwise
 */
export const isFormValid = (fields: FormField[]): boolean => {
  return fields.every((field) => !!field.value);
};
