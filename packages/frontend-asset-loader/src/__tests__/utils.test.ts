import { getDuplicateHashedFileName } from "../utils/utils";

jest.mock("../utils/logger", () => ({
  getLogger: jest.fn(),
}));

describe("getDuplicateHashedFileName", () => {
  it("returns name of duplicated file if there are duplicate hashed file names", () => {
    const duplicatesArray = [
      {
        hashedFileName: "application-ifsdjkn.css",
        fileName: "application.css",
        hash: "ifsdjkn",
      },
      {
        hashedFileName: "stylesheet-dhkjsddf.css",
        fileName: "stylesheet.css",
        hash: "dhkjsddf",
      },
      {
        hashedFileName: "application-ifsdjkn.css", // Duplicate file
        fileName: "application.css",
        hash: "ifsdjkn",
      },
      {
        hashedFileName: "init-hskdjf.js",
        fileName: "init.js",
        hash: "hskdjf",
      },
    ];

    expect(getDuplicateHashedFileName(duplicatesArray)).toEqual(
      "application-ifsdjkn.css",
    );
  });

  it("returns null if all hashed file names are unique", () => {
    const uniqueArray = [
      {
        hashedFileName: "application-ifsdjkn.css",
        fileName: "application.css",
        hash: "ifsdjkn",
      },
      {
        hashedFileName: "stylesheet-dhkjsddf.css",
        fileName: "stylesheet.css",
        hash: "dhkjsddf",
      },
      {
        hashedFileName: "init-hskdjf.js",
        fileName: "init.js",
        hash: "hskdjf.",
      },
    ];

    expect(getDuplicateHashedFileName(uniqueArray)).toEqual(null);
  });
});
