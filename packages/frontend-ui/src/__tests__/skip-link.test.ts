/**
 * @jest-environment jsdom
 */

import { axe, toHaveNoViolations } from "jest-axe";
import { render } from "../../test/jestHelper";
expect.extend(toHaveNoViolations);

describe("skipLink Component", () => {
  const mockParams = {
    translations: {
      title: "Skip to main content",
    },
  };

  it("has no accessibility violations", async () => {
    const renderedComponent = render("skip-link", "frontendUiSkipLink", {
      params: mockParams,
    });
    const results = await axe(renderedComponent.documentElement.outerHTML);
    expect(results).toHaveNoViolations();
  });
});
