/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi from "joi";
import { getSystemDetails } from "./system";
import logger from "../../logger";

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
    class MockApplePaySession {
      constructor() {}
      static supportsVersion(number: number) {
        return number === 3;
      }
    }

    Object.defineProperty(global, "ApplePaySession", {
      writable: true,
      value: MockApplePaySession,
    });
    Object.defineProperty(global, "location", {
      writable: true,
      value: { protocol: "https:" },
    });

    const systemDetails = await getSystemDetails();

    expect(systemDetails.applePayVersion).toBe(3);
  });

  it("logs an error if the pay version is not supported", async () => {
    const spy = jest.spyOn(logger, "error").mockImplementation(() => {});

    (global as any).ApplePaySession = class {
      static supportsVersion() {
        throw new Error();
      }
    };
    (global as any).location = { protocol: "https:" };

    await getSystemDetails();

    expect(spy).toHaveBeenCalled();
  });
});
