import { render } from "../test/jestHelper";
import { expectComponentToHaveNoAxeViolations } from "./components/helpers";

describe("Spinner Component", () => {
  it("has no accessibility violations", async () => {
    const renderedComponent = render("spinner", "frontendUiSpinner", {});
    await expectComponentToHaveNoAxeViolations(renderedComponent, {
      wrapMain: false,
    });
  });
});
