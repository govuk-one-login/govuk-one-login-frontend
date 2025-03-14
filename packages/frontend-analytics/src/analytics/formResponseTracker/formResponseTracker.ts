import logger from "loglevel";
import { validateParameter } from "../../utils/validateParameter";
import {
  FormEventInterface,
  FormField,
} from "../../utils/formUtils/formTracker.interface";
import { getDomain, getDomainPath } from "../../utils/dataScrapers";
import { pushToDataLayer } from "../../utils/pushToDataLayer";
import {
  combineDateFields,
  getButtonLabel,
  getFieldValue,
  getFormFields,
  isDateFields,
  isFormValid,
  redactPII,
} from "./utils/formResponseTracker.utils";
import {
  getFormElement,
  getSubmitUrl,
  getFieldType,
  getSectionValue,
} from "../../utils/formUtils/formTrackerUtils";

export const FormResponseTracker = (
  isDataSensitive: boolean,
  isPageDataSensitive: boolean,
  enableFormResponseTracking: boolean,
) => {
  const eventName: string = "form_response";
  const eventType: string = "event_data";

  /**
   * Tracks the form response and sends the data to the analytics platform.
   *
   * @param {SubmitEvent} event - The submit event triggered by the form submission.
   * @return {boolean} Returns true if the form response is successfully tracked, otherwise false.
   */
  const trackFormResponse = (event: SubmitEvent): boolean => {
    if (!window.DI.analyticsGa4.cookie.consent || !enableFormResponseTracking) {
      return false;
    }

    const form = getFormElement();

    if (!form) {
      return false;
    }

    let fields: FormField[] = [];

    if (form?.elements) {
      fields = getFormFields(form);
    } else {
      return false;
    }

    if (!fields.length || !isFormValid(fields)) {
      return false;
    }

    // manage date (day/month/year) fields
    if (isDateFields(fields)) {
      fields = combineDateFields(fields);
    }

    const submitUrl = getSubmitUrl(form);

    try {
      fields.forEach((field) => {
        const formResponseTrackerEvent: FormEventInterface = {
          event: eventType,
          event_data: {
            event_name: eventName,
            type: validateParameter(getFieldType([field]), 100),
            url: validateParameter(submitUrl, 100),
            text: redactPII(
              validateParameter(getFieldValue([field]), 100),
              isDataSensitive,
              isPageDataSensitive,
            ),
            section: validateParameter(getSectionValue(field), 100),
            action: validateParameter(getButtonLabel(event), 100),
            external: "false",
            link_domain: getDomain(submitUrl),
            "link_path_parts.1": getDomainPath(submitUrl, 0),
            "link_path_parts.2": getDomainPath(submitUrl, 1),
            "link_path_parts.3": getDomainPath(submitUrl, 2),
            "link_path_parts.4": getDomainPath(submitUrl, 3),
            "link_path_parts.5": getDomainPath(submitUrl, 4),
          },
        };

        // Push the event to the data layer for each field
        pushToDataLayer(formResponseTrackerEvent);
      });

      return true;
    } catch (err) {
      logger.error("Error in trackFormResponse", err);
      return false;
    }
  };

  /**
   * Initialise the event listener for the document.
   *
   */
  document.addEventListener("submit", trackFormResponse);
};
