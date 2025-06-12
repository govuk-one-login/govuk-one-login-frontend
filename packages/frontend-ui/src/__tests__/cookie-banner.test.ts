/**
 * @jest-environment jsdom
 */

import { axe, toHaveNoViolations } from "jest-axe";
import { render } from "../../test/jestHelper";

expect.extend(toHaveNoViolations);

describe("cookieBanner Component", () => {
  const mockParams = {
    activeLanguage: "en",
    translations: {
      ariaLabel: "Cookies",
      headingText: "Cookies on GOV.UK",
      body1: "We use some essential cookies to make this service work.",
      body2:
        "We’d like to set additional cookies to understand how you use GOV.UK, remember your settings and improve government services.",
      acceptAdditionalCookies: "Accept additional cookies",
      rejectAdditionalCookies: "Reject additional cookies",
      viewCookies: "View cookies",
      changeCookiePreferencesLink: "change your cookie settings",
      cookieBannerAccept: {
        body1: "You’ve accepted all cookies.",
        body2: "You can",
      },
      cookieBannerReject: {
        body1: "You’ve rejected all non-essential cookies.",
        body2: "You can",
      },
      hideCookieMessage: "Hide cookie message",
    },
  };

  it("has no accessibility violations", async () => {
    const renderedComponent = render(
      "cookie-banner",
      "frontendUiCookieBanner",
      { params: mockParams },
    );

    const results = await axe(renderedComponent.documentElement.outerHTML);
    expect(results).toHaveNoViolations();
  });
});
