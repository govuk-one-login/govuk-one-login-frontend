// @vitest-environment node

import type * as filtersModule from "../lib/filters";
import type * as globalsModule from "../lib/globals";

vi.mock("../lib/globals", async (importOriginal) => {
  const original = await importOriginal<typeof globalsModule>();
  return {
    globals: { ...original.globals, addGlobals: original.addGlobals },
  };
});

vi.mock("../lib/filters", async (importOriginal) => {
  const original = await importOriginal<typeof filtersModule>();
  return {
    filters: { ...original.filters, addFilters: original.addFilters },
  };
});

import type { Mock } from "vitest";
import { render } from "./helpers";

interface Locals {
  options: {
    fields: Record<
      string,
      { validate: string | string[] | Record<string, unknown>[] | undefined }
    >;
  };
  values: Record<string, string>;
  errors?: Record<string, { key: string; type: string }>;
  errorValues?: Record<string, string>;
  translate?: Mock;
}

describe("hmpoText", () => {
  let locals: Locals;

  beforeEach(() => {
    locals = {
      options: {
        fields: {
          "my-input": {
            validate: "required",
          },
        },
      },
      values: {
        "my-input": "abc123",
      },
    };
  });

  it("renders with id", () => {
    const $ = render(
      { component: "text", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $component = $(".govuk-input");
    expect($component.attr("id")).toEqual("my-input");
  });

  it("renders with label and hint", () => {
    const $ = render(
      { component: "text", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $label = $(".govuk-label");
    expect($label.text().trim()).toEqual("[fields.my-input.label]");
    expect($label.attr("id")).toEqual("my-input-label");
    const $hint = $(".govuk-hint");
    expect($hint.text().trim()).toEqual("[fields.my-input.hint]");
  });

  it("does not render hint if there is no localisation", () => {
    locals.translate = vi.fn();
    locals.translate.mockImplementation((key: string) =>
      key === "fields.my-input.hint" ? undefined : key,
    );

    const $ = render(
      { component: "text", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $label = $(".govuk-label");
    console.log($label.text());
    expect($label.text().trim()).toEqual("fields.my-input.label");
    expect($label.attr("id")).toEqual("my-input-label");
    const $hint = $(".govuk-hint");
    expect($hint.length).toEqual(0);
  });

  it("renders with label and prefix", () => {
    const $ = render(
      { component: "text", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $label = $(".govuk-label");
    expect($label.text().trim()).toEqual("[fields.my-input.label]");
    expect($label.attr("id")).toEqual("my-input-label");
    const $prefix = $(".govuk-input__prefix");
    expect($prefix.text().trim()).toEqual("[fields.my-input.prefix]");
  });

  it("renders with value", () => {
    const $ = render(
      { component: "text", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $component = $(".govuk-input");
    expect($component.attr("value")).toEqual("abc123");
  });

  it("renders with aria-required=false if validator is not required", () => {
    locals.options.fields["my-input"].validate = undefined;
    const $ = render(
      { component: "text", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $component = $(".govuk-input");
    expect($component.attr("aria-required")).toEqual("false");
  });

  it("renders with no aria-required if validator is required", () => {
    const $ = render(
      { component: "text", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $component = $(".govuk-input");
    expect($component.attr("aria-required")).toBeUndefined();
  });

  it("renders with no aria-required if validators contains required", () => {
    locals.options.fields["my-input"].validate = ["required"];
    const $ = render(
      { component: "text", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $component = $(".govuk-input");
    expect($component.attr("aria-required")).toBeUndefined();
  });

  it("renders with no aria-required if validators contains required validator object", () => {
    locals.options.fields["my-input"].validate = [{ type: "required" }];
    const $ = render(
      { component: "text", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $component = $(".govuk-input");
    expect($component.attr("aria-required")).toBeUndefined();
  });

  it("renders with max-length from validator", () => {
    locals.options.fields["my-input"].validate = [
      { type: "maxlength", arguments: 5 },
    ];

    const $ = render(
      { component: "text", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $component = $(".govuk-input");
    expect($component.attr("maxlength")).toEqual("5");
  });

  it("renders with max-length from validator array", () => {
    locals.options.fields["my-input"].validate = [
      { type: "maxlength", arguments: [5] },
    ];

    const $ = render(
      { component: "text", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $component = $(".govuk-input");
    expect($component.attr("maxlength")).toEqual("5");
  });

  it("renders with errorValue if available", () => {
    locals.errorValues = {
      "my-input": "def456",
    };

    const $ = render(
      { component: "text", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $component = $(".govuk-input");
    expect($component.attr("value")).toEqual("def456");
  });

  it("renders error message if available", () => {
    locals.errors = {
      "my-input": { key: "my-input", type: "validator" },
    };

    const $ = render(
      { component: "text", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $component = $("#my-input-error");
    expect($component.text().trim()).toEqual(
      "[govuk.error]: [fields.my-input.validation.validator]",
    );
  });

  it("renders label as header", () => {
    const $ = render(
      {
        component: "text",
        params: { id: "my-input", isPageHeading: true },
        ctx: true,
      },
      locals,
    );
    const $label = $("h1 .govuk-label");
    expect($label.attr("class")).toEqual("govuk-label govuk-label--l");
  });

  it("renders with nopaste", () => {
    const $ = render(
      {
        component: "text",
        params: { id: "my-input", isPageHeading: true, noPaste: true },
        ctx: true,
      },
      locals,
    );
    const $label = $(".govuk-input");
    expect($label.attr("class")).toEqual(
      "govuk-input govuk-!-width-one-half js-nopaste",
    );
  });

  it("renders with no extra classes", () => {
    const $ = render(
      {
        component: "text",
        params: { id: "my-input", isPageHeading: true },
        ctx: true,
      },
      locals,
    );
    const $label = $(".govuk-input");
    expect($label.attr("class")).toEqual("govuk-input govuk-!-width-one-half");
  });

  it("renders with extra classes", () => {
    const $ = render(
      {
        component: "text",
        params: { id: "my-input", isPageHeading: true, classes: "test" },
        ctx: true,
      },
      locals,
    );
    const $label = $(".govuk-input");
    expect($label.attr("class")).toEqual("govuk-input test");
  });

  it("renders with extra classes and noPaste", () => {
    const $ = render(
      {
        component: "text",
        params: {
          id: "my-input",
          isPageHeading: true,
          classes: "test",
          noPaste: true,
        },
        ctx: true,
      },
      locals,
    );
    const $label = $(".govuk-input");
    expect($label.attr("class")).toEqual("govuk-input test js-nopaste");
  });

  it("renders with noPaste set to false", () => {
    const $ = render(
      {
        component: "text",
        params: { id: "my-input", isPageHeading: true, noPaste: false },
        ctx: true,
      },
      locals,
    );
    const $label = $(".govuk-input");
    expect($label.attr("class")).toEqual("govuk-input govuk-!-width-one-half");
  });
});
