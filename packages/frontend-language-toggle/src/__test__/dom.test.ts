/**
 * @jest-environment jsdom
 */

import { axe, toHaveNoViolations } from "jest-axe";
import nunjucks from "nunjucks";
import path from "path";
import { render } from "../../test/jestHelper";
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

  it("has the appropriate accessibility testing", async () => {
    const renderedComponent = render("languageSelect", mockParams);

    const results = await axe(renderedComponent.documentElement.outerHTML);
    expect(results).toHaveNoViolations();
  });
});
