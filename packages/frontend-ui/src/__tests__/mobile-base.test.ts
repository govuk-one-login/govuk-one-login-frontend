import { getByText } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import { renderTemplate } from "../test/jestHelper";

expect.extend(toHaveNoViolations);

describe("Mobile base template", () => {
  describe("Notification banner", () => {
    it("hides when displayBanner is false", async () => {
      const renderedComponent = renderTemplate("mobile/mobile-base.njk", {
        displayBanner: false,
      });
      expect(
        renderedComponent.querySelectorAll(".govuk-notification-banner").length,
      ).toBe(0);
    });

    it("shows when displayBanner is true", async () => {
      const renderedComponent = renderTemplate("mobile/mobile-base.njk", {
        bannerMessage: "Hello World",
        displayBanner: true,
      });
      expect(
        renderedComponent.querySelectorAll(".govuk-notification-banner").length,
      ).toBe(1);
      expect(getByText(renderedComponent.body, "Hello World")).toBeVisible();
    });
  });

  describe("Mobile base accessibility", () => {
    it("has no accessibility violations", async () => {
      const renderedComponent = renderTemplate("mobile/mobile-base.njk", {
        displayBanner: false,
      });
      console.log(renderedComponent.documentElement.outerHTML);
      const results = await axe(renderedComponent.documentElement.outerHTML);
      expect(results).toHaveNoViolations();
    });
  });
});
