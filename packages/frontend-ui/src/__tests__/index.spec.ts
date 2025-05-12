import i18next from "i18next";
import fs, { readFileSync } from "fs";
import { Request, Response } from "express";
import path from "path";
import {
  frontendUiMiddleware,
  setFrontendUiTranslations,
  addLanguageParam,
  contactUsUrl,
  getTranslationObject,
  setBaseTranslations,
} from "..";

// Define types for Express and non-Express versions
interface I18nData {
  language: string;
  store: {
    data: { [key: string]: unknown };
  };
}

interface ExpressRequest extends Request {
  i18n: I18nData;
}

interface ExpressResponse extends Response {
  locals: {
    translations: unknown;
    basePath?: string;
  };
}

interface PlainRequest {
  i18n: I18nData;
}

interface PlainResponse {
  locals: {
    translations: unknown;
    basePath?: string;
  };
}

describe("frontendUiMiddleware", () => {
  it("should attach translations and basePath to locals for ExpressRequest", () => {
    const mockRequest = {
      i18n: {
        language: "en",
        store: { data: { en: { key: "value" } } },
      },
    } as unknown as ExpressRequest;

    const mockResponse = {
      locals: {},
    } as unknown as ExpressResponse;

    const next = jest.fn();

    frontendUiMiddleware(mockRequest, mockResponse, next);

    expect(mockResponse.locals.translations).toEqual({ key: "value" });
    expect(mockResponse.locals.basePath).toBe(process.cwd());
    expect(next).toHaveBeenCalled();
  });

  it("should attach translations and basePath to locals for PlainRequest", () => {
    const mockRequest = {
      i18n: {
        language: "cy",
        store: { data: { cy: { key: "value" } } },
      },
    } as unknown as PlainRequest;

    const mockResponse = {
      locals: {},
    } as unknown as PlainResponse;

    const next = jest.fn();

    frontendUiMiddleware(mockRequest, mockResponse, next);

    expect(mockResponse.locals.translations).toEqual({ key: "value" });
    expect(mockResponse.locals.basePath).toBe(process.cwd());
    expect(next).toHaveBeenCalled();
  });

  it("should handle missing translations gracefully", () => {
    const mockRequest = {
      i18n: {
        language: "fr",
        store: { data: { en: { key: "value" } } },
      },
    } as unknown as ExpressRequest;

    const mockResponse = {
      locals: {},
    } as unknown as ExpressResponse;

    const next = jest.fn();

    frontendUiMiddleware(mockRequest, mockResponse, next);

    expect(mockResponse.locals.translations).toBeUndefined();
    expect(mockResponse.locals.basePath).toBe(process.cwd());
    expect(next).toHaveBeenCalled();
  });
});

describe("setFrontendUiTranslations", () => {
  describe("when setFrontendUiTranslations is called", () => {
    it("should add default translations to the i18n resource bundle", (done) => {
      i18next.init({ fallbackLng: "en" }, () => {
        setFrontendUiTranslations(i18next);

        expect(i18next.t("cookieBanner.headingText")).toBe(
          "Cookies on GOV.UK One Login",
        );

        done();
      });
    });
  });
});

describe("addLanguageParam function", () => {
  it("should add language parameter to URL", () => {
    const language = "en";
    const url = new URL("http://example.com");

    const result = addLanguageParam(language, url);
    expect(result).toContain("lng=en");
  });

  it("should add language parameter to URL without any existing parameters", () => {
    const result = addLanguageParam("en", new URL("http://example.com"));
    expect(result).toContain("/?lng=en");
  });

  it("should add language parameter to URL with existing parameters", () => {
    const result = addLanguageParam(
      "en",
      new URL("http://localhost:6001/path?param1=value1"),
    );
    expect(result).toContain("/path?");
    expect(result).toContain("lng=en");
  });

  it("should not duplicate the language parameter in URL", () => {
    const result = addLanguageParam(
      "cy",
      new URL("http://localhost:6001/path?param1=value1&lng=en"),
    );
    expect(result).toContain("/path?");
    expect(result).toContain("param1=value1");
    expect(result).toContain("lng=cy");
    expect(result.split("lng=").length - 1).toEqual(1); // ensures 'lng' parameter appears only once
  });
  it("should return #invalid-url-lang-toggle if url is undefined", () => {
    const result = addLanguageParam("en", undefined);
    expect(result).toContain("#invalid-url-lang-toggle");
  });
});

