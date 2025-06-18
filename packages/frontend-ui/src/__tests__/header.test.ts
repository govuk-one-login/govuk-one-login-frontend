/**
 * @jest-environment jsdom
 */

import { axe, toHaveNoViolations } from "jest-axe";
import { render } from "../test/jestHelper";
expect.extend(toHaveNoViolations);

describe("Header accessibility", () => {
  const mockParams = {
    homepageUrl: "https://www.gov.uk/",
    productName: "Test Service",
    serviceName: "Test Service",
    serviceUrl: "https://service.gov.uk",
    navigation: [
      { text: "Home", href: "/", active: true },
      { text: "About", href: "/about" },
    ],
    signOutLink: "/sign-out",
    translations: {
      signOut: "Sign out",
      ariaLabel: "Sign out of your account",
    },
  };

  it("has no accessibility violations", async () => {
    const renderedComponent = render("header", "frontendUiHeader", {
      params: mockParams,
    });
    const results = await axe(renderedComponent.documentElement.outerHTML);
    expect(results).toHaveNoViolations();
  });
});
