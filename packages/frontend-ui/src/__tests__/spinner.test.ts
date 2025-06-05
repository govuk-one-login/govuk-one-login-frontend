/**
 * @jest-environment jsdom
 */

import { axe, toHaveNoViolations } from "jest-axe";
import { renderInline } from "../../test/jestHelper";
expect.extend(toHaveNoViolations);

describe("Spinner Component", () => {
  it("has no accessibility violations", async () => {
    const template = `{% block content %}
        {% set url = "/api?processingTime=2" %}
        <div id="spinner-container" data-api-route="{{ url }}">
        </div>
        {% endblock %}`;

    const renderedComponent = renderInline(template, {});
    const results = await axe(renderedComponent.outerHTML);
    expect(results).toHaveNoViolations();
  });
});
