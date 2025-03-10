import i18next from "i18next";
import translationHeaderCy from "../components/header/locales/cy/translation.json";
import translationHeaderEn from "../components/header/locales/en/translation.json";
import translationCy from "../locales/cy/translation.json";
import translationEn from "../locales/en/translation.json";

export const setFrontendUiTranslations = (instanceI18n: typeof i18next) => {
  instanceI18n.addResourceBundle(
    "en",
    "translation",
    translationEn,
    true,
    false,
  );
  instanceI18n.addResourceBundle(
    "cy",
    "translation",
    translationCy,
    true,
    false,
  );
  instanceI18n.addResourceBundle(
    "en",
    "translation",
    translationHeaderEn,
    true,
    false,
  );
  instanceI18n.addResourceBundle(
    "cy",
    "translation",
    translationHeaderCy,
    true,
    false,
  );
};

export const frontendUiMiddleware = (
  req: {
    i18n: { language: string; store: { data: { [key: string]: unknown } } };
  },
  res: { locals: { translations: unknown } },
  next: () => void,
) => {
  res.locals.translations = req.i18n.store.data[req.i18n.language];
  next();
};
