import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import * as Cookie from "./cookie";
import { setLocalCookieVarMiddleware } from "./setCookieEnvVar";
import { acceptCookies, rejectCookies } from "../../test/utils";

window.DI = {
  analyticsGa4: { loadGtmScript: () => {}, cookie: { consent: true } },
};

const cookieDomain = "";

describe("initialise Cookie", () => {
  const instance = new Cookie.Cookie(cookieDomain);
  test("should hide the cookie banner if a cookie preference has been set", () => {
    jest.spyOn(Cookie.Cookie, "getCookie").mockReturnValue("true");
    jest.spyOn(Cookie, "hasConsentForAnalytics").mockReturnValue(true);
    jest.spyOn(instance, "hideElement").mockImplementation(() => {});
    instance.initialise();
    expect(instance.hideElement).toHaveBeenCalledWith(
      instance.cookieBannerContainer[0],
    );
  });
});

describe("handleAcceptClickEvent", () => {
  const event = new Event("click");
  const instance = new Cookie.Cookie(cookieDomain);

  test("should load GTM script", () => {
    jest.spyOn(window.DI.analyticsGa4, "loadGtmScript");
    instance.handleAcceptClickEvent(event);
    expect(window.DI.analyticsGa4.loadGtmScript).toHaveBeenCalled();
  });

  test("should load setBannerCookieConsent", () => {
    jest.spyOn(instance, "setBannerCookieConsent");
    instance.handleAcceptClickEvent(event);
    expect(instance.setBannerCookieConsent).toHaveBeenCalled();
  });
});

describe("handleRejectClickEvent", () => {
  const event = new Event("click");
  const instance = new Cookie.Cookie(cookieDomain);

  test("should load setBannerCookieConsent", () => {
    jest.spyOn(instance, "setBannerCookieConsent");
    instance.handleRejectClickEvent(event);
    expect(instance.setBannerCookieConsent).toHaveBeenCalled();
  });
});

describe("handleHideButtonClickEvent", () => {
  const event = new Event("click");
  const instance = new Cookie.Cookie(cookieDomain);

  test("should load hideElement", () => {
    jest.spyOn(instance, "hideElement");
    instance.handleHideButtonClickEvent(event);
    expect(instance.hideElement).toHaveBeenCalled();
  });
});

describe("handleHideButtonClickEvent", () => {
  const event = new Event("click");
  const instance = new Cookie.Cookie(cookieDomain);

  test("should load hideElement", () => {
    jest.spyOn(instance, "hideElement");
    instance.handleHideButtonClickEvent(event);
    expect(instance.hideElement).toHaveBeenCalled();
  });
});

describe("setBannerCookieConsent", () => {
  const instance = new Cookie.Cookie(cookieDomain);

  test("should load setCookie", () => {
    jest.spyOn(Cookie.Cookie, "setCookie");
    instance.setBannerCookieConsent(true, "localhost");
    expect(Cookie.Cookie.setCookie).toHaveBeenCalled();
  });

  test("should load hideElement", () => {
    jest.spyOn(instance, "hideElement");
    instance.cookieBanner = document.createElement("div");
    instance.setBannerCookieConsent(true, "localhost");
    expect(instance.hideElement).toHaveBeenCalled();
  });

  test("should load showElement with cookieAccepted if consent is true", () => {
    jest.spyOn(instance, "showElement");
    instance.cookiesAccepted = document.createElement("div");
    instance.setBannerCookieConsent(true, "localhost");
    expect(instance.showElement).toHaveBeenCalled();
  });

  test("should load showElement with cookiesRejected if consent is false", () => {
    jest.spyOn(instance, "showElement");
    instance.cookiesRejected = document.createElement("div");
    instance.setBannerCookieConsent(false, "localhost");
    expect(instance.showElement).toHaveBeenCalled();
  });
});

