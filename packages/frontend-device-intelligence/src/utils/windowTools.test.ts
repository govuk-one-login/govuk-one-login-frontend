import { hasApplePay } from "./windowTools";

class ApplePaySession {
  static supportsVersion(version: number): boolean {
    return version === 3;
  }
}

type ExtendedWindow = Window & {
  ApplePaySession?: ApplePaySession;
};

const extendedWindow: ExtendedWindow = window;

function mockApplePaySession(test: () => void, value?: ApplePaySession) {
  const originalApplePaySession = extendedWindow.ApplePaySession;
  extendedWindow.ApplePaySession = value;
  test();
  extendedWindow.ApplePaySession = originalApplePaySession;
}

describe("hasApplePay", () => {
  it("should return false when there is no apple pay session function", () => {
    mockApplePaySession(() => {
      expect(hasApplePay()).toBe(false);
    }, undefined);
  });

  it("should return true when there is an apple pay session", () => {
    mockApplePaySession(() => {
      expect(hasApplePay()).toBe(true);
    }, ApplePaySession);
  });
});
