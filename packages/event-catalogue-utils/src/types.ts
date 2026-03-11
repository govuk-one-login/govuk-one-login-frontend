import { type Events as _Events } from "@govuk-one-login/event-catalogue";
import * as schemas from "@govuk-one-login/event-catalogue-schemas";

export type Events = _Events;
export type EventKey = keyof Events;
export type EventSchemaKey = keyof typeof schemas;
export type UnknownEvent = { event_name: string };

export const isEventKey = (key: string): key is EventSchemaKey =>
  Object.keys(schemas).includes(key);