describe("getCookie", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("should return the value of the cookie if found", () => {
    document.cookie = "cookies_preferences_set=%7B%22analytics%22%3Afalse%7D";
    expect(Cookie.Cookie.getCookie("cookies_preferences_set")).toBe(
      "%7B%22analytics%22%3Afalse%7D",
    );
  });
});

describe("hasConsentForAnalytics", () => {
  test("should return true if consent is given", () => {
    document.cookie = "cookies_preferences_set=%7B%22analytics%22%3Atrue%7D";
    expect(Cookie.hasConsentForAnalytics()).toBe(true);
  });

  test("should return false if consent is not given", () => {
    document.cookie = "cookies_preferences_set=%7B%22analytics%22%3Afalse%7D";
    expect(Cookie.hasConsentForAnalytics()).toBe(false);
  });

  test("should return false if no cookie", () => {
    document.cookie = "";
    expect(Cookie.hasConsentForAnalytics()).toBe(false);
  });

  test("should load getCookie", () => {
    jest.spyOn(Cookie.Cookie, "getCookie");
    Cookie.hasConsentForAnalytics();
    expect(Cookie.Cookie.getCookie).toHaveBeenCalled();
  });
});

describe("hideElement", () => {
  test('should hide the element by setting its display property to "none"', () => {
    const instance = new Cookie.Cookie(cookieDomain);
    const element = document.createElement("div");
    instance.hideElement(element);
    expect(element.classList).toContain(instance.HIDDEN_CLASS);
  });
});

describe("showElement", () => {
  test('should show the element by setting its display property to "block"', () => {
    const instance = new Cookie.Cookie(cookieDomain);
    const element = document.createElement("div");
    instance.showElement(element);
    expect(element.classList).toContain(instance.SHOWN_CLASS);
  });
});

describe("setCookie", () => {
  test("should set the cookie", () => {
    const cookie = "cookies_preferences_set=%7B%22analytics%22%3Atrue%7D";
    const domain = "localhost";
    Cookie.Cookie.setCookie(
      "cookies_preferences_set",
      { analytics: true },
      domain,
      365,
    );
    expect(document.cookie).toBe(cookie);
  });
});

describe("Dynamic Cookie Domain Assignment", () => {
  interface MockResponse {
    locals: {
      [key: string]: string;
    };
  }

  let res: MockResponse;

  beforeEach(() => {
    res = { locals: {} };
  });

  test("should set the cookie domain with the value provided by target repo's env file", () => {
    setLocalCookieVarMiddleware(res);
    const instance = new Cookie.Cookie(res.locals.cookieDomain);

    // Expect the cookieDomain to be 'test_domain'
    expect(instance.cookieDomain).toBe("test_domain");
  });

  test("should set the cookie domain to default, if no middleware has been added in target repo to handle cookie domain assignment", () => {
    const instance = new Cookie.Cookie(cookieDomain);

    // Expect the cookieDomain to be 'account.gov.uk'
    expect(instance.cookieDomain).toBe("account.gov.uk");
  });
});

describe("Dynatrace Implementation", () => {
  const cookieDomain = "";

  let enableMock: jest.Mock;
  let disableMock: jest.Mock;

  beforeEach(() => {
    enableMock = jest.fn();
    disableMock = jest.fn();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    (window as unknown as { dtrum: any }).dtrum = {
      enable: enableMock,
      disable: disableMock,
    };
  });

  test("Dynatrace when consent is accepted", () => {
    acceptCookies();
    const instance = new Cookie.Cookie(cookieDomain);
    instance.initDynatrace();

    expect(enableMock).toHaveBeenCalledTimes(2);
    expect(disableMock).not.toHaveBeenCalled();
  });

  test("Dynatrace when consent is rejected", () => {
    rejectCookies();
    const instance = new Cookie.Cookie(cookieDomain);
    instance.initDynatrace();

    expect(disableMock).toHaveBeenCalledTimes(2);
    expect(enableMock).toHaveBeenCalledTimes(0);
  });
});
