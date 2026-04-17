import Joi from "joi";
import { getSystemDetails } from "./system";

vi.stubGlobal("navigator", {
  productSub: "productSub",
  product: "product",
  userAgent: "useragent",
  hardwareConcurrency: 1,
  platform: "platform",
  cookieEnabled: true,
});

vi.mock("../../utils/windowTools");

describe("system", () => {
  it("should fetch system data", async () => {
    const schema = Joi.object({
      platform: Joi.string().required().allow(""),
      cookieEnabled: Joi.boolean().required(),
      productSub: Joi.string().required(),
      product: Joi.string().required(),
      useragent: Joi.string().required(),
      hardwareConcurrency: Joi.number().required(),
      browser: Joi.object({
        name: Joi.string().required(),
        version: Joi.string().required(),
      }).required(),
      applePayVersion: Joi.number().required(),
    });

    const { error } = schema.validate(await getSystemDetails());

    expect(error).toBe(undefined);
  });

  it("should fetch apple pay data if it is present", async () => {
    const systemDetails = await getSystemDetails();
    expect(systemDetails.applePayVersion).toBe(3);
  });
});
