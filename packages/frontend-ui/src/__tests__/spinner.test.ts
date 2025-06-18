/**
 * @jest-environment jsdom
 */

import { axe, toHaveNoViolations } from "jest-axe";
import { render } from "../test/jestHelper";
expect.extend(toHaveNoViolations);

describe("Spinner Component", () => {
  it("has no accessibility violations", async () => {
    const renderedComponent = render("spinner", "frontendUiSpinner", {});
    const results = await axe(renderedComponent.documentElement.outerHTML);
    expect(results).toHaveNoViolations();
  });
});
