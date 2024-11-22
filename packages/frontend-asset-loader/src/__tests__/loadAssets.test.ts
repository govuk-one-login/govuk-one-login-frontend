import { Express } from "express";
import fg from "fast-glob";
import { PathAndFile } from "../utils/utils.types";
import { loadAssets } from "../index";
import * as utils from "../utils/utils";

jest.mock("fast-glob", () => ({
  __esModule: true,  
  default: { sync: jest.fn() },
}));

jest.mock("../index", () => ({
  ...jest.requireActual("../index"),
  parseAssets: jest.fn(),
}));

jest.spyOn(utils, "getDuplicateHashedFileName");

describe("loadAssets", () => {
  let app: Express;

  beforeEach(() => {
    app = { locals: {} } as Express;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should load assets, parse them, and map them to local", () => {
    const assetPath = "assets/**/*";
    const hashBetween = { start: "-", end: "." };
    const assets = ["asset1-1234.js", "asset2-5678.js"];
    const pathsAndFiles: PathAndFile[] = [
      { hashedFileName: "asset1-1234.js", fileName: "asset1.js", hash: "1234" },
      { hashedFileName: "asset2-5678.js", fileName: "asset2.js", hash: "5678" },
    ];

    (fg.sync as jest.Mock).mockReturnValue(assets);

    loadAssets(app, assetPath, hashBetween);

    expect(fg.sync).toHaveBeenCalledWith(assetPath);
    expect(utils.getDuplicateHashedFileName).toHaveBeenCalledWith(pathsAndFiles);
    expect(app.locals.assets).toEqual({
      "asset1.js": "asset1-1234.js",
      "asset2.js": "asset2-5678.js",
    });
  });
});
