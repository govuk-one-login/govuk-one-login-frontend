import i18next from "i18next";
import { frontendUiMiddleware, setFrontendUiTranslations } from "..";

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
