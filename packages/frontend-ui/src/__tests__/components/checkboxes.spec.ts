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

import { cleanHtml, render, renderWithLocale } from "../helpers";

describe("hmpoCheckboxes", () => {
  let locals: {
    options: {
      fields: Record<string, { items?: unknown[]; validate?: string }>;
    };
    values: Record<string, unknown>;
  };

  beforeEach(() => {
    locals = {
      options: {
        fields: {
          "my-input": {
            items: ["a", "b", "c"],
          },
        },
      },
      values: {
        "my-input": ["a", "c"],
      },
    };
  });

  it("renders with id", () => {
    const $ = render(
      { component: "checkboxes", params: { id: "my-input" }, ctx: true },
      locals,
    );
    const $component = $(".govuk-fieldset");
    expect($component.attr("id")).toEqual("my-input-fieldset");
  });

  it("renders single checkbox with id", () => {
    locals = {
      options: {
        fields: {
          "my-input": {
            validate: "required",
          },
        },
      },
      values: {
        "my-input": true,
      },
    };
    const $ = render(
      { component: "checkboxes", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $component = $(".govuk-checkboxes__input");
    expect($component.attr("name")).toEqual("my-input");
    expect($component.attr("value")).toEqual("true");
    expect($component.attr("id")).toEqual("my-input");
    expect($component.attr("checked")).toEqual("checked");
    const $componentlabel = $(".govuk-checkboxes__label");
    expect($componentlabel.text().trim()).toEqual("[fields.my-input.label]");
    expect($componentlabel.attr("id")).toEqual("my-input-label");
    const $legend = $(".govuk-fieldset__legend");
    expect($legend.length).toEqual(0);
  });

  it("renders single checkbox with custom value", () => {
    locals = {
      options: {
        fields: {
          "my-input": {
            validate: "required",
          },
        },
      },
      values: {
        "my-input": true,
      },
    };
    const $ = render(
      {
        component: "checkboxes",
        params: { id: "my-input", value: "foobar" },
        ctx: true,
      },
      locals,
    );

    const $component = $(".govuk-checkboxes__input");
    expect($component.attr("name")).toEqual("my-input");
    expect($component.attr("value")).toEqual("foobar");
  });

  it("renders with legend and hint", () => {
    const $ = render(
      { component: "checkboxes", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $legend = $(".govuk-fieldset__legend");
    expect($legend.text().trim()).toEqual("[fields.my-input.legend]");
    const $hint = $(".govuk-hint").eq(0);
    expect($hint.text().trim()).toEqual("[fields.my-input.hint]");
  });

  it("renders items with ids, names, and labels", () => {
    const $ = render(
      { component: "checkboxes", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $item1 = $(".govuk-checkboxes__input").eq(0);
    expect($item1.attr("name")).toEqual("my-input");
    expect($item1.attr("value")).toEqual("a");
    expect($item1.attr("id")).toEqual("my-input");
    expect($item1.attr("checked")).toEqual("checked");
    const $itemlabel1 = $(".govuk-checkboxes__label").eq(0);
    expect($itemlabel1.text().trim()).toEqual(
      "[fields.my-input.items.a.label]",
    );
    expect($itemlabel1.attr("id")).toEqual("my-input-a-label");

    const $item2 = $(".govuk-checkboxes__input").eq(1);
    expect($item2.attr("name")).toEqual("my-input");
    expect($item2.attr("value")).toEqual("b");
    expect($item2.attr("id")).toEqual("my-input-b");
    expect($item2.attr("checked")).toBeUndefined();
    const $itemlabel2 = $(".govuk-checkboxes__label").eq(1);
    expect($itemlabel2.text().trim()).toEqual(
      "[fields.my-input.items.b.label]",
    );
    expect($itemlabel2.attr("id")).toEqual("my-input-b-label");
  });

  it("renders items with hints", () => {
    locals.options.fields["my-input-hints"] = {
      items: [
        "a",
        "b",
        { value: "c", hint: { html: "<b>item c hint</b>" } },
        { value: "d", hint: { html: "<b>item d hint</b>" } },
      ],
    };
    const $ = renderWithLocale(
      {
        component: "checkboxes",
        ctx: true,
        params: { id: "my-input-hints" },
      },
      locals,
    );

    const $item1 = $(".govuk-checkboxes__hint").eq(0);
    expect(cleanHtml($item1)).toEqual("<i>locale b hint</i>");
    const $item2 = $(".govuk-checkboxes__hint").eq(1);
    expect(cleanHtml($item2)).toEqual("<b>item c hint</b>");
    const $item3 = $(".govuk-checkboxes__hint").eq(2);
    expect(cleanHtml($item3)).toEqual("<b>item d hint</b>");
  });

  it("renders radio buttons with header", () => {
    const $ = render(
      {
        component: "checkboxes",
        params: { id: "my-input", isPageHeading: true },
        ctx: true,
      },
      locals,
    );
    const $legend = $(".govuk-fieldset__legend");
    expect($legend.attr("class")).toEqual(
      "govuk-fieldset__legend govuk-fieldset__legend--l",
    );
    expect(cleanHtml($legend)).toEqual(
      '<h1 class="govuk-fieldset__heading">[fields.my-input.legend]</h1>',
    );
  });
});
