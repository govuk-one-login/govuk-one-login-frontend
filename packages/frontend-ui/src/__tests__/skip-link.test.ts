/**
 * @jest-environment jsdom
 */

import { axe, toHaveNoViolations } from "jest-axe";
import { render } from "../test/jestHelper";
expect.extend(toHaveNoViolations);

describe("skipLink Component", () => {
  const mockTranslations = {
    title: "Skip to main content",
  };

  it("has no accessibility violations", async () => {
    const renderedComponent = render("skip-link", "frontendUiSkipLink", {
      translations: mockTranslations,
    });
    const results = await axe(renderedComponent.documentElement.outerHTML);
    expect(results).toHaveNoViolations();
  });
});
