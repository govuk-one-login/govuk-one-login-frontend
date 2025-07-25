import i18next from "i18next";
import { NextFunction, Request, Response } from "express";
import translationCy from "../locales/cy/translation.json";
import translationEn from "../locales/en/translation.json";
import path from "path";
import { existsSync, readFileSync,  } from "fs";


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

// Overload signatures
export function frontendUiMiddleware(
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction,
): void;

export function frontendUiMiddleware(
  req: PlainRequest,
  res: PlainResponse,
  next: NextFunction,
): void;

// Implementation
export function frontendUiMiddleware(
  req: ExpressRequest | PlainRequest,
  res: ExpressResponse | PlainResponse,
  next: NextFunction
): void {
  res.locals.translations = req.i18n.store.data[req.i18n.language];
  res.locals.basePath = process.cwd();
    next();
}

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


export const frontendUiMiddlewareIdentityBypass = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  const localTranslations = {
    en: translationEn,
    cy: translationCy,
  };
  const language = req.i18n.language as keyof typeof localTranslations;
  res.locals.translations = localTranslations[language] || {};
  res.locals.basePath = process.cwd();
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

  try {
    const newUrl = new URL(urlToAppend); // Create a new URL object to modify
    newUrl.search = ''; // Remove the query parameters

    const encodedUrl = encodeURIComponent(newUrl.toString()); // Encode the entire URL

    const searchParams = new URLSearchParams({ fromURL: encodedUrl });
    return `${baseUrl}?${searchParams.toString()}`;
  } catch {
    const encodedUrlToAppend = encodeURIComponent(urlToAppend);
    const searchParams = new URLSearchParams({ fromURL: encodedUrlToAppend });
    return `${baseUrl}?${searchParams.toString()}`;
  }
}

export const setBaseTranslations = (
  instanceI18n: typeof i18next,
  filePath?: string,
) => {
  ["cy", "en"].forEach((locale) => {
    instanceI18n.addResourceBundle(
      locale,
      "translation",
      getTranslationObject(locale, filePath),
    );
  });
};

export const getTranslationObject = (
  locale: string,
  filepath?: string,
): Record<string, unknown> => {
  const possiblePaths = [
    path.resolve("locales", locale, "translation.json"),
    path.resolve("src/locales", locale, "translation.json"),
    path.resolve(filepath ?? "", locale, "translation.json"),
  ];

  for (const filePath of possiblePaths) {
    if (existsSync(filePath)) {
      try {
        const fileContent = readFileSync(filePath, "utf8");
        return JSON.parse(fileContent);
      } catch (error) {
        console.error(
          `Error reading or parsing translation file at ${filePath}:`,
          error,
        );
      }
    }
  }

  console.warn(`No translation file found for locale: ${locale}`);
  return {}; // Return an empty object as a fallback
};

export const frontendUiTranslationEn = translationEn;
export const frontendUiTranslationCy = translationCy;
