import Joi from "joi";
import { getFontMetrics } from "./fonts";

describe("fonts", () => {
  it("should fetch font data in the correct format", async () => {
    const schema = Joi.object({
      fontHash: Joi.string().required(),
    });

    const { error } = schema.validate(await getFontMetrics());

    expect(error).toBe(undefined);
  });
});
