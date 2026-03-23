// @vitest-environment node

import Joi from "joi";
import { getFontMetrics } from "./fonts";

vi.mock("../../utils/ephemeralIFrame", () => ({
  ephemeralIFrame: (callback: ({ iframe }: { iframe: object }) => void) =>
    callback({
      iframe: {
        createElement: () => ({
          getContext: () => ({ measureText: () => ({ width: 4 }) }),
        }),
      },
    }),
}));

describe("fonts", () => {
  it("should fetch font data in the correct format", async () => {
    const schema = Joi.object({
      fontHash: Joi.string().required(),
    });

    const { error } = schema.validate(await getFontMetrics());

    expect(error).toBe(undefined);
  });
});
