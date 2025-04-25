import i18next from "i18next";
import { NextFunction, Request, Response } from "express";
import translationCy from "../locales/cy/translation.json";
import translationEn from "../locales/en/translation.json";
import path from "path";
import { readFileSync } from "fs";

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
  req: Request & {
    i18n: { language: string; store: { data: { [key: string]: unknown } } };
  },
  res: Response & { locals: { translations: unknown } },
  next: NextFunction
) => {
  res.locals.translations = req.i18n.store.data[req.i18n.language];
  next();
};

export const frontendUiMiddlewareIdentityBypass = (
  req: Request & {
    i18n: {
      language: "en" | "cy"
  }},
  res: Response & { locals: { translations: unknown } },
  next: NextFunction
) => {
    const localTranslations = {
    en: translationEn,
    cy: translationCy
  };
  res.locals.translations = localTranslations[req.i18n.language];
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

export const setBaseTranslations = (instanceI18n: typeof i18next) => {
  instanceI18n.addResourceBundle(
    'cy',
    "translation",
    getTranslationObject('cy')
  );
  instanceI18n.addResourceBundle(
    'en',
    "translation",
    getTranslationObject('en')
  );
};

export const getTranslationObject = (locale: string): Record<string, unknown> => {
  const translations = JSON.parse(
    readFileSync(
      path.resolve("locales", locale, "translation.json"), // Resolve path from the root
      "utf8"
    )
  );
  return {
    ...translations,
  };
};


