import logger from "loglevel";
import { validateParameter } from "../../utils/validateParameter";
import {
  FormEventInterface,
  FormField,
} from "../../utils/formTrackerUtils/formTracker.interface";
import { getDomain, getDomainPath } from "../../utils/dataScrapers";
import { pushToDataLayer } from "../../utils/pushToDataLayer";
import * as FormTrackerUtils from "../../utils/formTrackerUtils/formTrackerUtils";

export const FormResponseTracker = (
  isDataSensitive: boolean,
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

    const form = FormTrackerUtils.getFormElement();

    if (!form) {
      return false;
    }

    let fields: FormField[] = [];

    if (form?.elements) {
      fields = FormTrackerUtils.getFormFields(form);
    } else {
      return false;
    }

    if (!fields.length || !FormTrackerUtils.isFormValid(fields)) {
      return false;
    }

    // manage date (day/month/year) fields
    if (FormTrackerUtils.isDateFields(fields)) {
      fields = FormTrackerUtils.combineDateFields(fields);
    }

    const submitUrl = FormTrackerUtils.getSubmitUrl(form);

    try {
      fields.forEach((field) => {
        const formResponseTrackerEvent: FormEventInterface = {
          event: eventType,
          event_data: {
            event_name: eventName,
            type: validateParameter(
              FormTrackerUtils.getFieldType([field]),
              100,
            ),
            url: validateParameter(submitUrl, 100),
            text: FormTrackerUtils.redactPII(
              validateParameter(FormTrackerUtils.getFieldValue([field]), 100),
              isDataSensitive,
            ),
            section: validateParameter(
              FormTrackerUtils.getSectionValue(field),
              100,
            ),
            action: validateParameter(
              FormTrackerUtils.getButtonLabel(event),
              100,
            ),
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
