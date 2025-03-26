import path from "path";
import nunjucks from "nunjucks";
import { render } from "../../test/jestHelper";

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
  const mockParams = {
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

  it("renders the class from params", () => {
    const renderedComponent = render("languageSelect", mockParams);
    const renderedNavElement = renderedComponent.getElementsByTagName("nav")[0];
    expect(renderedNavElement.getAttribute("class")).toContain("test-class");
  });

  it("renders the aria-label from params", () => {
    const renderedComponent = render("languageSelect", mockParams);
    const renderedNavElement = renderedComponent.getElementsByTagName("nav")[0];
    expect(renderedNavElement.getAttribute("aria-label")).toBe("test-aria");
  });

  describe("renders active language as a span, and inactive language as a link", () => {
    it("displays cy active language as a span, and inactive language as a link", () => {
      const mockParams = {
        ariaLabel: "test-aria",
        url: "http://localhost:3000/",
        activeLanguage: "cy",
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

      const renderedComponent = render("languageSelect", mockParams);

      // test span
      const renderedSpan = renderedComponent.getElementsByTagName("span")[0];
      expect(renderedSpan.textContent).toBe("Cymraeg");

      // test visually hidden
      const renderedVisuallyHidden = renderedComponent.getElementsByClassName(
        "govuk-visually-hidden",
      )[0];
      expect(renderedVisuallyHidden.textContent).toBe("Change to English");

      // test link
      const renderedLink =
        renderedComponent.getElementsByClassName("govuk-link")[0];
      expect(renderedLink.tagName.toLocaleLowerCase()).toEqual("a");
      expect(renderedLink.getAttribute("target")).toEqual(null);
      expect(renderedLink.getAttribute("href")).toContain("?lng=en");
      expect(renderedLink.getAttribute("class")).toContain(
        "govuk-link govuk-link--no-visited-state",
      );
    });

    it("displays en as active language as a span, and inactive language as a link", () => {
      const renderedComponent = render("languageSelect", mockParams);

      // test span
      const renderedSpan = renderedComponent.getElementsByTagName("span")[0];
      expect(renderedSpan.textContent).toBe("English");

      // test visually hidden
      const renderedVisuallyHidden = renderedComponent.getElementsByClassName(
        "govuk-visually-hidden",
      )[0];
      expect(renderedVisuallyHidden.textContent).toBe(
        "Newid yr iaith ir Gymraeg",
      );

      // test link
      const renderedLink =
        renderedComponent.getElementsByClassName("govuk-link")[0];
      expect(renderedLink.tagName.toLocaleLowerCase()).toEqual("a");
      expect(renderedLink.getAttribute("target")).toEqual(null);
      expect(renderedLink.getAttribute("href")).toContain("?lng=cy");
      expect(renderedLink.getAttribute("class")).toContain(
        "govuk-link govuk-link--no-visited-state",
      );
    });
  });
});
