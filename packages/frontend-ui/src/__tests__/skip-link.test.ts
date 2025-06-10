/**
 * @jest-environment jsdom
 */

import { axe, toHaveNoViolations } from "jest-axe";
import { render } from "../../test/jestHelper";
expect.extend(toHaveNoViolations);

describe("skipLink Component", () => {
  const mockParams = {
    translations: {
      title: "Skip to main content",
    },
  };

  it("has no accessibility violations", async () => {
    const template = `{% from "skip-link/macro.njk" import govukSkipLink %}
        {% set skipLink = params.translations %}
        {{ govukSkipLink({
        href: "#main-content",
        text: skipLink.title
        }) }}`;

    const renderedComponent = render(template, { params: mockParams });
    const results = await axe(renderedComponent.documentElement.outerHTML);
    expect(results).toHaveNoViolations();
  });
});
