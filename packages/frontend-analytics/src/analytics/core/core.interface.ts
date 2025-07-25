import { type LogLevelNames } from "loglevel";

export interface AppConfigInterface {
  ga4ContainerId: string;
  uaContainerId: string;
}

export interface OptionsInterface {
  enableGa4Tracking?: boolean;
  cookieDomain?: string;
  enableUaTracking?: boolean;
  isDataSensitive?: boolean;
  isPageDataSensitive?: boolean;
  enableFormChangeTracking?: boolean;
  enableFormErrorTracking?: boolean;
  enableFormResponseTracking?: boolean;
  enableNavigationTracking?: boolean;
  enablePageViewTracking?: boolean;
  enableSelectContentTracking?: boolean;
  logLevel?: LogLevelNames;
}
