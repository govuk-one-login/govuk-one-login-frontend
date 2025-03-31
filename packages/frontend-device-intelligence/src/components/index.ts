import { getBrowser } from "./system/browser";

import { getFontMetrics } from "./fonts/fonts";
import { getHardwareInfo } from "./hardware/hardware";
import { getLocales } from "./locales/locales";
import { getBrowserPermissions } from "./permissions/permissions";
import { getInstalledPlugins } from "./plugins/plugins";
import { screenDetails } from "./screen/screen";
import { getSystemDetails } from "./system/system";

export interface ComponentInterface {
  [key: string]: string | string[] | number | boolean | ComponentInterface;
}

export const components: { [name: string]: () => Promise<ComponentInterface> } =
  {
    hardware: getHardwareInfo,
    locales: getLocales,
    permissions: getBrowserPermissions,
    plugins: getInstalledPlugins,
    screen: screenDetails,
    system: getSystemDetails,
  };
if (getBrowser().name != "Firefox") {
  components.fonts = getFontMetrics;
}

export const getComponentPromises = (): {
  [name: string]: Promise<ComponentInterface>;
} => {
  return Object.fromEntries(
    Object.entries(components).map(([key, value]) => [key, value()]),
  );
};
