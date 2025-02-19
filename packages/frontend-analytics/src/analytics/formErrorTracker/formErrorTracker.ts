import logger from "loglevel";
import { validateParameter } from "../../utils/validateParameter";
import * as FormTrackerUtils from "../../utils/formUtils/formTrackerUtils";
import {
  FormEventInterface,
  FormField,
} from "../../utils/formUtils/formTracker.interface";
import { getDomain, getDomainPath } from "../../utils/dataScrapers";
import { pushToDataLayer } from "../../utils/pushToDataLayer";
import {
  getErrorFields,
  getErrorMessage,
} from "./utils/formErrorTracker.utils";

const eventName: string = "form_error";
const eventType: string = "event_data";

/**
 * Tracks error in a form and sends data to the analytics platform.
 *
 * @return {boolean} Returns true if the form error tracking is successful, otherwise false.
 */
export const trackFormError = (): boolean => {
  const form = FormTrackerUtils.getFormElement();

  if (!form) {
    return false;
  }

  let fields: FormField[] = [];
  if (form?.elements) {
    fields = getErrorFields();
  } else {
    return false;
  }

  if (!fields.length) {
    return false;
  }

  const submitUrl = FormTrackerUtils.getSubmitUrl(form);

  try {
    fields.forEach((field) => {
      const formErrorTrackerEvent: FormEventInterface = {
        event: eventType,
        event_data: {
          event_name: eventName,
          type: validateParameter(FormTrackerUtils.getFieldType([field]), 100),
          url: validateParameter(submitUrl, 100),
          text: validateParameter(getErrorMessage(field), 100),
          section: validateParameter(
            FormTrackerUtils.getSectionValue(field),
            100,
          ),
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
};
