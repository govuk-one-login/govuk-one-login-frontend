import Joi from "joi";
import { getHardwareInfo } from "./hardware";

vi.stubGlobal("navigator", {
  deviceMemory: 8,
});

const mockDocument = (context: Record<string, unknown>) =>
  vi.stubGlobal("document", {
    createElement: () => ({
      getContext: vi.fn().mockImplementation(() => context),
    }),
  });

describe("hardware", () => {
  it("should fetch hardware data in the correct format", async () => {
    mockDocument({
      RENDERER: "renderer",
      VENDOR: "vendor",
      VERSION: "version",
      SHADING_LANGUAGE_VERSION: "shading-language-version",
      getParameter: vi.fn().mockImplementation((param) => param),
      getExtension: () => {},
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
    mockDocument({
      VENDOR: "",
      RENDERER: "",
      VERSION: "version",
      SHADING_LANGUAGE_VERSION: "shading-language-version",
      getExtension: vi.fn().mockImplementation(() => ({
        UNMASKED_RENDERER_WEBGL: "unmasked-renderer-webgl",
        UNMASKED_VENDOR_WEBGL: "unmasked-vendor-webgl",
      })),
      getParameter: vi.fn().mockImplementation((param) => param),
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
