import { getLogger } from "../utils/logger";
import { isValidHashName, getDuplicateHashedFileName } from "../utils/utils";

jest.mock("../utils/logger", () => ({
  getLogger: jest.fn(),
}));

describe("isValidHashName", () => {
  it("returns true when valid hash name", () => {
    expect(isValidHashName("application-ifsdjkn.css", "-", ".")).toEqual(true);
    expect(isValidHashName("stylesheet/ifsdjkn.css", "/", ".")).toEqual(true);
    expect(isValidHashName("font+ifsdjkn.css", "+", ".")).toEqual(true);
  });

  describe("error handling", () => {
    beforeEach(() => {
      (getLogger as jest.Mock).mockReturnValue({
        trace: jest.fn(),
        warn: jest.fn(),
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("returns false and logs warning for multiple instances of both hashStart and hashEnd", () => {
      expect(
        isValidHashName("application-main-dsdf4.min.js", "-", "."),
      ).toEqual(false);

      expect(getLogger().warn).toHaveBeenCalledWith(
        'Warning: Incorrect number of hash start "-" and hash end "." identifiers found in application-main-dsdf4.min.js',
      );
    });

    describe("hashStart error cases", () => {
      it("returns false and logs warning if multiple instances of hashStart", () => {
        expect(isValidHashName("application-dsdf4-min.js", "-", ".")).toEqual(
          false,
        );

        expect(getLogger().warn).toHaveBeenCalledWith(
          'Warning: Too many hash start "-" identifers found in application-dsdf4-min.js',
        );
      });

      it("returns false and logs warning if no instances of hashStart", () => {
        expect(isValidHashName("applicationdsdf4min.js", "-", ".")).toEqual(
          false,
        );

        expect(getLogger().warn).toHaveBeenCalledWith(
          'Warning: No hash start "-" identifer found in applicationdsdf4min.js',
        );
      });
    });

    describe("hashEnd error cases", () => {
      it("returns false and logs warning if multiple instances of hashEnd", () => {
        expect(isValidHashName("app-dsdf4.min.js.extra", "-", ".")).toEqual(
          false,
        );

        expect(getLogger().warn).toHaveBeenCalledWith(
          'Warning: Too many hash end "." identifers found in app-dsdf4.min.js.extra',
        );
      });

      it("returns false and logs warning if no instances of hashEnd", () => {
        expect(isValidHashName("app-dsdf4minjsextracss", "-", ".")).toEqual(
          false,
        );

        expect(getLogger().warn).toHaveBeenCalledWith(
          'Warning: No hash end "." identifer found in app-dsdf4minjsextracss',
        );
      });
    });
  });
});

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
