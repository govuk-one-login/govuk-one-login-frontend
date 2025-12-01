import { getByText } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { nunjucksEnv } from "../test/jestHelper";
import { JSDOM } from "jsdom";
import { initialiseProgressButtons } from "../../frontend-src/progress-button/progress-button";

describe("Progress Button", () => {
  /**
   * TODO: JSDOM doesn't implement the form handler accurately to how the browser actually works.
   * In the browser: if you immediately set the button status to disabled in the click handler then it prevents the form submission from happening.
   * In JSDOM: it will submit the form before the button gets disabled.
   * As a result we are missing a regression test that checks that the initial form submission does actually happen.
   * We should look at moving these tests to a real browser environment to give us better confidence.
   */

  test("Prevent double submission on button click", async () => {
    const output = nunjucksEnv.renderString(
      `
    {% from "frontend-ui/build/components/progress-button/macro.njk" import frontendUiProgressButton %}
    <div class="govuk-grid-row">
            <div class="govuk-grid-column-two-thirds">
                <h1 class="govuk-heading-l">Test Progress Button</h1>

                <form method="post" action="/api/test-submit-button" novalidate>
                    {{ frontendUiProgressButton({
                    translations: { text: "Continue", waitingText: "Wait", longWaitingText: "Still waiting..."},
                    errorPage: "/error"
                }) }}
                </form>
            </div>
        </div>`,
      {},
    );
    const dom = new JSDOM(output);
    const document = dom.window.document;

    const mock = jest.fn();

    document.querySelectorAll("form").forEach((form) => {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        mock();
      });
    });

    initialiseProgressButtons(document);
    getByText(document.body, "Continue").click();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    getByText(document.body, "Continue").click();

    expect(mock).toHaveBeenCalledTimes(1); // Ensure form submission handler was called only once
  });
});
