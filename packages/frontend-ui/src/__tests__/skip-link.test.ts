import { render } from "../test/testHelper";
import { expectComponentToHaveNoAxeViolations } from "./components/helpers";

describe("skipLink Component", () => {
  const mockTranslations = {
    title: "Skip to main content",
  };

  it("has no accessibility violations", async () => {
    const renderedComponent = render("skip-link", "frontendUiSkipLink", {
      translations: mockTranslations,
    });
    await expectComponentToHaveNoAxeViolations(renderedComponent);
  });
});
