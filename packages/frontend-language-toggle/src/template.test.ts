import nunjucks from "nunjucks";
import path from "path";
import { axe, toHaveNoViolations } from "jest-axe";
import render from "./utils/jestHelper";

expect.extend(toHaveNoViolations);

const nunjucksEnv = nunjucks.configure(
  path.dirname("frontend-language-toggle"),
  {
    autoescape: true,
  },
);

nunjucksEnv.addGlobal(
  "addLanguageParam",
  jest.fn((language) => `/?lng=${language}`),
);

describe("languageSelect Component", () => {
  let mockParams = {
    ariaLabel: "test-aria",
    url: "http://localhost:3000/",
    activeLanguage: "en",
    class: "test-class",
    languages: [
      {
        code: "en",
        text: "English",
        visuallyHidden: "Change to English",
      },
      {
        code: "cy",
        text: "Cymraeg",
        visuallyHidden: "Newid yr iaith ir Gymraeg",
      },
    ],
  };

  it("has the appropriate accessibility testing", async () => {
    const renderedComponent = render("languageSelect", mockParams);

    const results = await axe(renderedComponent.html());
    expect(results).toHaveNoViolations();
  });

  it("renders the class from params", () => {
    const renderedComponent = render("languageSelect", mockParams);
    const renderedNavElement = renderedComponent("nav");
    expect(renderedNavElement.attr("class")).toContain("test-class");
  });

  it("renders the aria-label from params", () => {
    const renderedComponent = render("languageSelect", mockParams);
    const renderedNavElement = renderedComponent("nav");
    expect(renderedNavElement.attr("aria-label")).toBe("test-aria");
  });

  describe("renders active language as a span, and inactive language as a link", () => {
    it("displays cy active language as a span, and inactive language as a link", () => {
      mockParams = {...mockParams, activeLanguage: "cy"}

      const renderedComponent = render("languageSelect", mockParams);

      // test span
      const renderedSpan = renderedComponent("span");
      expect(renderedSpan.text()).toBe("Cymraeg");

      // test visually hidden
      const renderedVisuallyHidden = renderedComponent(
        ".govuk-visually-hidden",
      );
      expect(renderedVisuallyHidden.text()).toBe("Change to English");

      // test link
      const renderedLink = renderedComponent(".govuk-link");
      expect(renderedLink.get(0)?.tagName).toEqual("a");
      expect(renderedLink.attr("target")).toEqual(undefined);
      expect(renderedLink.attr("href")).toContain("?lng=en");
      expect(renderedLink.attr("class")).toContain(
        "govuk-link govuk-link--no-visited-state",
      );
    });

    it("displays en as active language as a span, and inactive language as a link", () => {
      mockParams = {...mockParams, activeLanguage: "en"}
      const renderedComponent = render("languageSelect", mockParams);

      // test span
      const renderedSpan = renderedComponent("span").text();
      expect(renderedSpan).toBe("English");

      // test visually hidden
      const renderedVisuallyHidden = renderedComponent(
        ".govuk-visually-hidden",
      );
      expect(renderedVisuallyHidden.text()).toBe("Newid yr iaith ir Gymraeg");

      // test link
      const renderedLink = renderedComponent(".govuk-link");
      expect(renderedLink.get(0)?.tagName).toEqual("a");
      expect(renderedLink.attr("target")).toEqual(undefined);
      expect(renderedLink.attr("href")).toContain("?lng=cy");
      expect(renderedLink.attr("class")).toContain(
        "govuk-link govuk-link--no-visited-state",
      );
    });
  });
});
