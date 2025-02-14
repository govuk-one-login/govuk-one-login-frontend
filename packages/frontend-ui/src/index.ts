import i18next from "i18next";
import translationCookieBannerCy from "../components/cookie-banner/locales/cy/translation.json";
import translationCookieBannerEn from "../components/cookie-banner/locales/en/translation.json";

export const setFrontendUiTranslations = (instanceI18n: typeof i18next) => {
  instanceI18n.addResourceBundle("en", "translation", translationCookieBannerEn, true, false);
  instanceI18n.addResourceBundle("cy", "translation", translationCookieBannerCy, true, false);
};

export const getFrontendUiTranslations = (instanceI18n: typeof i18next, language: string) => {
  return instanceI18n.getResourceBundle(language, "translation");
};

// export const frontendUiMiddleware = (instanceI18n: typeof i18next, req: { language: string; }, res: { locals: { translations: unknown; }; }, next: () => void) => {
//   console.log(req);
//   // const language = req.language || "en";
//   // res.locals.translations = getFrontendUiTranslations(instanceI18n, language); 
//   next();
// };
