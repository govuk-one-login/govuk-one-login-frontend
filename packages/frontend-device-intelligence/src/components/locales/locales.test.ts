import Joi from "joi";
import { getLocales } from "./locales";

describe("locales", () => {
  it("should fetch user locale and timezone", async () => {
    const schema = Joi.object({
      languages: Joi.string().required(),
      timezone: Joi.string().required(),
    });

    const { error } = schema.validate(await getLocales());

    expect(error).toBe(undefined);
  });
});
