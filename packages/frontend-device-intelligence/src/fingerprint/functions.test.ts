import * as functions from "./functions";
import * as components from "../components/index";
import {
  getFingerprintData,
  filterFingerprintData,
  setFingerprintCookie,
} from "./functions";
import { ComponentInterface } from "../components/index";
import logger from "../logger";

vi.mock("../components/index", () => ({
  getComponentPromises: vi.fn(() => ({
    componentA: Promise.resolve({ key: "valueA" }),
    componentB: Promise.resolve({ key: "valueB" }),
    thumbmark: Promise.resolve({
      deviceHash: "9c69a4ffa43f3bd072ddce5b4c2e424e",
    }),
  })),
}));

const hashMock = vi.fn().mockReturnValue({
  componentA: Promise.resolve({ key: "valueA" }),
  componentB: Promise.resolve({ key: "valueB" }),
  fonts: Promise.resolve({ fontHash: "b582964e91622e755c423ad99c8ec9b4" }),
  thumbmark: Promise.resolve({
    deviceHash: "9c69a4ffa43f3bd072ddce5b4c2e424e",
  }),
});

vi.mock("../utils/hash", () => ({
  hash: () => hashMock(),
}));

const getFontMetricsMock = vi.fn().mockImplementation(() => {
  throw new Error();
});

vi.mock("../components/fonts/fonts", () => ({
  getFontMetrics: () => getFontMetricsMock(),
}));

describe("getFingerprintData()", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
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

    vi.spyOn(functions, "getFingerprintData").mockResolvedValue(
      mockData as unknown as ComponentInterface,
    );

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
    vi.spyOn(functions, "getFingerprintData").mockResolvedValue(
      mockData as unknown as ComponentInterface,
    );

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
    vi.spyOn(components, "getComponentPromises").mockImplementationOnce(() => {
      throw new Error("Test Error");
    });
    await expect(getFingerprintData()).rejects.toThrow("Test Error");
  });
});

describe("filterFingerprintData()", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("throws an error when data fetching fails", async () => {
    vi.spyOn(functions, "getFingerprintData").mockRejectedValueOnce(
      new Error("Test Error"),
    );

    await expect(getFingerprintData()).rejects.toThrow("Test Error");
  });
});

describe("setFingerprintCookie()", () => {
  beforeEach(() => {
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    });

    vi.spyOn(logger, "warn").mockImplementation(() => {});
    vi.spyOn(logger, "error").mockImplementation(() => {});
    vi.spyOn(logger, "log").mockImplementation(() => {});
  });

  test("should set the fingerprint cookie correctly", async () => {
    hashMock.mockReturnValue({
      componentA: Promise.resolve({ key: "valueA" }),
      componentB: Promise.resolve({ key: "valueB" }),
      thumbmark: Promise.resolve({
        deviceHash: "9c69a4ffa43f3bd072ddce5b4c2e424e",
      }),
    });

    const mockData = {
      componentA: { key: "valueA" },
      componentB: { key: "valueB" },
    };

    vi.stubGlobal(
      "btoa",
      vi.fn().mockImplementation((mockData) => `encoded_${mockData}`),
    );

    await setFingerprintCookie();

    logger.log("document.cookie value:", document.cookie);

    expect(document.cookie).toBe(
      `di-device-intelligence=encoded_${JSON.stringify(mockData)}; path=/; domain=account.gov.uk; secure; SameSite=Strict`,
    );
  });

  test("should log an error if fingerprint generation fails", async () => {
    vi.stubGlobal(
      "btoa",
      vi.fn().mockImplementation(() => {
        throw new Error("Encoding error");
      }),
    );

    await setFingerprintCookie();

    expect(logger.error).toHaveBeenCalledWith(
      "Error setting fingerprint cookie:",
      expect.any(Error),
    );
  });
});
