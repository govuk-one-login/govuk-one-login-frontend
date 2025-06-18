/**
 * @jest-environment jsdom
 */
import { axe, toHaveNoViolations } from "jest-axe";
import { render } from "../test/jestHelper";
expect.extend(toHaveNoViolations);

describe("languageSelect Component", () => {
  const mockParams = {
    activeLanguage: "en",
    url: "/current-page",
    translations: {
      ariaLabel: "Change language",
    },
    languages: [
      { code: "en", text: "English", visuallyHidden: "Change to English" },
      {
        code: "cy",
        text: "Cymraeg",
        visuallyHidden: "Newid yr iaith ir Gymraeg",
      },
    ],
  };

  it("has no accessibility violations", async () => {
    const renderedComponent = render(
      "language-select",
      "frontendUiLanguageSelect",
      { params: mockParams },
    );
    const results = await axe(renderedComponent.documentElement.outerHTML);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when only translations are provided", async () => {
    const mockParamsWithTranslations = {
      activeLanguage: "en",
      url: "/current-page",
      translations: {
        ariaLabel: "Change language",
      },
    };
    const renderedComponent = render(
      "language-select",
      "frontendUiLanguageSelect",
      {
        params: mockParamsWithTranslations,
      },
    );
    const results = await axe(renderedComponent.documentElement.outerHTML);
    expect(results).toHaveNoViolations();
  });
});
