import Joi from "joi";
import { getHardwareInfo } from "./hardware";

describe("hardware", () => {
  it("should fetch hardware data in the correct format", async () => {
    Object.defineProperty(global.document, "createElement", {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        getContext: jest.fn().mockImplementation(() => ({
          VENDOR: "vendor",
          RENDERER: "renderer",
          VERSION: "version",
          SHADING_LANGUAGE_VERSION: "shading-language-version",
          getParameter: jest.fn().mockImplementation((param) => param),
        })),
      })),
    });

    Object.defineProperty(global.navigator, "deviceMemory", {
      writable: true,
      value: 8,
    });

    const hardwareInfo = await getHardwareInfo();

    expect(hardwareInfo.deviceMemory).toEqual("8");
    expect(hardwareInfo.videocard).toEqual({
      vendor: "vendor",
      renderer: "renderer",
      version: "version",
      shadingLanguageVersion: "shading-language-version",
    });

    const schema = Joi.object({
      architecture: Joi.number().required(),
      deviceMemory: Joi.string().required(),
      jsHeapSizeLimit: Joi.number().required(),
      videocard: Joi.object({
        vendor: Joi.string().required(),
        renderer: Joi.string().required(),
        version: Joi.string().required(),
        shadingLanguageVersion: Joi.string().required(),
      }).required(),
    });

    const { error } = schema.validate(hardwareInfo);

    expect(error).toBe(undefined);
  });

  it("should fall back to debug values when main videocard info is not available", async () => {
    Object.defineProperty(global.document, "createElement", {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        getContext: jest.fn().mockImplementation(() => ({
          VENDOR: "",
          RENDERER: "",
          VERSION: "version",
          SHADING_LANGUAGE_VERSION: "shading-language-version",
          getExtension: jest.fn().mockImplementation(() => ({
            UNMASKED_RENDERER_WEBGL: "unmasked-renderer-webgl",
            UNMASKED_VENDOR_WEBGL: "unmasked-vendor-webgl",
          })),
          getParameter: jest.fn().mockImplementation((param) => param),
        })),
      })),
    });

    Object.defineProperty(global.navigator, "deviceMemory", {
      writable: true,
      value: 8,
    });

    const hardwareInfo = await getHardwareInfo();

    expect(hardwareInfo.deviceMemory).toEqual("8");
    expect(hardwareInfo.videocard).toEqual({
      vendor: "",
      renderer: "",
      version: "version",
      shadingLanguageVersion: "shading-language-version",
      vendorUnmasked: "unmasked-vendor-webgl",
      rendererUnmasked: "unmasked-renderer-webgl",
    });

    const schema = Joi.object({
      architecture: Joi.number().required(),
      deviceMemory: Joi.string().required(),
      jsHeapSizeLimit: Joi.number().required(),
      videocard: Joi.object({
        vendor: Joi.string().allow(""),
        renderer: Joi.string().allow(""),
        version: Joi.string().required(),
        shadingLanguageVersion: Joi.string().required(),
        vendorUnmasked: Joi.string().required(),
        rendererUnmasked: Joi.string().required(),
      }).required(),
    });

    const { error } = schema.validate(hardwareInfo);

    expect(error).toBe(undefined);
  });
});
