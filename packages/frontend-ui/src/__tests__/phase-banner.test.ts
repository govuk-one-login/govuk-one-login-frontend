/**
 * @jest-environment jsdom
 */

import { axe, toHaveNoViolations } from "jest-axe";
import { render } from "../../test/jestHelper";
expect.extend(toHaveNoViolations);

describe("phaseBanner Component", () => {
  const mockParams = {
    tag: "Beta",
    text: "This is a new service – your feedback will help us to improve it.",
    link: "Give feedback",
    ariaLabel: "Release Phase Banner",
  };

  const mockUrl = {
    url: "/current-page",
  };

  it("has no accessibility violations", async () => {
    const renderedComponent = render("phase-banner", "frontendUiPhaseBanner", {
      translations: mockParams,
      url: mockUrl,
    });
    const results = await axe(renderedComponent.documentElement.outerHTML);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations with all params", async () => {
    const allParams = {
      ...mockParams,
      tag: {
        html: "Alpha",
        classes: "custom-tag-class",
      },
      classes: "custom-phase-banner-class",
      attributes: {
        "data-test": "phase-banner",
      },
      phaseBannerText: "Custom phase banner text.",
      contactUrl: "https://example.com/feedback",
    };

    const renderedComponent = render("phase-banner", "frontendUiPhaseBanner", {
      translations: mockParams,
      url: mockUrl,
    });
    const results = await axe(renderedComponent.documentElement.outerHTML);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations with contactUrl param", async () => {
    const contactUrlOnlyParams = {
      ...mockParams,
      contactUrl: "https://example.com/feedback",
    };

    const renderedComponent = render("phase-banner", "frontendUiPhaseBanner", {
      translations: contactUrlOnlyParams,
      url: mockUrl,
    });
    const results = await axe(renderedComponent.documentElement.outerHTML);
    expect(results).toHaveNoViolations();
  });
});
