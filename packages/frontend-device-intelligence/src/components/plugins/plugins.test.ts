import { getInstalledPlugins } from "./plugins";

describe("getInstalledPlugins", () => {
  const originalNavigator = global.navigator;

  afterEach(() => {
    global.navigator = originalNavigator;
  });

  it("returns an empty array when there are no plugins", async () => {
    const result = await getInstalledPlugins();
    expect(result).toEqual({ plugins: [] });
  });

  it("should return a list of installed plugins", async () => {
    const mockPlugins = [
      {
        name: "Plugin 1",
        filename: "plugin1.dll",
        description: "This is plugin 1",
      },
      {
        name: "Plugin 2",
        filename: "plugin2.so",
        description: "This is plugin 2",
      },
    ];

    Object.defineProperty(window.navigator, "plugins", {
      value: mockPlugins,
      writable: true,
    });

    const result = await getInstalledPlugins();
    expect(result.plugins).toEqual([
      "Plugin 1|plugin1.dll|This is plugin 1",
      "Plugin 2|plugin2.so|This is plugin 2",
    ]);
  });
});
