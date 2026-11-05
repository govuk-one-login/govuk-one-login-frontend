import { validateEvent } from "../validateEvent";

const validEvent = {
  component_id: "component_id",
  event_name: "AIS_EVENT_TRANSITION_APPLIED",
  event_timestamp_ms: Date.now(),
  timestamp: Date.now(),
};

describe("validateEvent", () => {
  it("should approve a valid event", async () => {
    await expect(validateEvent(validEvent)).resolves.toBe(true);
  });

  it("should reject an event with an invalid event name", async () => {
    const newEvent = {
      component_id: "component_id",
      event_name: "UNAPPROVED_EVENT_TYPE",
      event_timestamp_ms: Date.now(),
      timestamp: Date.now(),
    };

    await expect(validateEvent(newEvent)).resolves.toBe(false);
  });

  it("should reject an event with unknown properties", async () => {
    const newEvent = {
      component_id: "component_id",
      event_name: "AIS_EVENT_TRANSITION_APPLIED",
      event_timestamp_ms: Date.now(),
      timestamp: Date.now(),
      junk: {},
    };

    await expect(validateEvent(newEvent)).resolves.toBe(false);
  });
});
