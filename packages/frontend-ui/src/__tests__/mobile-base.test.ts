import { getByText } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import translations from "../../locales/en/translation.json";
import { nunjucksEnv, renderTemplate } from "../test/jestHelper";

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
    const originalTranslationStub = nunjucksEnv.getFilter("translate");

    // Override translation stub to ensure elements have text content
    beforeAll(() => {
      nunjucksEnv.addFilter("translate", (key: string) => key);
    });

    // replace translation stub
    afterAll(() => {
      nunjucksEnv.addFilter("translate", originalTranslationStub);
    });

    it("has no accessibility violations", async () => {
      const renderedComponent = renderTemplate("mobile/mobile-base.njk", {
        displayBanner: false,
        translations: { translation: translations },
      });
      const results = await axe(renderedComponent.documentElement.outerHTML);
      expect(results).toHaveNoViolations();
    });
  });
});
