import i18next from "i18next";
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

export function addLanguageParam(language: string, url?: URL) {
  if (!url) {
    console.warn(
      "URL is undefined. The parameter cannot be added, and the toggle will not work.",
    );
    return "#invalid-url-lang-toggle";
  }

  url.searchParams.set("lng", language);
  return url.pathname + url.search;
}

export function contactUsUrl(baseUrl: string, urlToAppend: string) {
  if (!baseUrl) {
    return null;
  }
  const searchParams = new URLSearchParams({ fromURL: urlToAppend });
  return `${baseUrl}?${searchParams.toString()}`;
}
