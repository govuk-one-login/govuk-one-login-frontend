import i18next from "i18next";
import translationCookieBannerCy from "../components/cookie-banner/locales/cy/translation.json";
import translationCookieBannerEn from "../components/cookie-banner/locales/en/translation.json";

export const setFrontendUiTranslations = (instanceI18n: typeof i18next) => {
  instanceI18n.addResourceBundle(
    "en",
    "translation",
    translationCookieBannerEn,
    true,
    false,
  );
  instanceI18n.addResourceBundle(
    "cy",
    "translation",
    translationCookieBannerCy,
    true,
    false,
  );
};

export const frontendUiMiddleware = (
  req: { i18n: { language: string, store: { data: { [key: string]: string} } } },
  res: { locals: { translations: unknown } },
  next: () => void,
) => {
  res.locals.translations = req.i18n.store.data[req.i18n.language];
  next();
};
