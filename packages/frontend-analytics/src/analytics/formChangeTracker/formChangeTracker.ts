import logger from "loglevel";
import { validateParameter } from "../../utils/validateParameter";
import * as FormTrackerUtils from "../../utils/formUtils/formTrackerUtils";
import { FormEventInterface } from "../../utils/formUtils/formTracker.interface";
import {
  getDomain,
  getDomainPath,
  isChangeLink,
} from "../../utils/dataScrapers";
import { pushToDataLayer } from "../../utils/pushToDataLayer";
import { getSection } from "./utils/formChangeTracker.utils";

export const FormChangeTracker = (enableFormChangeTracking: boolean) => {
  const eventName: string = "form_change_response";
  const eventType: string = "event_data";

  /**
   * Tracks changes in a form and sends data to the analytics platform.
   *
   * @return {boolean} Returns true if the form change tracking is successful, otherwise false.
   */
  const trackFormChange = (event: Event): boolean => {
    if (!window.DI.analyticsGa4.cookie.consent || !enableFormChangeTracking) {
      return false;
    }

    const form = FormTrackerUtils.getFormElement();

    if (!form) {
      return false;
    }

    const element: HTMLLinkElement = event.target as HTMLLinkElement;

    // Ensure element is an <a> tag with "Change" text content and is not a lang toggle link
    if (
      element.tagName !== "A" ||
      !isChangeLink(element) ||
      element.hasAttribute("hreflang")
    ) {
      return false;
    }

    const formChangeTrackerEvent: FormEventInterface = {
      event: eventType,
      event_data: {
        event_name: eventName,
        type: "undefined",
        url: validateParameter(element.href, 500),
        text: "change", // put static value. Waiting final documentation on form change tracker,
        section: validateParameter(getSection(element), 100),
        action: "change response",
        external: "false",
        link_domain: getDomain(element.href),
        "link_path_parts.1": getDomainPath(element.href, 0),
        "link_path_parts.2": getDomainPath(element.href, 1),
        "link_path_parts.3": getDomainPath(element.href, 2),
        "link_path_parts.4": getDomainPath(element.href, 3),
        "link_path_parts.5": getDomainPath(element.href, 4),
      },
    };

    try {
      pushToDataLayer(formChangeTrackerEvent);
      return true;
    } catch (err) {
      logger.error("Error in trackFormChange", err);
      return false;
    }
  };

  document.addEventListener("click", trackFormChange);
};
