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
  isFormErrorPage,
} from "../../utils/dataScrapersUtils/dataScrapers";
import { pushToDataLayer } from "../../utils/pushToDataLayerUtil/pushToDataLayer";
import { getFormElement } from "../formTracker/formTrackerUtils/getFieldValues/getFieldValues";
import { getSectionValue } from "../formTracker/formTrackerUtils/getSectionValue/getSectionValue";
import { getSubmitUrl } from "../formTracker/formTrackerUtils/getSubmitUrl/getSubmitUrl";
import { hasConsentForAnalytics } from "../../cookie/cookie";
import { getErrorFields } from "./errorFields";
import { getErrorMessage } from "./errorMessage";

/**
 * Tracks error in a form and sends data to the analytics platform.
 *
 * @return {boolean} Returns true if the form error tracking is successful, otherwise false.
 */
export function trackFormError(enabled: boolean = false) {
  if (!hasConsentForAnalytics()) return;
  if (!enabled) return;
  if (!isFormErrorPage()) return;

  const form = getFormElement();

  if (!form) return;

  let fields: FormField[] = [];
  if (form?.elements) {
    fields = getErrorFields();
  } else {
    return;
  }

  if (!fields.length) return;

  const submitUrl = getSubmitUrl(form);

  try {
    fields.forEach((field) => {
      const formErrorTrackerEvent: FormEventInterface = {
        event: "event_data",
        event_data: {
          event_name: "form_error",
          type: validateParameter(FormTracker.getFieldType([field]), 100),
          url: validateParameter(submitUrl, 100),
          text: validateParameter(getErrorMessage(field), 100),
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
    return;
  } catch (err) {
    logger.error("Error in trackFormError", err);
    return;
  }
}
