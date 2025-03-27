/* eslint-disable */
import {
  getFingerprintData,
  getFingerprint,
  filterFingerprintData,
  setFingerprintCookie,
} from "./functions";
import { ComponentInterface } from "../components/index";

jest.mock("../components/index", () => ({
  getComponentPromises: jest.fn(() => ({
    componentA: Promise.resolve({ key: "valueA" }),
    componentB: Promise.resolve({ key: "valueB" }),
  })),
}));

jest.mock("../utils/hash", () => ({
  hash: jest.fn((data) => `hashed_${data}`),
}));

// Mock fetch for logging function
global.fetch = jest.fn(() => Promise.resolve({ ok: true })) as jest.Mock;

describe("getFingerprintData()", () => {
  test("returns filtered component data correctly", async () => {
    const data = await getFingerprintData();
    expect(data).toEqual({
      componentA: { key: "valueA" },
      componentB: { key: "valueB" },
    });
  });

  test("handles empty data gracefully", async () => {
    const { getComponentPromises } = require("../components/index");
    getComponentPromises.mockReturnValue({});
    const data = await getFingerprintData();
    expect(data).toEqual({});
  });

  test("throws an error if something goes wrong", async () => {
    const { getComponentPromises } = require("../components/index");
    getComponentPromises.mockImplementation(() => {
      throw new Error("Test Error");
    });
    await expect(getFingerprintData()).rejects.toThrow("Test Error");
  });
});

describe("filterFingerprintData()", () => {
  const sampleData: ComponentInterface = {
    included: { path: { key: "value" } },
    excluded: { path: { key: "excludedValue" } },
    normal: { key: "normalValue" },
  };

  test("filters out excluded data correctly", () => {
    const filteredData = filterFingerprintData(
      sampleData,
      ["excluded.path"],
      [],
    );
    expect(filteredData).toEqual({
      included: { path: { key: "value" } },
      normal: { key: "normalValue" },
    });
  });

  test("handles empty object gracefully", () => {
    const filteredData = filterFingerprintData({}, [], []);
    expect(filteredData).toEqual({});
  });
});

describe("getFingerprint()", () => {
  test("throws an error when data fetching fails", async () => {
    const { getFingerprintData } = require("./functions");
    jest
      .spyOn(require("./functions"), "getFingerprintData")
      .mockRejectedValue(new Error("Test Error"));
    await expect(getFingerprint()).rejects.toThrow("Test Error");
  });
});

describe("setFingerprintCookie()", () => {
  beforeEach(() => {
    Object.defineProperty(document, "cookie", {
      writable: true,
      value:
        "/device_intelligence_fingerprint=.*; path=\/; Secure; SameSite=Strict/",
    });

    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should set the fingerprint cookie correctly", async () => {
    jest
      .spyOn(require("./functions"), "getFingerprint")
      .mockResolvedValue("mockFingerprint");

    await setFingerprintCookie();

    expect(document.cookie).toMatch(
      /device_intelligence_fingerprint=.*; path=\/; Secure; SameSite=Strict/,
    );
  });

  it("should log a warning if run on the server side", async () => {
    const originalWindow = global.window;
    delete (global as any).window;

    await setFingerprintCookie();

    expect(console.warn).toHaveBeenCalledWith(
      "fingerprint cookie logic should only run on the client side",
    );

    global.window = originalWindow;
  });

  it("should log an error if fingerprint generation fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(global, "btoa").mockImplementation(() => {
      throw new Error("Encoding error");
    });

    await setFingerprintCookie();

    expect(console.error).toHaveBeenCalledWith(
      "Error setting fingerprint cookie:",
      expect.any(Error),
    );
  });
});
