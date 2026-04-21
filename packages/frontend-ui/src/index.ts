import fs from "node:fs";
import path from "node:path";
import { NextFunction, Request, Response } from "express";
import i18next from "i18next";
import translationCy from "../locales/cy/translation.json";
import translationEn from "../locales/en/translation.json";
import { getLogger } from "./utils/logger";

export * from "./lib";

const logger = getLogger();

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
  next: NextFunction,
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

  if (process.env.CHECK_TRANSLATIONS_ENABLED) {
    validateTranslations(
      instanceI18n.getResourceBundle("en", "translation"),
      instanceI18n.getResourceBundle("cy", "translation"),
    );
  }
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


function isPlainObject(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}

function validateArrayItems(
  enArr: unknown[],
  cyArr: unknown[],
  fullPath: string,
): void {
  const longerArr = enArr.length >= cyArr.length ? enArr : cyArr;
  longerArr.forEach((_, i) => {
    const enItem = enArr[i];
    const cyItem = cyArr[i];
    if (isPlainObject(enItem) && isPlainObject(cyItem)) {
      validateTranslations(enItem, cyItem, `${fullPath}[${i}]`);
    }
  });
}

export function validateTranslations(
  en: Record<string, unknown>,
  cy: Record<string, unknown>,
  path = "",
): void {
  const allKeys = new Set([...Object.keys(en), ...Object.keys(cy)]);
  for (const key of allKeys) {
    const fullPath = path ? `${path}.${key}` : key;
    if (!(key in en)) {
      logger.warn(`Translation key exists in cy but is missing in en: ${fullPath}`);
      continue;
    }
    if (!(key in cy)) {
      logger.warn(`Translation key exists in en but is missing in cy: ${fullPath}`);
      continue;
    }
    if (Array.isArray(en[key]) || Array.isArray(cy[key])) {
      const enArr = en[key] as unknown[];
      const cyArr = cy[key] as unknown[];
      if (enArr.length !== cyArr.length) {
        logger.warn(
          `Array length mismatch at: ${fullPath} - en has ${enArr.length} items, cy has ${cyArr.length} items`,
        );
      }
      validateArrayItems(enArr, cyArr, fullPath);
    } else if (isPlainObject(en[key]) && isPlainObject(cy[key])) {
      validateTranslations(en[key], cy[key], fullPath);
    }
  }
}

export function warnCharacterLimit(text: string, limit: number) {
  if (text.length > limit) {
    logger.warn(
      `Text content exceeds character limit of ${limit} characters: "${text.slice(0, 30)}..."`,
    );
  }
}

export function addFrontendUiGlobals(nunjucksEnv: {
  addGlobal: (name: string, value: unknown) => void;
}) {
  nunjucksEnv.addGlobal("addLanguageParam", addLanguageParam);
  nunjucksEnv.addGlobal("contactUsUrl", contactUsUrl);
  nunjucksEnv.addGlobal("warnCharacterLimit", warnCharacterLimit);
}

export function addLanguageParam(language: string, url?: URL) {
  if (!url) {
    logger.warn(
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
    newUrl.search = ""; // Remove the query parameters

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
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileContent);
      } catch {
        logger.warn(
          `Error reading or parsing translation file at ${filePath}:`,
        );
      }
    }
  }

  logger.warn(`No translation file found for locale: ${locale}`);
  return {}; // Return an empty object as a fallback
};

export { default as frontendUiTranslationEn } from "../locales/en/translation.json";
export { default as frontendUiTranslationCy } from "../locales/cy/translation.json";
