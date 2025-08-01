import logger from "loglevel";
import { validateParameter } from "../../utils/validateParameterUtils/validateParameter";
import { FormTracker } from "../formTracker/formTracker";
import {
  FormEventInterface,
  FormField,
} from "../formTracker/formTracker.interface";
import {
  getDomain,
  getDomainPath,
} from "../../utils/dataScrapersUtils/dataScrapers";
import { pushToDataLayer } from "../../utils/pushToDataLayerUtil/pushToDataLayer";
import { getFormElement } from "../formTracker/formTrackerUtils/getFieldValues/getFieldValues";
import { getSectionValue } from "../formTracker/formTrackerUtils/getSectionValue/getSectionValue";
import { getSubmitUrl } from "../formTracker/formTrackerUtils/getSubmitUrl/getSubmitUrl";

export class FormErrorTracker extends FormTracker {
  eventName: string = "form_error";
  eventType: string = "event_data";

  /**
   * Tracks error in a form and sends data to the analytics platform.
   *
   * @return {boolean} Returns true if the form error tracking is successful, otherwise false.
   */
  trackFormError(): boolean {
    if (!window.DI.analyticsGa4.cookie.consent) {
      return false;
    }

    const form = getFormElement();

    if (!form) {
      return false;
    }

    let fields: FormField[] = [];
    if (form?.elements) {
      fields = FormErrorTracker.getErrorFields();
    } else {
      return false;
    }

    if (!fields.length) {
      return false;
    }

    const submitUrl = getSubmitUrl(form);

    try {
      fields.forEach((field) => {
        const formErrorTrackerEvent: FormEventInterface = {
          event: this.eventType,
          event_data: {
            event_name: this.eventName,
            type: validateParameter(this.getFieldType([field]), 100),
            url: validateParameter(submitUrl, 100),
            text: validateParameter(
              FormErrorTracker.getErrorMessage(field),
              100,
            ),
            section: validateParameter(getSectionValue(field), 100),
            action: "error",
            external: "false",
            link_domain: getDomain(submitUrl),
            "link_path_parts.1": getDomainPath(submitUrl, 0),
            "link_path_parts.2": getDomainPath(submitUrl, 1),
            "link_path_parts.3": getDomainPath(submitUrl, 2),
            "link_path_parts.4": getDomainPath(submitUrl, 3),
            "link_path_parts.5": getDomainPath(submitUrl, 4),
          },
        };
        pushToDataLayer(formErrorTrackerEvent);
      });
      return true;
    } catch (err) {
      logger.error("Error in trackFormError", err);
      return false;
    }
  }

  /**
   Retrieve the text content of an error message associated with a specific form field.

   * @param {FormField} field - The form field.
   * @return returns a string representing the text content of the error message associated with the specified form field. 
   * If no error message is found, it returns the string "undefined
  */
  static getErrorMessage(field: FormField) {
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

  /**
   * Querys first input, textarea, or select element within each form group that has an error message.
   * If element is found, creates a FormField object with information about the element
   * (id, name, value, type) and pushes this FormField object into the errorFields array.
   *
   * @return {FormField[]} elements - The array containing information about form fields associated with errors..
   */
  static getErrorFields(): FormField[] {
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
}
