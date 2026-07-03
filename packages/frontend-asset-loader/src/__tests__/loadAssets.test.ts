import { Express } from "express";
import fg from "fast-glob";
import { PathAndFile } from "../utils/utils.types";
import { loadAssets } from "../index";
import type { Mock } from "vitest";
import * as utils from "../utils/utils";
import * as logger from "@govuk-one-login/frontend-logger";

vi.mock("fast-glob", () => ({
  __esModule: true,
  default: { sync: vi.fn() },
}));

vi.mock("../index", async () => ({
  ...(await vi.importActual("../index")),
  parseAssets: vi.fn(),
}));

vi.mock("@govuk-one-login/frontend-logger", async () => ({
  ...(await vi.importActual("@govuk-one-login/frontend-logger")),
  setCustomLogger: vi.fn(),
  getLogger: vi.fn().mockReturnValue({ warn: vi.fn() }),
}));

vi.spyOn(utils, "getDuplicateHashedFileName");

describe("loadAssets", () => {
  let app: Express;

  beforeEach(() => {
    app = { locals: {} } as Express;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should load assets, parse them, and map them to local", () => {
    const assetPath = "assets/**/*";
    const hashBetween = { start: "-", end: "." };
    const assets = ["asset1-1234.js", "asset2-5678.js"];
    const pathsAndFiles: PathAndFile[] = [
      { hashedFileName: "asset1-1234.js", fileName: "asset1.js", hash: "1234" },
      { hashedFileName: "asset2-5678.js", fileName: "asset2.js", hash: "5678" },
    ];

    (fg.sync as Mock).mockReturnValue(assets);

    loadAssets(app, assetPath, hashBetween);

    expect(fg.sync).toHaveBeenCalledWith(assetPath);
    expect(utils.getDuplicateHashedFileName).toHaveBeenCalledWith(
      pathsAndFiles,
    );
    expect(app.locals.assets).toEqual({
      "asset1.js": "asset1-1234.js",
      "asset2.js": "asset2-5678.js",
    });
  });

  it("should call setCustomLogger when a customLogger is provided", () => {
    const assetPath = "assets/**/*";
    const customLogger = { trace: vi.fn(), warn: vi.fn(), error: vi.fn(), info: vi.fn() };

    (fg.sync as Mock).mockReturnValue([]);

    loadAssets(app, assetPath, { start: "-", end: "." }, customLogger);

    expect(logger.setCustomLogger).toHaveBeenCalledWith(customLogger);
  });

  it("should log a warning when duplicate asset names are detected", () => {
    const assetPath = "assets/**/*";
    // Two files with the same hashedFileName triggers the duplicate warning
    const assets = ["path/asset1-1234.js", "other/asset1-1234.js"];
    const mockWarn = vi.fn();

    (fg.sync as Mock).mockReturnValue(assets);
    (logger.getLogger as Mock).mockReturnValue({ warn: mockWarn });

    loadAssets(app, assetPath, { start: "-", end: "." });

    expect(mockWarn).toHaveBeenCalledWith(
      expect.stringContaining("Duplicate asset name detected"),
    );
  });
});
