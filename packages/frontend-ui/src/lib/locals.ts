import {
  type CustomLogger,
  getLogger,
  setCustomLogger,
} from "@govuk-one-login/frontend-logger";
import debugLib from "debug";
import type { Application, NextFunction, Request, Response } from "express";
import nunjucks from "nunjucks";
import type { HmpoTranslateFn } from "./types";

const debug = debugLib("hmpo:components:locals");

const getGTM = (req: Request, res: Response, next: NextFunction): void => {
  res.locals.ga4ContainerId = req.app.get("APP.GTM.GA4_CONTAINER_ID");
  res.locals.analyticsCookieDomain = req.app.get(
    "APP.GTM.ANALYTICS_COOKIE_DOMAIN",
  );
  res.locals.ga4Enabled = req.app.get("APP.GTM.GA4_ENABLED");
  res.locals.analyticsDataSensitive = req.app.get(
    "APP.GTM.ANALYTICS_DATA_SENSITIVE",
  );
  res.locals.ga4PageViewEnabled = req.app.get("APP.GTM.GA4_PAGE_VIEW_ENABLED");
  res.locals.ga4FormResponseEnabled = req.app.get(
    "APP.GTM.GA4_FORM_RESPONSE_ENABLED",
  );
  res.locals.ga4FormErrorEnabled = req.app.get(
    "APP.GTM.GA4_FORM_ERROR_ENABLED",
  );
  res.locals.ga4FormChangeEnabled = req.app.get(
    "APP.GTM.GA4_FORM_CHANGE_ENABLED",
  );
  res.locals.ga4NavigationEnabled = req.app.get(
    "APP.GTM.GA4_NAVIGATION_ENABLED",
  );
  res.locals.ga4SelectContentEnabled = req.app.get(
    "APP.GTM.GA4_SELECT_CONTENT_ENABLED",
  );
  next();
};

const getAssetPath = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  res.locals.assetPath = req.app.get("APP.ASSET_PATH");
  next();
};

const getLanguageToggle = (
  req: Request & { i18n: { language: string } },
  res: Response,
  next: NextFunction,
  customLogger: CustomLogger | undefined = undefined,
): void => {
  if (customLogger) {
    setCustomLogger(customLogger);
  }
  const logger = getLogger();
  const toggleValue = req.app.get("APP.LANGUAGE_TOGGLE_ENABLED");
  res.locals.showLanguageToggle = toggleValue && toggleValue === true;
  res.locals.htmlLang = req.i18n.language;
  try {
    res.locals.currentUrl = new URL(
      `${req.protocol}://${req.get("host")}${req.originalUrl}`,
    );
  } catch (e: unknown) {
    if (e instanceof Error) {
      logger.warn(
        "Error constructing url for language toggle",
        e.message as unknown as undefined,
      );
    }
  }
  next();
};

const getDeviceIntelligence = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const toggleValue = req.app.get("APP.DEVICE_INTELLIGENCE_ENABLED");
  res.locals.deviceIntelligenceEnabled = toggleValue && toggleValue === true;
  res.locals.deviceIntelligenceDomain = req.app.get(
    "APP.DEVICE_INTELLIGENCE_DOMAIN",
  );
  next();
};

function middleware(
  app: Application,
  env: nunjucks.Environment,
  opts?: { noCache?: boolean },
) {
  const renderCache = new Map<string, nunjucks.Template>();

  opts =
    opts || (env as unknown as { opts?: { noCache?: boolean } }).opts || {};

  function renderString(
    value: string,
    context: Record<string, unknown>,
    path: string,
  ): string {
    value = String(value);
    if (value.indexOf("{{") === -1 && value.indexOf("{%") === -1) return value;
    let tmpl: nunjucks.Template;
    if (!opts!.noCache && renderCache.has(value)) {
      debug("get render cache item ", { path, value });
      tmpl = renderCache.get(value)!;
    } else {
      tmpl = new nunjucks.Template(
        value,
        env,
        `locale:${context.htmlLang as string}:${path}`,
      );
      if (!opts!.noCache) {
        renderCache.set(value, tmpl);
        debug("set render cache item ", {
          path,
          value,
          newSize: renderCache.size,
        });
      }
    }
    return tmpl.render(context);
  }

  function recursiveRender(
    value: unknown,
    context: Record<string, unknown>,
    path: string,
  ): unknown {
    if (Array.isArray(value)) {
      return value.map((item, index) =>
        recursiveRender(item, context, `${path}.${index}`),
      );
    }
    if (value && typeof value === "object") {
      const result: Record<string, unknown> = {};
      for (const key in value as object) {
        // biome-ignore lint: attempts to use hasOwn causing build issues
        if (value.hasOwnProperty(key)) {
          result[key] = recursiveRender(
            (value as Record<string, unknown>)[key],
            context,
            `${path}.${key}`,
          );
        }
      }
      return result;
    }
    return renderString(value as string, context, path);
  }

  return (req: Request, res: Response, next: NextFunction) => {
    Object.assign(res.locals, app.locals);
    res.locals.t = res.locals.translate = (
      key: string | string[],
      options: Record<string, unknown> = {},
    ) => {
      const reqWithT = req as Request & { t?: HmpoTranslateFn };
      const txt = reqWithT.t ? reqWithT.t(key, options) : key;
      if (!txt) return;
      if (options.noRender) return txt;
      return recursiveRender(
        txt,
        (options.context as Record<string, unknown>) || res.locals,
        String(key),
      );
    };
    res.locals.ctx = (key?: string) =>
      key
        ? key
            .split(".")
            .reduce(
              (a: unknown, k: string) => a && (a as Record<string, unknown>)[k],
              res.locals,
            )
        : res.locals;
    next();
  };
}

export {
  getAssetPath,
  getDeviceIntelligence,
  getGTM,
  getLanguageToggle,
  middleware,
};
