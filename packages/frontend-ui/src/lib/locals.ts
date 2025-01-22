import { Request, Response, NextFunction } from "express";
import { getLogger, CustomLogger, setCustomLogger } from "../utils/logger";

export default {
  getGTM: function (req: Request, res: Response, next: NextFunction) {
    res.locals.ga4ContainerId = req.app.get("APP.GTM.GA4_CONTAINER_ID");
    res.locals.uaContainerId = req.app.get("APP.GTM.UA_CONTAINER_ID");
    res.locals.analyticsCookieDomain = req.app.get(
      "APP.GTM.ANALYTICS_COOKIE_DOMAIN",
    );
    res.locals.ga4Enabled = req.app.get("APP.GTM.GA4_ENABLED");
    res.locals.uaEnabled = req.app.get("APP.GTM.UA_ENABLED");
    res.locals.analyticsDataSensitive = req.app.get(
      "APP.GTM.ANALYTICS_DATA_SENSITIVE",
    );
    res.locals.ga4PageViewEnabled = req.app.get(
      "APP.GTM.GA4_PAGE_VIEW_ENABLED",
    );
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
  },

  getAssetPath: function (req: Request, res: Response, next: NextFunction) {
    res.locals.assetPath = req.app.get("APP.ASSET_PATH");
    next();
  },

  getLanguageToggle: function (
    req: Request & { i18n: { language: string } },
    res: Response,
    next: NextFunction,
    customLogger?: CustomLogger,
  ) {
    if (customLogger) {
      setCustomLogger(customLogger);
    }
    const logger = getLogger();
    const toggleValue = req.app.get("APP.LANGUAGE_TOGGLE_ENABLED");
    res.locals.showLanguageToggle = toggleValue && toggleValue === "1";
    res.locals.htmlLang = req.i18n.language;
    try {
      res.locals.currentUrl = new URL(
        req.protocol + "://" + req.get("host") + req.originalUrl,
      );
    } catch (e: unknown) {
      if (e instanceof Error) {
        logger.warn("Error constructing url for language toggle", e.message);
      }
    }
    next();
  },
};
