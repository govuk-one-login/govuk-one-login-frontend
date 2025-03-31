import { getBrowser } from "./browser";

describe("getBrowser", () => {
  const originalNavigator = global.navigator;

  afterEach(() => {
    global.navigator = originalNavigator;
  });

  test('return "unknown" when navigator equals to undefined', () => {
    delete (global as unknown as { navigator?: Navigator }).navigator;

    const result = getBrowser();
    expect(result).toEqual({ name: "unknown", version: "unknown" });
  });

  test("uses Edge browser", () => {
    (global as unknown as { navigator: Navigator }).navigator = {
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edg/91.0.864.59 Safari/537.36",
    } as Navigator;

    const result = getBrowser();
    expect(result).toEqual({ name: "Edge", version: "91.0" });
  });

  test("uses Chrome browser", () => {
    (global as unknown as { navigator: Navigator }).navigator = {
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
    } as Navigator;

    const result = getBrowser();
    expect(result).toEqual({ name: "Chrome", version: "112.0" });
  });

  test("uses Firefox browser", () => {
    (global as unknown as { navigator: Navigator }).navigator = {
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0",
    } as Navigator;

    const result = getBrowser();
    expect(result).toEqual({ name: "Firefox", version: "102.0" });
  });
});
