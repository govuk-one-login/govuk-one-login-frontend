export function isHTTPS() {
  return window.location.protocol === "https:";
}

type ApplePaySession = {
  supportsVersion(version: number): boolean;
};

type ExtendedWindow = Window & {
  ApplePaySession?: ApplePaySession;
};

export function hasApplePay() {
  const extendedWindow: ExtendedWindow = window;
  return typeof extendedWindow.ApplePaySession === "function";
}

export function hasSupportForApplePayVersion(version: number) {
  const extendedWindow: ExtendedWindow = window;
  return extendedWindow.ApplePaySession?.supportsVersion(version);
}
