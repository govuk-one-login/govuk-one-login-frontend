import i18next from "i18next";
import fs from "node:fs";
import { Request, Response } from "express";
import path from "node:path";
import {
  frontendUiMiddleware,
  setFrontendUiTranslations,
  addLanguageParam,
  contactUsUrl,
  getTranslationObject,
  setBaseTranslations,
  addFrontendUiGlobals,
  warnCharacterLimit,
  validateTranslations,
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
    allTranslations: { [key: string]: unknown };
  };
}

interface PlainRequest {
  i18n: I18nData;
}

interface PlainResponse {
  locals: {
    translations: unknown;
    basePath?: string;
    allTranslations: { [key: string]: unknown };
  };
}

const mockLogger = vi.fn();

vi.mock("../utils/logger", () => ({
  getLogger: () => ({
    warn: () => mockLogger(),
  }),
}));

const existsSyncMock = vi.spyOn(fs, "existsSync");
const readFileSyncMock = vi.spyOn(fs, "readFileSync");

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

    const next = vi.fn();

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
      locals: {
      },
    } as unknown as PlainResponse;

    const next = vi.fn();

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

    const next = vi.fn();

    frontendUiMiddleware(mockRequest, mockResponse, next);

    expect(mockResponse.locals.translations).toBeUndefined();
    expect(mockResponse.locals.basePath).toBe(process.cwd());
    expect(next).toHaveBeenCalled();
  });
});

describe("setFrontendUiTranslations", () => {
  describe("when setFrontendUiTranslations is called", () => {
    it("should add default translations to the i18n resource bundle", () => {
      i18next.init({ fallbackLng: "en" }, () => {
        setFrontendUiTranslations(i18next);

        expect(i18next.t("cookieBanner.headingText")).toBe(
          "Cookies on GOV.UK One Login",
        );
      });
    });
  });
});

describe("addLanguageParam function", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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
    const urlToAppend = "https://some-page.com/some-path?example=123";
    const result = contactUsUrl(baseUrl, urlToAppend);
    expect(result).toContain(
      "https://www.example.com?fromURL=https%253A%252F%252Fsome-page.com%252Fsome-path",
    );
  });

  it("should return null if baseUrl is undefined", () => {
    const urlToAppend = "/some-path";
    const result = contactUsUrl("", urlToAppend);
    expect(result).toBeNull();
  });
});

  describe("setBaseTranslations", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should add resource bundles for "cy" and "en" locales', () => {
      const mockI18n = {
        addResourceBundle: vi.fn(),
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
        addResourceBundle: vi.fn(),
      } as unknown as typeof i18next;

      readFileSyncMock.mockImplementationOnce(() => {
        throw new Error("File not found");
      });

      expect(() => setBaseTranslations(mockI18n)).not.toThrow();
      expect(mockI18n.addResourceBundle).toHaveBeenCalledTimes(2);
    });

    it("should use a custom file path if provided", () => {
      const mockI18n = {
        addResourceBundle: vi.fn(),
      } as unknown as typeof i18next;

      const customPath = "custom/path";
      existsSyncMock.mockImplementation((filePath) => {
        return filePath === path.resolve(customPath, "cy", "translation.json");
      });
      readFileSyncMock.mockImplementation(() =>
        JSON.stringify({ key: "value" }),
      );

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
    });
});

