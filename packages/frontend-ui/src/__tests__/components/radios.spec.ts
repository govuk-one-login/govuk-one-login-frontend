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

describe("hmpoRadios", () => {
  let locals: {
    options: {
      fields: Record<string, { validate?: string; items?: unknown[] }>;
    };
    values: Record<string, unknown>;
  };

  beforeEach(() => {
    locals = {
      options: {
        fields: {
          "my-input": {
            validate: "required",
            items: ["a", "b", "c"],
          },
          "my-input-reveals": {
            items: ["a", "b", "c"],
          },
          "my-input-divider": {
            items: [
              "a",
              { divider: "test" },
              "c",
              { divider: true },
              "d",
              { divider: true, key: "my.key" },
              "e",
            ],
          },
        },
      },
      values: {
        "my-input": "b",
      },
    };
  });

  it("renders with id", () => {
    const $ = renderWithLocale(
      { component: "radios", params: { id: "my-input" }, ctx: true },
      locals,
    );
    const $component = $(".govuk-fieldset");
    expect($component.attr("id")).toEqual("my-input-fieldset");
  });

  it("renders with legend and hint", () => {
    const $ = renderWithLocale(
      { component: "radios", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $legend = $(".govuk-fieldset__legend");
    expect($legend.text().trim()).toEqual("fields.my-input.label");
    const $hint = $(".govuk-hint");
    expect($hint.text().trim()).toEqual("Hint text");
  });

  it("renders items with ids and labels", () => {
    const $ = renderWithLocale(
      { component: "radios", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $item1 = $(".govuk-radios__input").eq(0);
    expect($item1.attr("name")).toEqual("my-input");
    expect($item1.attr("value")).toEqual("a");
    expect($item1.attr("id")).toEqual("my-input");
    expect($item1.attr("checked")).toBeUndefined();
    const $itemlabel1 = $(".govuk-radios__label").eq(0);
    expect($itemlabel1.text().trim()).toEqual("fields.my-input.items.a.label");
    expect($itemlabel1.attr("id")).toEqual("my-input-a-label");

    const $item2 = $(".govuk-radios__input").eq(1);
    expect($item2.attr("name")).toEqual("my-input");
    expect($item2.attr("value")).toEqual("b");
    expect($item2.attr("id")).toEqual("my-input-b");
    expect($item2.attr("checked")).toEqual("checked");
    const $itemlabel2 = $(".govuk-radios__label").eq(1);
    expect($itemlabel2.text().trim()).toEqual("fields.my-input.items.b.label");
    expect($itemlabel2.attr("id")).toEqual("my-input-b-label");
  });

  it("renders merged items from options and params", () => {
    locals.options.fields["my-input"].items = [
      { value: 1 },
      "a",
      { value: true, text: "boolean" },
    ];
    const paramItems = { "1": { text: "one" }, a: { text: "alpha" } };
    const $ = renderWithLocale(
      {
        component: "radios",
        params: { id: "my-input", items: paramItems },
        ctx: true,
      },
      locals,
    );

    const $item1 = $(".govuk-radios__input").eq(0);
    expect($item1.attr("value")).toEqual("1");
    const $itemlabel1 = $(".govuk-radios__label").eq(0);
    expect($itemlabel1.text().trim()).toEqual("one");

    const $item2 = $(".govuk-radios__input").eq(1);
    expect($item2.attr("value")).toEqual("a");
    const $itemlabel2 = $(".govuk-radios__label").eq(1);
    expect($itemlabel2.text().trim()).toEqual("alpha");

    const $item3 = $(".govuk-radios__input").eq(2);
    expect($item3.attr("value")).toEqual("true");
    const $itemlabel3 = $(".govuk-radios__label").eq(2);
    expect($itemlabel3.text().trim()).toEqual("boolean");
  });

  it("renders merged items from options with params as an array", () => {
    locals.options.fields["my-input"].items = [
      { value: 1 },
      "a",
      { value: true, text: "boolean" },
    ];
    const paramItems = [
      { value: "1", text: "one" },
      { value: "a", text: "alpha" },
    ];
    const $ = render(
      {
        component: "radios",
        params: { id: "my-input", items: paramItems },
        ctx: true,
      },
      locals,
    );

    const $item1 = $(".govuk-radios__input").eq(0);
    expect($item1.attr("value")).toEqual("1");
    const $itemlabel1 = $(".govuk-radios__label").eq(0);
    expect($itemlabel1.text().trim()).toEqual("one");

    const $item2 = $(".govuk-radios__input").eq(1);
    expect($item2.attr("value")).toEqual("a");
    const $itemlabel2 = $(".govuk-radios__label").eq(1);
    expect($itemlabel2.text().trim()).toEqual("alpha");

    const $item3 = $(".govuk-radios__input").eq(2);
    expect($item3.attr("value")).toEqual("true");
    const $itemlabel3 = $(".govuk-radios__label").eq(2);
    expect($itemlabel3.text().trim()).toEqual("boolean");
  });

  it("renders default items", () => {
    const $ = renderWithLocale(
      { component: "radios", params: { id: "default-input" }, ctx: true },
      locals,
    );

    const $item1 = $(".govuk-radios__input").eq(0);
    expect($item1.attr("value")).toEqual("true");
    const $itemlabel1 = $(".govuk-radios__label").eq(0);
    expect($itemlabel1.text().trim()).toEqual(
      "fields.default-input.items.true.label",
    );

    const $item2 = $(".govuk-radios__input").eq(1);
    expect($item2.attr("value")).toEqual("false");
    const $itemlabel2 = $(".govuk-radios__label").eq(1);
    expect($itemlabel2.text().trim()).toEqual(
      "fields.default-input.items.false.label",
    );
  });

  it("renders items with conditionals", () => {
    const $ = renderWithLocale(
      {
        component: "radios",
        ctx: true,
        params: {
          id: "my-input",
          conditionals: {
            a: { id: "a", html: "a <b>string</b>" },
            b: { id: "b", html: "b <b>object</b>" },
          },
        },
      },
      locals,
    );

    const $item1 = $(".govuk-radios__conditional").eq(0);
    expect(cleanHtml($item1)).toEqual("a <b>string</b>");
    const $item2 = $(".govuk-radios__conditional").eq(1);
    expect(cleanHtml($item2)).toEqual("b <b>object</b>");
  });

  it("renders items with hints", () => {
    locals.options.fields["my-input-hints"] = {
      items: [
        "a",
        { value: "b", hint: { classes: "test-hint-class" } },
        { value: "c", hint: { html: "<b>item c hint</b>" } },
        { value: "d", hint: { html: "<b>item d hint</b>" } },
      ],
    };
    const $ = renderWithLocale(
      { component: "radios", ctx: true, params: { id: "my-input-hints" } },
      locals,
    );

    const $item1 = $(".govuk-radios__hint").eq(0);
    expect(cleanHtml($item1)).toEqual("<i>locale b hint</i>");
    expect($item1.attr("class")).toEqual(
      "govuk-hint govuk-radios__hint test-hint-class",
    );
    const $item2 = $(".govuk-radios__hint").eq(1);
    expect(cleanHtml($item2)).toEqual("<b>item c hint</b>");
    const $item3 = $(".govuk-radios__hint").eq(2);
    expect(cleanHtml($item3)).toEqual("<b>item d hint</b>");
  });

  it("renders items with conditionals inline", () => {
    const $ = renderWithLocale(
      {
        component: "radios",
        ctx: true,
        params: {
          id: "my-input",
          inline: true,
          conditionals: {
            a: { id: "a", html: "a <b>first</b>" },
            b: { id: "b", html: "b <b>second</b>", classes: "anotherclass" },
            c: { html: "b <b>third</b>" },
          },
        },
      },
      locals,
    );

    const $radiosControl = $("div[data-module=govuk-radios]");
    expect($radiosControl.find(".govuk-radios__conditional").length).toEqual(0);

    const $item1 = $(".govuk-radios__conditional").eq(0);
    expect($item1.attr("id")).toEqual("a");
    expect($item1.attr("class")).toEqual("govuk-radios__conditional");
    expect(cleanHtml($item1)).toEqual("a <b>first</b>");
    const $item2 = $(".govuk-radios__conditional").eq(1);
    expect($item2.attr("id")).toEqual("b");
    expect($item2.attr("class")).toEqual(
      "govuk-radios__conditional anotherclass",
    );
    expect(cleanHtml($item2)).toEqual("b <b>second</b>");
    const $item3 = $(".govuk-radios__conditional").eq(2);
    expect($item3.attr("id")).toEqual("conditional-my-input-c");
    expect($item3.attr("class")).toEqual("govuk-radios__conditional");
    expect(cleanHtml($item3)).toEqual("b <b>third</b>");
  });

  it("renders items with conditionals from localisation", () => {
    const $ = renderWithLocale(
      {
        component: "radios",
        ctx: true,
        params: {
          id: "my-input-reveals",
          conditionals: { a: { id: "a", html: "a <b>first</b>" } },
        },
      },
      locals,
    );

    expect($(".govuk-radios__conditional").length).toEqual(2);

    const $item1 = $(".govuk-radios__conditional").eq(0);
    expect(cleanHtml($item1)).toEqual("a <b>first</b>");
    const $item2 = $(".govuk-radios__conditional").eq(1);
    expect(cleanHtml($item2)).toEqual("<p>second</p>");
  });

  it("renders items with inline conditionals with no html", () => {
    const $ = renderWithLocale(
      {
        component: "radios",
        ctx: true,
        params: {
          id: "my-input",
          inline: true,
          conditionals: {
            a: { id: "a", html: "a <b>string</b>" },
            b: { id: "b" },
          },
        },
      },
      locals,
    );
    expect($(".govuk-radios__conditional").length).toEqual(1);
  });

  it("renders items with inline conditionals with multiConditional flag", () => {
    const $ = renderWithLocale(
      {
        component: "radios",
        ctx: true,
        params: {
          id: "my-input",
          inline: true,
          conditionals: {
            a: { id: "a", html: "a <b>string</b>" },
            b: { id: "a" },
          },
          multiConditional: true,
        },
      },
      locals,
    );
    const $radiosControl = $("div[data-module=govuk-radios]");
    expect($radiosControl.attr("data-multi-conditional")).toEqual("true");
  });

  it("renders items with conditionals without inset", () => {
    const $ = renderWithLocale(
      {
        component: "radios",
        ctx: true,
        params: {
          id: "my-input",
          inline: true,
          conditionals: {
            a: { id: "a", html: "a <b>first</b>", removeInset: true },
            b: {
              id: "b",
              html: "b <b>second</b>",
              removeInset: true,
              classes: "anotherclass",
            },
          },
        },
      },
      locals,
    );

    const $item1 = $("#a");
    expect($item1.attr("class")).toEqual(
      "govuk-radios__conditional govuk-radios__removeInset",
    );
    expect(cleanHtml($item1)).toEqual("a <b>first</b>");
    const $item2 = $("#b");
    expect($item2.attr("class")).toEqual(
      "govuk-radios__conditional govuk-radios__removeInset anotherclass",
    );
    expect(cleanHtml($item2)).toEqual("b <b>second</b>");
  });

  it("renders radio buttons with header", () => {
    const $ = renderWithLocale(
      {
        component: "radios",
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
      '<h1 class="govuk-fieldset__heading">fields.my-input.label</h1>',
    );
  });

  it("renders radio buttons with header attributes", () => {
    const $ = renderWithLocale(
      {
        component: "radios",
        params: {
          id: "legendtest",
          isPageHeading: true,
          legend: { attributes: { "data-test": "test value" } },
        },
        ctx: true,
      },
      locals,
    );
    const $legend = $(".govuk-fieldset__legend");
    expect($legend.attr("class")).toEqual(
      "govuk-fieldset__legend govuk-fieldset__legend--l",
    );
    expect(cleanHtml($legend)).toEqual(
      '<h1 class="govuk-fieldset__heading"><span data-test="test value">Legend text</span></h1>',
    );
  });

  it("renders radio buttons with header label localisation instead of legend when legend is not present", () => {
    const $ = renderWithLocale(
      {
        component: "radios",
        params: {
          id: "labeltest",
          isPageHeading: true,
          label: { attributes: { "data-test": "test value" } },
        },
        ctx: true,
      },
      locals,
    );
    const $legend = $(".govuk-fieldset__legend");
    expect($legend.attr("class")).toEqual(
      "govuk-fieldset__legend govuk-fieldset__legend--l",
    );
    expect(cleanHtml($legend)).toEqual(
      '<h1 class="govuk-fieldset__heading"><span data-test="test value">Label text</span></h1>',
    );
  });

  it("renders radio buttons with localised dividers", () => {
    const $ = renderWithLocale(
      {
        component: "radios",
        params: { id: "my-input-divider", isPageHeading: true },
        ctx: true,
      },
      locals,
    );

    const $item1 = $(".govuk-radios__input").eq(0);
    expect($item1.attr("value")).toEqual("a");
    const $itemlabel1 = $(".govuk-radios__label").eq(0);
    expect($itemlabel1.text().trim()).toEqual(
      "fields.my-input-divider.items.a.label",
    );

    const $div1 = $(".govuk-radios__divider").eq(0);
    expect($div1.text().trim()).toEqual("test");

    const $div2 = $(".govuk-radios__divider").eq(1);
    expect($div2.text().trim()).toEqual(
      "fields.my-input-divider.divider.label",
    );

    const $div3 = $(".govuk-radios__divider").eq(2);
    expect($div3.text().trim()).toEqual("my.key");
  });
});
