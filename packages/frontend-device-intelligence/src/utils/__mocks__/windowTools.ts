export const isHTTPS = vi.fn().mockReturnValue(true);

export const hasApplePay = vi.fn().mockReturnValue(true);

export const hasSupportForApplePayVersion = vi
  .fn()
  .mockImplementation((version) => version === 3);
