// @vitest-environment node

import type * as filtersModule from "../../lib/filters";
import type * as globalsModule from "../../lib/globals";

vi.mock("../../lib/globals", async (importOriginal) => {
  const original = await importOriginal<typeof globalsModule>();
  return {
    globals: { ...original.globals, addGlobals: original.addGlobals },
  };
});

vi.mock("../../lib/filters", async (importOriginal) => {
  const original = await importOriginal<typeof filtersModule>();
  return {
    filters: { ...original.filters, addFilters: original.addFilters },
  };
});

import { cleanHtml, render } from "../helpers";
import { expectComponentToHaveNoAxeViolations } from "./helpers";

describe("hmpoWarningText", () => {
  it("renders with text", async () => {
    const $ = render({
      component: "warningText",
      params: { text: "my text <br>" },
    });

    const $component = $("strong");
    expect(cleanHtml($component)).toEqual(
      '<span class="govuk-visually-hidden">Warning</span>my text &lt;br&gt;',
    );

    await expectComponentToHaveNoAxeViolations($.html());
  });

  it("renders with html", async () => {
    const $ = render({
      component: "warningText",
      params: { html: "my text <br>" },
    });

    const $component = $("strong");
    expect(cleanHtml($component)).toEqual(
      '<span class="govuk-visually-hidden">Warning</span>my text <br>',
    );

    await expectComponentToHaveNoAxeViolations($.html());
  });

  it("renders with caller", async () => {
    const $ = render({
      component: "warningText",
      params: { html: "my text <br>" },
      caller: "<br>caller text<br>",
    });

    const $component = $("strong");
    expect(cleanHtml($component)).toEqual(
      '<span class="govuk-visually-hidden">Warning</span><br>caller text<br>',
    );

    await expectComponentToHaveNoAxeViolations($.html());
  });
});
