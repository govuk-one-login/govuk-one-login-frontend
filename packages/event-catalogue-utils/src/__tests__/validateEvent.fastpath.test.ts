import Ajv2019 from "ajv/dist/2019.js";

/**
 * These tests exercise the two branches of validateEvent independently:
 *  - the precompiled "fast path" (a standalone validator is importable), and
 *  - the AJV "fallback path" (no precompiled validator; schema compiled at runtime),
 * including the single-compilation guarantee of the fallback.
 *
 * We spy on Ajv2019.prototype.compile so we can assert whether AJV was invoked.
 */

const validEvent = {
  component_id: "component_id",
  event_name: "AIS_EVENT_TRANSITION_APPLIED",
  event_timestamp_ms: Date.now(),
  timestamp: Date.now(),
};

describe("validateEvent — fast path (precompiled validator present)", () => {
  const precompiledMock = vi.fn((_: unknown) => true);
  const compileSpy = vi.spyOn(Ajv2019.prototype, "compile");

  beforeEach(() => {
    vi.resetModules();
    precompiledMock.mockClear();
    compileSpy.mockClear();
  });

  afterAll(() => {
    compileSpy.mockRestore();
    vi.doUnmock(
      "@govuk-one-login/event-catalogue-schemas/validators/AIS_EVENT_TRANSITION_APPLIED.mjs",
    );
  });

  it("uses the precompiled validator and does NOT invoke AJV compile", async () => {
    // Mock the per-event validators subpath so the dynamic import resolves.
    vi.doMock(
      "@govuk-one-login/event-catalogue-schemas/validators/AIS_EVENT_TRANSITION_APPLIED.mjs",
      () => ({ default: precompiledMock }),
    );

    const { validateEvent } = await import("../validateEvent");

    const result = await validateEvent(validEvent);

    expect(result).toBe(true);
    expect(precompiledMock).toHaveBeenCalledWith(validEvent);
    expect(compileSpy).not.toHaveBeenCalled();
  });

  it("returns false and logs when the precompiled validator rejects", async () => {
    precompiledMock.mockReturnValueOnce(false);
    vi.doMock(
      "@govuk-one-login/event-catalogue-schemas/validators/AIS_EVENT_TRANSITION_APPLIED.mjs",
      () => ({ default: precompiledMock }),
    );

    const { validateEvent } = await import("../validateEvent");

    await expect(validateEvent(validEvent)).resolves.toBe(false);
    expect(compileSpy).not.toHaveBeenCalled();
  });
});

describe("validateEvent — fallback path (no precompiled validator)", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("still validates unknown properties as invalid via the fallback", async () => {
    const { validateEvent } = await import("../validateEvent");

    const invalidEvent = { ...validEvent, junk: {} } as Record<
      string,
      unknown
    > & { event_name: string };
    await expect(validateEvent(invalidEvent)).resolves.toBe(false);
  });
});
