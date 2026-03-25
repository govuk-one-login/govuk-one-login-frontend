/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi from "joi";
import { getSystemDetails } from "./system";
import logger from "../../logger";

const applePayVersionMock = vi.fn();

class MockApplePaySession {
  constructor() {}
  static supportsVersion = applePayVersionMock;
}

const windowMock = {
  navigator: {
    platform: "platform",
    cookieEnabled: true,
  },
  location: { protocol: "https:" },
  ApplePaySession: MockApplePaySession,
};

const navigatorMock = {
  productSub: "productSub",
  product: "product",
  userAgent: "useragent",
  hardwareConcurrency: 1,
};

vi.stubGlobal("window", windowMock);
vi.stubGlobal("navigator", navigatorMock);

describe("system", () => {
  beforeEach(applePayVersionMock.mockClear());

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
    applePayVersionMock.mockImplementation((version) => version === 3);

    const systemDetails = await getSystemDetails();
    expect(systemDetails.applePayVersion).toBe(3);
  });

  it("logs an error if the pay version is not supported", async () => {
    const spy = vi.spyOn(logger, "error");

    applePayVersionMock.mockImplementation(() => {
      throw new Error();
    });

    await getSystemDetails();

    expect(spy).toHaveBeenCalled();
  });
});
