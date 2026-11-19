import { render } from "../test/jestHelper";
import { expectComponentToHaveNoAxeViolations } from "./components/helpers";

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
    await expectComponentToHaveNoAxeViolations(renderedComponent);
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
    await expectComponentToHaveNoAxeViolations(renderedComponent);
  });
});
