import { getByText } from "@testing-library/dom";
import { axe, toHaveNoViolations } from "jest-axe";
import { JSDOM } from "jsdom";
// @ts-ignore warning for non-rootDir import
import { initialiseProgressButtons } from "../../frontend-src/progress-button/progress-button";
// import "@testing-library/vi-dom";
import { nunjucksEnv } from "../test/jestHelper";

expect.extend(toHaveNoViolations);

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
    {% from "progress-button/macro.njk" import frontendUiProgressButton %}
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

    const mock = vi.fn();

    document.querySelectorAll("form").forEach((form) => {
      form.addEventListener("submit", (event) => {
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

  test.each([
    {
      name: "anchor variant",
      params: `{ href: "/next", translations: { text: "Continue", waitingText: "Wait", longWaitingText: "Still waiting...", noJavascriptMessage: "It can take up to 10 seconds to continue." }, errorPage: "/error" }`,
    },
    {
      name: "button variant",
      params: `{ translations: { text: "Continue", waitingText: "Wait", longWaitingText: "Still waiting...", noJavascriptMessage: "It can take up to 10 seconds to continue." }, errorPage: "/error" }`,
    },
  ])(
    "noscript message is CSP-safe (no inline style) and uses the namespaced class - $name",
    ({ params }) => {
      const output = nunjucksEnv.renderString(
        `
      {% from "progress-button/macro.njk" import frontendUiProgressButton %}
      {{ frontendUiProgressButton(${params}) }}`,
        {},
      );
      const dom = new JSDOM(output);
      const document = dom.window.document;

      // CSP-safe: no inline <style> element is rendered
      expect(document.querySelectorAll("style").length).toBe(0);

      // Old collision-prone class is gone
      expect(document.querySelector(".noscript")).toBeNull();

      // Namespaced box is present and still carries the message
      const box = document.querySelector(".govuk-button--progress-noscript");
      expect(box).not.toBeNull();
      expect(box?.classList.contains("govuk-body")).toBe(true);
      expect(box?.textContent?.trim()).toBe(
        "It can take up to 10 seconds to continue.",
      );
    },
  );

  it("has no accessibility violations", async () => {
    const output = nunjucksEnv.renderString(
      `
      {% from "progress-button/macro.njk" import frontendUiProgressButton %}
      <body>
        <main>
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
          </div>
        </main>
      </body>`,
      {},
    );
    const results = await axe(output);
    expect(results).toHaveNoViolations();
  });
});
