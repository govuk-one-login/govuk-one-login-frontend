import i18next from "i18next";
import {
  frontendUiMiddleware,
  setFrontendUiTranslations,
  addLanguageParam,
  contactUsUrl,
} from "..";

describe("frontendUiMiddleware", () => {
  describe("when the ui middleware is called", () => {
    it("should attach translations from the i18n store to locals", () => {
      const req = {
        i18n: {
          language: "en",
          store: { data: { en: { translationKey: "translationValue" } } },
        },
      };
      const res = { locals: { translations: {} } };
      frontendUiMiddleware(req, res, () => {});
      expect(res.locals.translations).toEqual({
        translationKey: "translationValue",
      });
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
});
