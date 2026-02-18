import { createEvent } from "../createEvent";

describe("createEvent", () => {
  it("should return an un-modified version of the provided event", () => {
    const newEvent = {
      component_id: "component_id",
      event_name: "AIS_EVENT_TRANSITION_APPLIED",
      event_timestamp_ms: Date.now(),
      timestamp: Date.now(),
    };

    const typeCheckedEvent = createEvent(
      "AIS_EVENT_TRANSITION_APPLIED",
      newEvent,
    );

    expect(typeCheckedEvent).toBe(newEvent);
  });
});