describe("getTranslationObject", () => {
    const mockFileContent = JSON.stringify({ key: "value" });

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should return the parsed content of the first existing translation file", () => {
      existsSyncMock.mockImplementationOnce((filePath) => {
        return filePath === path.resolve("locales", "en", "translation.json");
      });
      readFileSyncMock.mockImplementation(() => mockFileContent);

      const result = getTranslationObject("en");

      expect(result).toEqual({ key: "value" });
      expect(existsSyncMock).toHaveBeenCalledWith(
        path.resolve("locales", "en", "translation.json"),
      );
      expect(fs.readFileSync).toHaveBeenCalledWith(
        path.resolve("locales", "en", "translation.json"),
        "utf8",
      );
    });

    it("should try multiple paths and return the parsed content of the first valid file", () => {
      existsSyncMock.mockImplementation((filePath) => {
        return (
          filePath === path.resolve("src/locales", "en", "translation.json")
        );
      });
      readFileSyncMock.mockImplementation(() => {
        return mockFileContent;
      });

      const result = getTranslationObject("en");

      expect(result).toEqual({ key: "value" });
      expect(existsSyncMock).toHaveBeenCalledWith(
        path.resolve("locales", "en", "translation.json"),
      );
      expect(existsSyncMock).toHaveBeenCalledWith(
        path.resolve("src/locales", "en", "translation.json"),
      );
      expect(fs.readFileSync).toHaveBeenCalledWith(
        path.resolve("src/locales", "en", "translation.json"),
        "utf8",
      );
    });

    it("should handle a custom file path if provided", () => {
      const customPath = "custom/path";
      existsSyncMock.mockImplementation((filePath) => {
        return filePath === path.resolve(customPath, "en", "translation.json");
      });
      readFileSyncMock.mockImplementation(() => mockFileContent);

      const result = getTranslationObject("en", customPath);

      expect(result).toEqual({ key: "value" });
      expect(existsSyncMock).toHaveBeenCalledWith(
        path.resolve(customPath, "en", "translation.json"),
      );
      expect(fs.readFileSync).toHaveBeenCalledWith(
        path.resolve(customPath, "en", "translation.json"),
        "utf8",
      );
    });

    it("should return an empty object if no translation file is found", () => {
      existsSyncMock.mockReturnValue(false);

      const result = getTranslationObject("en");

      expect(result).toEqual({});
      expect(existsSyncMock).toHaveBeenCalledTimes(3);
    });

    it("should log an error if reading or parsing the file fails", () => {
      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockImplementation(() => {
        throw new Error("File read error");
      });

      const result = getTranslationObject("en");

      expect(result).toEqual({});
      expect(mockLogger).toHaveBeenCalled();
    });

    it("should log a warning if no translation file is found", () => {
      existsSyncMock.mockReturnValue(false);

      getTranslationObject("en");

      expect(mockLogger).toHaveBeenCalled();
    });
});

describe("validateTranslations", () => {
  beforeEach(() => {
    mockLogger.mockClear();
  });

  afterEach(() => {
    vi.resetAllMocks();
    mockLogger.mockClear();
  });

  it("does not warn when cy matches en", () => {
    validateTranslations({ a: "1", b: { c: "2" } }, { a: "1", b: { c: "2" } });
    expect(mockLogger).not.toHaveBeenCalled();
  });

  it("warns when a key is missing in cy", () => {
    validateTranslations({ a: "1", b: "2" }, { a: "1" });
    expect(mockLogger).toHaveBeenCalledTimes(1);
  });

  it("warns when a key is missing in en", () => {
    validateTranslations({ a: "1" }, { a: "1", b: "2" });
    expect(mockLogger).toHaveBeenCalledTimes(1);
  });

  it("warns for a missing nested key in cy", () => {
    validateTranslations({ a: { b: { c: "1" } } }, { a: { b: {} } });
    expect(mockLogger).toHaveBeenCalledTimes(1);
  });

  it("warns when array lengths differ", () => {
    validateTranslations({ a: ["1", "2"] }, { a: ["1"] });
    expect(mockLogger).toHaveBeenCalledTimes(1);
  });

  it("warns for a missing key inside an array item", () => {
    validateTranslations(
      { steps: [{ title: "Step 1", description: "Desc" }] },
      { steps: [{ title: "Step 1" }] },
    );
    expect(mockLogger).toHaveBeenCalledTimes(1);
  });

  it("warns when cy array is longer than en array", () => {
    validateTranslations({ a: ["1"] }, { a: ["1", "2"] });
    expect(mockLogger).toHaveBeenCalledTimes(1);
  });
});

describe("warnCharacterLimit", () => {
  beforeEach(() => {
    mockLogger.mockClear();
  });

  afterEach(() => {
    mockLogger.mockClear();
  });

  it("does nothing if text length is within character limit", () => {
    warnCharacterLimit("This is a short string", 30);
    expect(mockLogger).not.toHaveBeenCalled();
  });
  it("warns when text exceeds character limit", () => {
    warnCharacterLimit("This is a longer string than the max length", 30);
    expect(mockLogger).toHaveBeenCalled();
  });
});

describe("addFrontendUiGlobals", () => {
  it("registers all globals", () => {
    const addGlobal = vi.fn();
    addFrontendUiGlobals({ addGlobal });
    expect(addGlobal).toHaveBeenCalledWith(
      "addLanguageParam",
      expect.any(Function),
    );
    expect(addGlobal).toHaveBeenCalledWith(
      "contactUsUrl",
      expect.any(Function),
    );
    expect(addGlobal).toHaveBeenCalledWith("warnCharacterLimit", expect.any(Function));
    expect(addGlobal).toHaveBeenCalledTimes(3);
  });
});
