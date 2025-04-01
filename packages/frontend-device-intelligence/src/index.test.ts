import Joi from "joi";
import { getFingerprint, getFingerprintData } from "./index";

function mockTextEncoder() {}
mockTextEncoder.prototype.encode = (str: string) => {
  const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  const bufView = new Uint16Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return { buffer: buf };
};

describe("index", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    Object.assign(global, { TextEncoder: mockTextEncoder });
  });

  it("should generate a fingerprint in the right shape", async () => {
    const fp = await getFingerprint();
    expect(typeof fp).toBe("string");
    expect(fp.length).toBe(32);
  });

  it("should generate fingerprint data in the right shape", async () => {
    const schema = Joi.object({
      fonts: Joi.any().required(),
      hardware: Joi.any().required(),
      locales: Joi.any().required(),
      plugins: Joi.any().required(),
      screen: Joi.any().required(),
      system: Joi.any().required(),
      thumbmark: Joi.any().required(),
    });

    const { error } = schema.validate(await getFingerprintData());

    expect(error).toBe(undefined);
  });
});
