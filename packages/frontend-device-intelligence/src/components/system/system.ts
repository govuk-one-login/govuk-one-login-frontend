import { ComponentInterface } from "../index";
import { getBrowser } from "./browser";

// eslint-disable-next-line
declare class ApplePaySession {
  constructor();
  static supportsVersion(version: number): boolean;
}

type ExtendedWindow = Window & {
  ApplePaySession?: typeof ApplePaySession;
};

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
  const extendedWindow: ExtendedWindow = window;
  if (
    window.location.protocol === "https:" &&
    typeof extendedWindow.ApplePaySession === "function"
  ) {
    try {
      const versionCheck = extendedWindow.ApplePaySession.supportsVersion;
      for (let i = 15; i > 0; i--) {
        if (versionCheck(i)) {
          return i;
        }
      }
      // eslint-disable-next-line
    } catch (error) {
      return 0;
    }
  }
  return 0;
}
