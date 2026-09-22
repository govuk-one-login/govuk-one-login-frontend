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

import { render } from "../helpers";

describe("hmpoSelect", () => {
  let locals: {
    options: {
      fields: Record<string, { validate?: string; items?: string[] }>;
    };
    values: Record<string, string | undefined>;
  };

  beforeEach(() => {
    locals = {
      options: {
        fields: {
          "my-input": {
            validate: "required",
            items: ["a", "b", "c"],
          },
        },
      },
      values: {
        "my-input": "b",
      },
    };
  });

  it("renders with name and id", () => {
    const $ = render(
      { component: "select", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $component = $("select");
    expect($component.attr("id")).toEqual("my-input");
  });

  it("renders with label and hint", () => {
    const $ = render(
      { component: "select", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $label = $(".govuk-label");
    expect($label.text().trim()).toEqual("[fields.my-input.label]");
    expect($label.attr("id")).toEqual("my-input-label");
    const $hint = $(".govuk-hint");
    expect($hint.text().trim()).toEqual("[fields.my-input.hint]");
  });

  it("renders items with names and labels", () => {
    const $ = render(
      { component: "select", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $item1 = $("option").eq(0);
    expect($item1.attr("value")).toEqual("a");
    expect($item1.attr("selected")).toBeUndefined();
    expect($item1.text().trim()).toEqual("[fields.my-input.items.a.label]");

    const $item2 = $("option").eq(1);
    expect($item2.attr("value")).toEqual("b");
    expect($item2.attr("selected")).toEqual("selected");
    expect($item2.text().trim()).toEqual("[fields.my-input.items.b.label]");
  });

  describe("placeholders", () => {
    it("renders items with a placeholder", () => {
      const $ = render(
        {
          component: "select",
          params: { id: "my-input", placeholder: true },
          ctx: true,
        },
        locals,
      );

      const $placeholder = $("option").eq(0);
      expect($placeholder.attr("value")).toEqual("");
      expect($placeholder.attr("selected")).toBeUndefined();
      expect($placeholder.attr("disabled")).toEqual("disabled");
      expect($placeholder.text().trim()).toEqual(
        "[fields.my-input.placeholder]",
      );

      const $item1 = $("option").eq(1);
      expect($item1.attr("value")).toEqual("a");
      expect($item1.attr("selected")).toBeUndefined();
      expect($item1.text().trim()).toEqual("[fields.my-input.items.a.label]");

      const $item2 = $("option").eq(2);
      expect($item2.attr("value")).toEqual("b");
      expect($item2.attr("selected")).toEqual("selected");
      expect($item2.text().trim()).toEqual("[fields.my-input.items.b.label]");
    });

    it("renders placeholder as not disabled when select is not required to be filled", () => {
      const $ = render(
        {
          component: "select",
          params: { id: "my-input", placeholder: true, validate: [] },
          ctx: true,
        },
        locals,
      );

      const $placeholder = $("option").eq(0);
      expect($placeholder.attr("value")).toEqual("");
      expect($placeholder.attr("selected")).toBeUndefined();
      expect($placeholder.attr("disabled")).toBeUndefined();
      expect($placeholder.text().trim()).toEqual(
        "[fields.my-input.placeholder]",
      );
    });

    it("renders with placeholder selected if value is undefined", () => {
      locals.values["my-input"] = undefined;

      const $ = render(
        {
          component: "select",
          params: { id: "my-input", placeholder: true },
          ctx: true,
        },
        locals,
      );

      const $placeholder = $("option").eq(0);
      expect($placeholder.attr("value")).toEqual("");
      expect($placeholder.attr("selected")).toEqual("selected");
      expect($placeholder.attr("disabled")).toEqual("disabled");
      expect($placeholder.text().trim()).toEqual(
        "[fields.my-input.placeholder]",
      );
    });
  });

  it("renders label as header", () => {
    const $ = render(
      {
        component: "select",
        params: { id: "my-input", isPageHeading: true },
        ctx: true,
      },
      locals,
    );
    const $label = $("h1 .govuk-label");
    expect($label.attr("class")).toEqual("govuk-label govuk-label--l");
  });
});
