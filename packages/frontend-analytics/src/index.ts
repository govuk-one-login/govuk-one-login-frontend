import logger from "loglevel";
import {
  AppConfigInterface,
  OptionsInterface,
} from "./analytics/core/core.interface";
import { Analytics } from "./analytics/core/core";
import { applyDefaults } from "./utils/applyDefaults";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    DI: any;
  }
}

function appInit(
  settings: AppConfigInterface,
  options: OptionsInterface = {},
): boolean {
  const defaultedOptions = applyDefaults(options, {
    isDataSensitive: true,
    enableGa4Tracking: false,
    enableFormChangeTracking: true,
    enableFormErrorTracking: true,
    enableFormResponseTracking: true,
    enableNavigationTracking: true,
    enablePageViewTracking: true,
    enableSelectContentTracking: true,
  });

  try {
    window.DI.analyticsGa4 = new Analytics(
      settings.ga4ContainerId,
      defaultedOptions,
    );

    return true;
  } catch (err) {
    logger.error(err);
    return false;
  }
}

window.DI = window.DI || {};
window.DI.appInit = appInit;
