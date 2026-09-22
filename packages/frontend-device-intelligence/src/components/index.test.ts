const mockGetBrowser = vi.hoisted(() =>
  vi.fn(() => ({ name: "Chrome", version: "112.0" })),
);

vi.mock("./system/browser", () => ({
  getBrowser: mockGetBrowser,
}));

vi.mock("./fonts/fonts", () => ({
  getFontMetrics: vi.fn(async () => ({ fontHash: "mock-font-hash" })),
}));

vi.mock("./hardware/hardware", () => ({
  getHardwareInfo: vi.fn(async () => ({ cores: 8 })),
}));

vi.mock("./locales/locales", () => ({
  getLocales: vi.fn(async () => ({ language: "en-GB" })),
}));

vi.mock("./permissions/permissions", () => ({
  getBrowserPermissions: vi.fn(async () => ({ notifications: "granted" })),
}));

vi.mock("./plugins/plugins", () => ({
  getInstalledPlugins: vi.fn(async () => ({ plugins: ["pdf"] })),
}));

vi.mock("./screen/screen", () => ({
  screenDetails: vi.fn(async () => ({ width: 1920 })),
}));

vi.mock("./system/system", () => ({
  getSystemDetails: vi.fn(async () => ({ platform: "MacIntel" })),
}));

describe("components", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  test("includes fonts component when browser is not Firefox", async () => {
    mockGetBrowser.mockReturnValue({ name: "Chrome", version: "112.0" });

    const { components } = await import("./index");

    expect(components.fonts).toBeDefined();
    expect(components.fonts).toEqual(expect.any(Function));
  });

  test("excludes fonts component when browser is Firefox", async () => {
    mockGetBrowser.mockReturnValue({ name: "Firefox", version: "102.0" });

    const { components } = await import("./index");

    expect(components.fonts).toBeUndefined();
  });

  test("always includes hardware, locales, permissions, plugins, screen, system", async () => {
    mockGetBrowser.mockReturnValue({ name: "Chrome", version: "112.0" });

    const { components } = await import("./index");

    expect(components.hardware).toBeDefined();
    expect(components.locales).toBeDefined();
    expect(components.permissions).toBeDefined();
    expect(components.plugins).toBeDefined();
    expect(components.screen).toBeDefined();
    expect(components.system).toBeDefined();
  });
});

describe("getComponentPromises", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  test("returns an object of promises from all registered components", async () => {
    mockGetBrowser.mockReturnValue({ name: "Chrome", version: "112.0" });

    const { getComponentPromises } = await import("./index");
    const promises = getComponentPromises();

    const results = await Promise.all(
      Object.entries(promises).map(async ([key, promise]) => [
        key,
        await promise,
      ]),
    );
    const resolved = Object.fromEntries(results);

    expect(resolved.hardware).toEqual({ cores: 8 });
    expect(resolved.locales).toEqual({ language: "en-GB" });
    expect(resolved.permissions).toEqual({ notifications: "granted" });
    expect(resolved.plugins).toEqual({ plugins: ["pdf"] });
    expect(resolved.screen).toEqual({ width: 1920 });
    expect(resolved.system).toEqual({ platform: "MacIntel" });
    expect(resolved.fonts).toEqual({ fontHash: "mock-font-hash" });
  });

  test("does not include fonts promise when browser is Firefox", async () => {
    mockGetBrowser.mockReturnValue({ name: "Firefox", version: "102.0" });

    const { getComponentPromises } = await import("./index");
    const promises = getComponentPromises();

    expect(promises.fonts).toBeUndefined();
    expect(promises.hardware).toBeDefined();
  });

  test("calls each component function", async () => {
    mockGetBrowser.mockReturnValue({ name: "Chrome", version: "112.0" });

    const { getComponentPromises } = await import("./index");
    const { getHardwareInfo } = await import("./hardware/hardware");
    const { getLocales } = await import("./locales/locales");
    const { getBrowserPermissions } = await import("./permissions/permissions");
    const { getInstalledPlugins } = await import("./plugins/plugins");
    const { screenDetails } = await import("./screen/screen");
    const { getSystemDetails } = await import("./system/system");
    const { getFontMetrics } = await import("./fonts/fonts");

    getComponentPromises();

    expect(getHardwareInfo).toHaveBeenCalled();
    expect(getLocales).toHaveBeenCalled();
    expect(getBrowserPermissions).toHaveBeenCalled();
    expect(getInstalledPlugins).toHaveBeenCalled();
    expect(screenDetails).toHaveBeenCalled();
    expect(getSystemDetails).toHaveBeenCalled();
    expect(getFontMetrics).toHaveBeenCalled();
  });
});
