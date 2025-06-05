/**
 * @jest-environment jsdom
 */

import { axe, toHaveNoViolations } from "jest-axe";
import { renderInline } from "../../test/jestHelper";
expect.extend(toHaveNoViolations);

describe("phaseBanner Component", () => {
  const mockParams = {
    translations: {
      tag: "Beta",
      text: "This is a new service – your feedback will help us to improve it.",
      link: "Give feedback",
    },
    url: "/current-page",
  };

  it("has no accessibility violations with minimal params", async () => {
    const template = `{% from "phase-banner/macro.njk" import govukPhaseBanner %}{{ govukPhaseBanner(params) }}`;
    const renderedComponent = renderInline(template, { params: mockParams });
    const results = await axe(renderedComponent.outerHTML);
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

    const template = `{% from "phase-banner/macro.njk" import govukPhaseBanner %}{{ govukPhaseBanner(params) }}`;
    const renderedComponent = renderInline(template, { params: allParams });
    const results = await axe(renderedComponent.outerHTML);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations with contactUrl param", async () => {
    const contactUrlOnlyParams = {
      ...mockParams,
      contactUrl: "https://example.com/feedback",
    };

    const template = `{% from "phase-banner/macro.njk" import govukPhaseBanner %}{{ govukPhaseBanner(params) }}`;
    const renderedComponent = renderInline(template, { params: contactUrlOnlyParams });
    const results = await axe(renderedComponent.outerHTML);
    expect(results).toHaveNoViolations();
  });
});