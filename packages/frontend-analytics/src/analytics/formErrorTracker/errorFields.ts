import { type FormField } from "../formTracker/formTracker.interface";

/**
 * Querys first input, textarea, or select element within each form group that has an error message.
 * If element is found, creates a FormField object with information about the element
 * (id, name, value, type) and pushes this FormField object into the errorFields array.
 *
 * @return {FormField[]} elements - The array containing information about form fields associated with errors..
 */
export function getErrorFields(): FormField[] {
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
}
