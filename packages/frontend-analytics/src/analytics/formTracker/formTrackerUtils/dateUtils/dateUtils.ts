import { FormField } from "../../formTracker.interface";

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