describe("contactUsUrl function", () => {
  it("should add fromURL parameter to URL", () => {
    const baseUrl = "https://www.example.com";
    const urlToAppend = "/some-path";
    const result = contactUsUrl(baseUrl, urlToAppend);
    expect(result).toContain("?fromURL=%2Fsome-path");
  });

  it("should return null if baseUrl is undefined", () => {
    const urlToAppend = "/some-path";
    const result = contactUsUrl("", urlToAppend);
    expect(result).toBeNull();
  });

  describe("setBaseTranslations", () => {
    it('should add resource bundles for "cy" and "en" locales', () => {
      const mockI18n = {
        addResourceBundle: jest.fn(),
      } as unknown as typeof i18next;

      setBaseTranslations(mockI18n);

      expect(mockI18n.addResourceBundle).toHaveBeenCalledTimes(2);
      expect(mockI18n.addResourceBundle).toHaveBeenCalledWith(
        "cy",
        "translation",
        getTranslationObject("cy"),
      );
      expect(mockI18n.addResourceBundle).toHaveBeenCalledWith(
        "en",
        "translation",
        getTranslationObject("en"),
      );
    });

    it("should handle missing translation files gracefully", () => {
      const mockI18n = {
        addResourceBundle: jest.fn(),
      } as unknown as typeof i18next;

      jest.spyOn(fs, "readFileSync").mockImplementation(() => {
        throw new Error("File not found");
      });

      expect(() => setBaseTranslations(mockI18n)).not.toThrow();
      expect(mockI18n.addResourceBundle).toHaveBeenCalledTimes(2);

      (readFileSync as jest.MockedFunction<typeof readFileSync>).mockRestore();
    });

    it("should use a custom file path if provided", () => {
      const mockI18n = {
        addResourceBundle: jest.fn(),
      } as unknown as typeof i18next;

      const customPath = "custom/path";
      jest.spyOn(fs, "existsSync").mockImplementation((filePath) => {
        return filePath === path.resolve(customPath, "cy", "translation.json");
      });
      jest
        .spyOn(fs, "readFileSync")
        .mockImplementation(() => JSON.stringify({ key: "value" }));

      setBaseTranslations(mockI18n, customPath);

      expect(mockI18n.addResourceBundle).toHaveBeenCalledWith(
        "cy",
        "translation",
        { key: "value" },
      );
      expect(mockI18n.addResourceBundle).toHaveBeenCalledWith(
        "en",
        "translation",
        {},
      );

      jest.restoreAllMocks();
    });
  });

  describe("getTranslationObject", () => {
    const mockFileContent = JSON.stringify({ key: "value" });

    beforeEach(() => {
      jest.resetAllMocks();
    });

    it("should return the parsed content of the first existing translation file", () => {
      jest.spyOn(fs, "existsSync").mockImplementation((filePath) => {
        return filePath === path.resolve("locales", "en", "translation.json");
      });
      jest.spyOn(fs, "readFileSync").mockImplementation(() => mockFileContent);

      const result = getTranslationObject("en");

      expect(result).toEqual({ key: "value" });
      expect(fs.existsSync).toHaveBeenCalledWith(
        path.resolve("locales", "en", "translation.json"),
      );
      expect(fs.readFileSync).toHaveBeenCalledWith(
        path.resolve("locales", "en", "translation.json"),
        "utf8",
      );
    });

    it("should try multiple paths and return the parsed content of the first valid file", () => {
      jest.spyOn(fs, "existsSync").mockImplementation((filePath) => {
        return (
          filePath === path.resolve("src/locales", "en", "translation.json")
        );
      });
      jest.spyOn(fs, "readFileSync").mockImplementation(() => mockFileContent);

      const result = getTranslationObject("en");

      expect(result).toEqual({ key: "value" });
      expect(fs.existsSync).toHaveBeenCalledWith(
        path.resolve("locales", "en", "translation.json"),
      );
      expect(fs.existsSync).toHaveBeenCalledWith(
        path.resolve("src/locales", "en", "translation.json"),
      );
      expect(fs.readFileSync).toHaveBeenCalledWith(
        path.resolve("src/locales", "en", "translation.json"),
        "utf8",
      );
    });

    it("should handle a custom file path if provided", () => {
      const customPath = "custom/path";
      jest.spyOn(fs, "existsSync").mockImplementation((filePath) => {
        return filePath === path.resolve(customPath, "en", "translation.json");
      });
      jest.spyOn(fs, "readFileSync").mockImplementation(() => mockFileContent);

      const result = getTranslationObject("en", customPath);

      expect(result).toEqual({ key: "value" });
      expect(fs.existsSync).toHaveBeenCalledWith(
        path.resolve(customPath, "en", "translation.json"),
      );
      expect(fs.readFileSync).toHaveBeenCalledWith(
        path.resolve(customPath, "en", "translation.json"),
        "utf8",
      );
    });

    it("should return an empty object if no translation file is found", () => {
      jest.spyOn(fs, "existsSync").mockReturnValue(false);

      const result = getTranslationObject("en");

      expect(result).toEqual({});
      expect(fs.existsSync).toHaveBeenCalledTimes(3);
    });

    it("should log an error if reading or parsing the file fails", () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      jest.spyOn(fs, "existsSync").mockReturnValue(true);
      jest.spyOn(fs, "readFileSync").mockImplementation(() => {
        throw new Error("File read error");
      });

      const result = getTranslationObject("en");

      expect(result).toEqual({});
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Error reading or parsing translation file"),
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });

    it("should log a warning if no translation file is found", () => {
      const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
      jest.spyOn(fs, "existsSync").mockReturnValue(false);

      getTranslationObject("en");

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "No translation file found for locale: en",
      );

      consoleWarnSpy.mockRestore();
    });
  });
});
