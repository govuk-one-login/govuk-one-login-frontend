import logger from "../../logger";
import {
  hasApplePay,
  hasSupportForApplePayVersion,
  isHTTPS,
} from "../../utils/windowTools";
import { ComponentInterface } from "../index";
import { getBrowser } from "./browser";

interface LegacyNavigator {
  platform: string;
  productSub: string;
  product: string;
}

export function getSystemDetails(): Promise<ComponentInterface> {
  return new Promise((resolve) => {
    const browser = getBrowser();
    const nav = navigator as unknown as LegacyNavigator;
    resolve({
      platform: nav.platform,
      cookieEnabled: window.navigator.cookieEnabled,
      productSub: nav.productSub,
      product: nav.product,
      useragent: navigator.userAgent,
      hardwareConcurrency: navigator.hardwareConcurrency,
      browser: { name: browser.name, version: browser.version },
      applePayVersion: getApplePayVersion(),
    });
  });
}

/**
 * @returns applePayCanMakePayments: boolean, applePayMaxSupportedVersion: number
 */
function getApplePayVersion(): number {
  if (isHTTPS() && hasApplePay()) {
    try {
      for (let i = 20; i > 0; i--) {
        if (hasSupportForApplePayVersion(i)) {
          return i;
        }
      }
      // eslint-disable-next-line
    } catch (error) {
      logger.error("No supported version available for the payment method");
      return 0;
    }
  }
  return 0;
}
