import { validateEvent } from "../validateEvent";

describe("validateEvent", () => {
  it("should approve a valid event", () => {
    const newEvent = {
      component_id: "component_id",
      event_name: "AIS_EVENT_TRANSITION_APPLIED",
      event_timestamp_ms: Date.now(),
      timestamp: Date.now(),
    };

    expect(validateEvent(newEvent)).toBe(true);
  });
  it("should reject an event with an invalid event name", () => {
    const newEvent = {
      component_id: "component_id",
      event_name: "UNAPPROVED_EVENT_TYPE",
      event_timestamp_ms: Date.now(),
      timestamp: Date.now(),
    };

    expect(validateEvent(newEvent)).toBe(false);
  });
  it("should reject an event with unknown properties", () => {
    const newEvent = {
      component_id: "component_id",
      event_name: "AIS_EVENT_TRANSITION_APPLIED",
      event_timestamp_ms: Date.now(),
      timestamp: Date.now(),
      junk: {},
    };

    expect(validateEvent(newEvent)).toBe(false);
  });
});
