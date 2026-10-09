import path from "node:path";
import nunjucks from "nunjucks";
import { axe } from "vitest-axe";
import * as matchers from "vitest-axe/matchers";
import { render } from "../../test/testHelper";

expect.extend(matchers);

const nunjucksEnv = nunjucks.configure(
  path.dirname("frontend-language-toggle"),
  {
    autoescape: true,
  },
);

nunjucksEnv.addGlobal(
  "addLanguageParam",
  vi.fn((language) => `/?lng=${language}`),
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
