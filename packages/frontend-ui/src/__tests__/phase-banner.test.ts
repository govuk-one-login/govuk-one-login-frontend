import { render } from "../test/jestHelper";
import { expectComponentToHaveNoAxeViolations } from "./components/helpers";

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
    await expectComponentToHaveNoAxeViolations(renderedComponent);
  });

  it("has no accessibility violations with all params", async () => {
    const renderedComponent = render("phase-banner", "frontendUiPhaseBanner", {
      translations: mockParams,
      url: mockUrl,
    });
    await expectComponentToHaveNoAxeViolations(renderedComponent);
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
    await expectComponentToHaveNoAxeViolations(renderedComponent);
  });
});
