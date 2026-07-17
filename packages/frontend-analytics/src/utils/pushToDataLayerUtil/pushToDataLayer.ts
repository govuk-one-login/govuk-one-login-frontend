import logger from "loglevel";
import {
  PageViewEventInterface,
  GTMInitInterface,
} from "../../analytics/pageViewTracker/pageViewTracker.interface";
import { NavigationEventInterface } from "../../analytics/navigationTracker/navigationTracker.interface";
import { FormEventInterface } from "../../analytics/formTracker/formTracker.interface";
import { stripPIIFromString } from "../piiRemoverUtil/piiRemover";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: any[];
  }
}

/**
 * Fields that are system-controlled and never contain user input.
 * These are excluded from the PII safety net to avoid false redactions
 * (e.g. ISO timestamps being matched as dates, page UUIDs being stripped).
 */
const SAFE_FIELDS = new Set([
  "event",
  "language",
  "organisations",
  "primary_publishing_organisation",
  "status_code",
  "content_id",
  "logged_in_status",
  "dynamic",
  "first_published_at",
  "updated_at",
  "relying_party",
  "external",
  "event_name",
  "gtm.allowlist",
  "gtm.blocklist",
  "gtm.start",
]);

/**
 * Recursively strips PII from all string values in an event object.
 * Acts as a final safety net before data reaches the dataLayer.
 * Skips fields in SAFE_FIELDS that are system-controlled and cannot contain user input.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stripPIIFromEvent = (obj: any, key?: string): any => {
  if (typeof obj === "string") {
    if (key && SAFE_FIELDS.has(key)) {
      return obj;
    }
    return stripPIIFromString(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => stripPIIFromEvent(item));
  }
  if (obj !== null && typeof obj === "object") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sanitised: any = {};
    for (const k of Object.keys(obj)) {
      sanitised[k] = stripPIIFromEvent(obj[k], k);
    }
    return sanitised;
  }
  return obj;
};

export const pushToDataLayer = (
  event:
    | PageViewEventInterface
    | NavigationEventInterface
    | FormEventInterface
    | GTMInitInterface,
): void => {
  window.dataLayer = window.dataLayer || [];

  try {
    window.dataLayer.push(stripPIIFromEvent(event));
  } catch (err) {
    logger.error("Error in pushToDataLayer", err);
  }
};
