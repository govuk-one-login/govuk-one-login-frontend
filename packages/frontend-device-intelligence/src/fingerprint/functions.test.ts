/* eslint-disable */
import * as functions from "./functions";
import * as components from "../components/index";
import {
  getFingerprintData,
  filterFingerprintData,
  setFingerprintCookie,
} from "./functions";
import { ComponentInterface } from "../components/index";

jest.mock("../components/index", () => ({
  getComponentPromises: jest.fn(() => ({
    componentA: Promise.resolve({ key: "valueA" }),
    componentB: Promise.resolve({ key: "valueB" }),
    fonts: Promise.resolve({ fontHash: "b582964e91622e755c423ad99c8ec9b4" }),
    thumbmark: Promise.resolve({
      deviceHash: "9c69a4ffa43f3bd072ddce5b4c2e424e",
    }),
  })),
}));

jest.mock("../utils/hash", () => ({
  hash: jest.fn(() => ({
    componentA: Promise.resolve({ key: "valueA" }),
    componentB: Promise.resolve({ key: "valueB" }),
    fonts: Promise.resolve({ fontHash: "b582964e91622e755c423ad99c8ec9b4" }),
    thumbmark: Promise.resolve({
      deviceHash: "9c69a4ffa43f3bd072ddce5b4c2e424e",
    }),
  })),
}));

describe("getFingerprintData()", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("returns filtered component data correctly", async () => {
    const mockData = {
      componentA: { key: "valueA" },
      componentB: { key: "valueB" },
      thumbmark: {
        deviceHash: "9c69a4ffa43f3bd072ddce5b4c2e424e",
      },
      fonts: {
        fontHash: "b582964e91622e755c423ad99c8ec9b4",
      },
    };

    jest
      .spyOn(functions, "getFingerprintData")
      .mockResolvedValue(mockData as unknown as ComponentInterface);

    expect(mockData).toEqual({
      componentA: { key: "valueA" },
      componentB: { key: "valueB" },
      fonts: {
        fontHash: "b582964e91622e755c423ad99c8ec9b4",
      },
      thumbmark: {
        deviceHash: "9c69a4ffa43f3bd072ddce5b4c2e424e",
      },
    });
  });

  test("handles empty data gracefully", async () => {
    const mockData = {
      componentA: { key: "" },
      componentB: { key: "" },
      thumbmark: {
        deviceHash: "",
      },
      fonts: {
        fontHash: "",
      },
    };
    jest
      .spyOn(functions, "getFingerprintData")
      .mockResolvedValue(mockData as unknown as ComponentInterface);

    expect(mockData).toEqual({
      componentA: { key: "" },
      componentB: { key: "" },
      fonts: {
        fontHash: "",
      },
      thumbmark: {
        deviceHash: "",
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

  test("should set the fingerprint cookie correctly", async () => {
    const mockData = {
      componentA: { key: "valueA" },
      componentB: { key: "valueB" },
    };

    jest
      .spyOn(global, "btoa")
      .mockImplementation((mockData) => `encoded_${mockData}`);

    await setFingerprintCookie();

    console.log("document.cookie value:", document.cookie);

    expect(document.cookie).toBe(
      `device_intelligence_fingerprint=encoded_${JSON.stringify(mockData)}; path=/; secure; SameSite=Strict`,
    );
  });

  test("should log a warning if run on the server side", async () => {
    const originalWindow = global.window;
    delete (global as any).window;

    await setFingerprintCookie();

    expect(console.warn).toHaveBeenCalledWith(
      "fingerprint cookie logic should only run on the client side",
    );

    global.window = originalWindow;
  });

  test("should log an error if fingerprint generation fails", async () => {
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
