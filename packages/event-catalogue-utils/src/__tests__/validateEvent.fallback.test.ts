import Ajv2019 from "ajv/dist/2019.js";

/**
 * Proves the fallback path compiles each schema at most once per process.
 * The installed `@govuk-one-login/event-catalogue-schemas` in this repo does
 * NOT ship precompiled validators, so the dynamic import fails and every call
 * takes the AJV fallback path. The spy is installed on the AJV prototype BEFORE
 * importing validateEvent so it captures the module-scoped instance's compile.
 */

const validEvent = {
  component_id: "component_id",
  event_name: "AIS_EVENT_TRANSITION_APPLIED",
  event_timestamp_ms: Date.now(),
  timestamp: Date.now(),
};

describe("validateEvent — fallback single-compilation", () => {
  it("compiles the schema at most once across repeated calls", async () => {
    const compileSpy = vi.spyOn(Ajv2019.prototype, "compile");

    const { validateEvent } = await import("../validateEvent");

    const results = [
      await validateEvent(validEvent),
      await validateEvent(validEvent),
      await validateEvent(validEvent),
    ];

    expect(results).toEqual([true, true, true]);
    // First call compiles + registers under $id; later calls hit getSchema($id).
    expect(compileSpy).toHaveBeenCalledTimes(1);

    compileSpy.mockRestore();
  });
});
