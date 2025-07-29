import logger from "loglevel";
import {
  PageViewEventInterface,
  GTMInitInterface,
} from "../../analytics/pageViewTracker/pageViewTracker.interface";
import { NavigationEventInterface } from "../../analytics/navigationTracker/navigationTracker.interface";
import { FormEventInterface } from "../../analytics/formTracker/formTracker.interface";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: any[];
  }
}

export const pushToDataLayer = (
  event:
    | PageViewEventInterface
    | NavigationEventInterface
    | FormEventInterface
    | GTMInitInterface,
): void => {
  window.dataLayer = window.dataLayer || [];

  try {
    window.dataLayer.push(event);
  } catch (err) {
    logger.error("Error in pushToDataLayer", err);
  }
};
