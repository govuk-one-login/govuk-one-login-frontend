/* eslint-disable */
import * as functions from "./functions";
import * as components from "../components/index";
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

global.fetch = jest.fn(() => Promise.resolve({ ok: true })) as jest.Mock;

describe("getFingerprintData()", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("returns filtered component data correctly", async () => {
    const data = await getFingerprintData();
    expect(data).toEqual({
      componentA: { key: "valueA" },
      componentB: { key: "valueB" },
      fonts: {
        fontHash:
          'hashed_["Arial Black","Arial Narrow","Comic Sans MS","Courier New","Geneva","Georgia","Gill Sans","Open Sans","Optima","Palatino","PT Sans","PT Serif","Rockwell","Tahoma","Trebuchet MS","Verdana"]',
      },
      thumbmark: {
        deviceHash:
          'hashed_{"componentA":{"key":"valueA"},"componentB":{"key":"valueB"}}',
      },
    });
  });

  test("handles empty data gracefully", async () => {
    jest.spyOn(components, "getComponentPromises").mockReturnValueOnce({});
    const data = await getFingerprintData();
    expect(data).toEqual({
      fonts: {
        fontHash:
          'hashed_["Arial Black","Arial Narrow","Comic Sans MS","Courier New","Geneva","Georgia","Gill Sans","Open Sans","Optima","Palatino","PT Sans","PT Serif","Rockwell","Tahoma","Trebuchet MS","Verdana"]',
      },
      thumbmark: {
        deviceHash: "hashed_{}",
      },
    });
  });

  test("throws an error if something goes wrong", async () => {
    jest
      .spyOn(components, "getComponentPromises")
      .mockImplementationOnce(() => {
        throw new Error("Test Error");
      });
    await expect(getFingerprintData()).rejects.toThrow("Test Error");
  });
});

describe("filterFingerprintData()", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

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
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("throws an error when data fetching fails", async () => {
    jest
      .spyOn(functions, "getFingerprintData")
      .mockRejectedValueOnce(new Error("Test Error"));

    await expect(getFingerprintData()).rejects.toThrow("Test Error");
  });
});

describe("setFingerprintCookie()", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    });
    jest.spyOn(global, "btoa").mockImplementation((data) => `encoded_${data}`);

    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest
      .spyOn(console, "log")
      .mockClear()
      .mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should set the fingerprint cookie correctly", async () => {
    const mockData = {
      componentA: { key: "valueA" },
      componentB: { key: "valueB" },
      thumbmark: {
        deviceHash:
          'hashed_{"componentA":{"key":"valueA"},"componentB":{"key":"valueB"}}',
      },
      fonts: {
        fontHash:
          'hashed_["Arial Black","Arial Narrow","Comic Sans MS","Courier New","Geneva","Georgia","Gill Sans","Open Sans","Optima","Palatino","PT Sans","PT Serif","Rockwell","Tahoma","Trebuchet MS","Verdana"]',
      },
    };

    jest
      .spyOn(functions, "getFingerprintData")
      .mockResolvedValue(mockData as unknown as ComponentInterface);
    jest.spyOn(global, "btoa").mockImplementation((data) => `encoded_${data}`);

    await setFingerprintCookie();

    console.log("document.cookie value:", document.cookie);

    expect(document.cookie).toBe(
      `device_intelligence_fingerprint=encoded_${JSON.stringify(mockData)}; path=/; secure; SameSite=Strict`,
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
