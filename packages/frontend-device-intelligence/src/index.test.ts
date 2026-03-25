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

vi.mock("../utils/hash", () => ({
  hash: vi.fn().mockReturnValue({
    componentA: Promise.resolve({ key: "valueA" }),
    componentB: Promise.resolve({ key: "valueB" }),
    fonts: Promise.resolve({ fontHash: "b582964e91622e755c423ad99c8ec9b4" }),
    thumbmark: Promise.resolve({
      deviceHash: "9c69a4ffa43f3bd072ddce5b4c2e424e",
    }),
  }),
}));

vi.mock("./components/fonts/fonts", () => ({
  getFontMetrics: vi.fn().mockImplementation(async () => ({})),
}));

describe("index", () => {
  beforeAll(() => {
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

    vi.stubGlobal("TextEncoder", mockTextEncoder);
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
