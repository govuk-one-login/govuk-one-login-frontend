import i18next from "i18next";
import fs, { readFileSync } from "fs";
import { Request, Response, NextFunction } from "express";
import {
  frontendUiMiddleware,
  setFrontendUiTranslations,
  addLanguageParam,
  contactUsUrl,
  getTranslationObject,
  setBaseTranslations,
} from "..";

describe("frontendUiMiddleware", () => {
  describe("when the ui middleware is called", () => {
    it("should attach translations from the i18n store to locals", () => {
      const mockRequest = {
        i18n: {
          language: "en",
          store: { data: { en: { translationKey: "translationValue" } } },
        },
      } as unknown as Request & {
        i18n: { language: string; store: { data: { [key: string]: unknown } } };
      };

      const mockResponse = {
        locals: {},
      } as Response & { locals: { translations: unknown } };

      const next = jest.fn() as NextFunction;

      frontendUiMiddleware(mockRequest, mockResponse, next);

      expect(mockResponse.locals.translations).toEqual({
        translationKey: "translationValue",
      });
      expect(next).toHaveBeenCalled();
    });
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
      // Mock the readFileSync to throw an error simulating a missing file.
      jest.spyOn(fs, "readFileSync").mockImplementation(() => {
        throw new Error("File not found");
      });

      expect(() => setBaseTranslations(mockI18n)).toThrow("File not found");

      // Restore the original readFileSync
      (readFileSync as jest.MockedFunction<typeof readFileSync>).mockRestore();
    });
  });

  describe("getTranslationObject", () => {
    it("should return a translation object for a given locale", () => {
      const mockTranslations = { key1: "value1", key2: "value2" };
      jest
        .spyOn(fs, "readFileSync")
        .mockReturnValue(JSON.stringify(mockTranslations));
      const result = getTranslationObject("test-locale");
      expect(result).toEqual(mockTranslations);
      (readFileSync as jest.MockedFunction<typeof readFileSync>).mockRestore();
    });

    it("should handle invalid JSON in translation file", () => {
      jest.spyOn(fs, "readFileSync").mockReturnValueOnce("invalid json");
      expect(() => getTranslationObject("invalid-locale")).toThrow(SyntaxError); // Expecting a SyntaxError for invalid JSON parsing
      (readFileSync as jest.MockedFunction<typeof readFileSync>).mockRestore();
    });

    it("should handle missing translation files", () => {
      // Mock the readFileSync to throw an error simulating a missing file.
      jest.spyOn(fs, "readFileSync").mockImplementation(() => {
        throw new Error("File not found");
      });

      expect(() => getTranslationObject("missing-locale")).toThrow(
        "File not found",
      );

      // Restore the original readFileSync
      (readFileSync as jest.MockedFunction<typeof readFileSync>).mockRestore();
    });
  });
});
