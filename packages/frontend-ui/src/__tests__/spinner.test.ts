import { render } from "../test/testHelper";
import { expectComponentToHaveNoAxeViolations } from "./components/helpers";

describe("Spinner Component", () => {
  it("has no accessibility violations", async () => {
    const renderedComponent = render("spinner", "frontendUiSpinner", {});
    await expectComponentToHaveNoAxeViolations(renderedComponent, {
      wrapMain: false,
    });
  });
});
