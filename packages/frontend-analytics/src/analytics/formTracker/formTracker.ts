import { FormField } from "./formTracker.interface";
import { getElementValue } from "./formTrackerUtils/getFieldValues/getFieldValues";
import { isExcludedType } from "./formTrackerUtils/isExcludedType/isExcludedType";

export const FREE_TEXT_FIELD_TYPE = "free text field";
export const DROPDOWN_FIELD_TYPE = "drop-down list";
export const RADIO_FIELD_TYPE = "radio buttons";

export class FormTracker {
  private selectedFields: FormField[] = [];

  processCheckbox(element: HTMLInputElement): void {
    if (!element.checked) {
      return;
    }

    const checkboxInSameGroup = this.selectedFields.find(
      (field) => field.name === element.name,
    );

    if (checkboxInSameGroup) {
      checkboxInSameGroup.value += `, ${getElementValue(element)}`;
    } else {
      this.selectedFields.push({
        id: element.id,
        name: element.name,
        value: getElementValue(element),
        type: element.type,
      });
    }
  }

  processRadio(element: HTMLInputElement): void {
    if (!element.checked) {
      return;
    }

    this.selectedFields.push({
      id: element.id,
      name: element.name,
      value: getElementValue(element),
      type: element.type,
    });
  }

  processTextElement(element: HTMLInputElement | HTMLTextAreaElement): void {
    this.selectedFields.push({
      id: element.id,
      name: element.name,
      value: element.value,
      type: element.type,
    });
  }

  processSelectOne(element: HTMLSelectElement): void {
    this.selectedFields.push({
      id: element.id,
      name: element.name,
      value: element.options[element.selectedIndex].text,
      type: element.type,
    });
  }

  /**
   * Retrieves the selected fields from an HTML form.
   *
   * @param {HTMLFormElement} form - The HTML form element.
   * @return {FormField[]} An array of selected form fields.
   */
  public getFormFields(form: HTMLFormElement): FormField[] {
    [...form.elements].forEach((element) => {
      const inputElement = element as HTMLInputElement;

      if (isExcludedType(inputElement)) {
        return;
      }

      if (inputElement.type === "checkbox") {
        this.processCheckbox(inputElement);
      } else if (inputElement.type === "radio") {
        this.processRadio(inputElement);
      } else if (inputElement.type === "select-one") {
        this.processSelectOne(inputElement as unknown as HTMLSelectElement);
      } else {
        this.processTextElement(inputElement);
      }
    });

    return this.selectedFields;
  }

  /**
   * Returns the field type based on the given FormField array.
   *
   * @param {FormField[]} elements - An array of FormField objects.
   * @return {string} The field type based on the elements.
   */
  static getFieldType(elements: FormField[]): string {
    switch (elements[0].type) {
      case "select-one":
        return DROPDOWN_FIELD_TYPE;
      case "radio":
        return RADIO_FIELD_TYPE;
      case "checkbox":
        return elements[0].type;
      default:
        return FREE_TEXT_FIELD_TYPE;
    }
  }
}
