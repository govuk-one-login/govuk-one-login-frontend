import { getByText } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { nunjucksEnv } from "../test/jestHelper";
import { JSDOM } from "jsdom";
import { initialiseProgressButtons } from "../../frontend-src/progress-button/progress-button";

describe("Progress Button", () => {
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
