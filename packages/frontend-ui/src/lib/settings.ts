import type {Express} from 'express';

interface SetGTM{
  app: Express,
  ga4ContainerId : string,
  analyticsCookieDomain :string,
  ga4Enabled: boolean,
  ga4PageViewEnabled: boolean,
  ga4FormResponseEnabled: boolean,
  ga4FormErrorEnabled: boolean,
  ga4FormChangeEnabled: boolean,
  ga4NavigationEnabled: boolean,
  ga4SelectContentEnabled: boolean,
  analyticsDataSensitive: boolean
}

export default {
  setGTM: ({
    app,
    ga4ContainerId,
    analyticsCookieDomain,
    ga4Enabled,
    ga4PageViewEnabled,
    ga4FormResponseEnabled,
    ga4FormErrorEnabled,
    ga4FormChangeEnabled,
    ga4NavigationEnabled,
    ga4SelectContentEnabled,
    analyticsDataSensitive,
  }:SetGTM) => {
    app.set("APP.GTM.GA4_CONTAINER_ID", ga4ContainerId);
    app.set("APP.GTM.ANALYTICS_COOKIE_DOMAIN", analyticsCookieDomain);
    app.set("APP.GTM.GA4_ENABLED", ga4Enabled);
    app.set("APP.GTM.GA4_PAGE_VIEW_ENABLED", ga4PageViewEnabled);
    app.set("APP.GTM.GA4_FORM_RESPONSE_ENABLED", ga4FormResponseEnabled);
    app.set("APP.GTM.GA4_FORM_ERROR_ENABLED", ga4FormErrorEnabled);
    app.set("APP.GTM.GA4_FORM_CHANGE_ENABLED", ga4FormChangeEnabled);
    app.set("APP.GTM.GA4_NAVIGATION_ENABLED", ga4NavigationEnabled);
    app.set("APP.GTM.GA4_SELECT_CONTENT_ENABLED", ga4SelectContentEnabled);
    app.set("APP.GTM.ANALYTICS_DATA_SENSITIVE", analyticsDataSensitive ?? true);
  },

  setLanguageToggle: ({ app, showLanguageToggle }:{app:Express, showLanguageToggle:boolean}) => {
    app.set("APP.LANGUAGE_TOGGLE_ENABLED", showLanguageToggle);
  },
};
