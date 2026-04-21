import logger from "../../logger";
import {
  hasApplePay,
  hasSupportForApplePayVersion,
  isHTTPS,
} from "../../utils/windowTools";
import { ComponentInterface } from "../index";
import { getBrowser } from "./browser";

export function getSystemDetails(): Promise<ComponentInterface> {
  return new Promise((resolve) => {
    const browser = getBrowser();
    resolve({
      platform: window.navigator.platform,
      cookieEnabled: window.navigator.cookieEnabled,
      productSub: navigator.productSub,
      product: navigator.product,
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
