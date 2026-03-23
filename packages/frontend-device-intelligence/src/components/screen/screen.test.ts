import Joi from "joi";
import { screenDetails } from "./screen";

describe("screen", () => {
  it("should fetch user screen data in the correct format", async () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const schema = Joi.object({
      is_touchscreen: Joi.boolean().required(),
      maxTouchPoints: Joi.number(),
      colorDepth: Joi.number().required(),
      mediaMatches: Joi.array().items(Joi.string()).required(),
    });

    const { error } = schema.validate(await screenDetails());

    expect(error).toBe(undefined);
  });

  it("should exclude media queries that are not matched", async () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    const screen1 = await screenDetails();
    expect(
      !!(screen1.mediaMatches as string[]).some((a) =>
        a.startsWith("scripting"),
      ),
    ).toBe(true);

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: !query.startsWith("(scripting"),
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    const screen2 = await screenDetails();
    expect(
      !!(screen2.mediaMatches as string[]).some((a) =>
        a.startsWith("scripting"),
      ),
    ).toBe(false);
    expect(
      !!(screen2.mediaMatches as string[]).some((a) =>
        a.startsWith("any-hover"),
      ),
    ).toBe(true);
  });
});
