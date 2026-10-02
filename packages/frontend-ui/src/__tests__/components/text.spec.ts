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

import type { Mock } from "vitest";
import { render } from "../helpers";
import { expectComponentToHaveNoAxeViolations } from "./helpers";

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

  it("renders with id", async () => {
    const $ = render(
      { component: "text", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $component = $(".govuk-input");
    expect($component.attr("id")).toEqual("my-input");

    await expectComponentToHaveNoAxeViolations($.html());
  });

  it("renders with label and hint", async () => {
    const $ = render(
      { component: "text", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $label = $(".govuk-label");
    expect($label.text().trim()).toEqual("[fields.my-input.label]");
    expect($label.attr("id")).toEqual("my-input-label");
    const $hint = $(".govuk-hint");
    expect($hint.text().trim()).toEqual("[fields.my-input.hint]");

    await expectComponentToHaveNoAxeViolations($.html());
  });

  it("does not render hint if there is no localisation", async () => {
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
    expect($hint).toHaveLength(0);

    await expectComponentToHaveNoAxeViolations($.html());
  });

  it("renders with label and prefix", async () => {
    const $ = render(
      { component: "text", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $label = $(".govuk-label");
    expect($label.text().trim()).toEqual("[fields.my-input.label]");
    expect($label.attr("id")).toEqual("my-input-label");
    const $prefix = $(".govuk-input__prefix");
    expect($prefix.text().trim()).toEqual("[fields.my-input.prefix]");

    await expectComponentToHaveNoAxeViolations($.html());
  });

  it("renders with value", async () => {
    const $ = render(
      { component: "text", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $component = $(".govuk-input");
    expect($component.attr("value")).toEqual("abc123");

    await expectComponentToHaveNoAxeViolations($.html());
  });

  it("renders with aria-required=false if validator is not required", async () => {
    locals.options.fields["my-input"].validate = undefined;
    const $ = render(
      { component: "text", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $component = $(".govuk-input");
    expect($component.attr("aria-required")).toEqual("false");

    await expectComponentToHaveNoAxeViolations($.html());
  });

  it("renders with no aria-required if validator is required", async () => {
    const $ = render(
      { component: "text", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $component = $(".govuk-input");
    expect($component.attr("aria-required")).toBeUndefined();

    await expectComponentToHaveNoAxeViolations($.html());
  });

  it("renders with no aria-required if validators contains required", async () => {
    locals.options.fields["my-input"].validate = ["required"];
    const $ = render(
      { component: "text", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $component = $(".govuk-input");
    expect($component.attr("aria-required")).toBeUndefined();

    await expectComponentToHaveNoAxeViolations($.html());
  });

  it("renders with no aria-required if validators contains required validator object", async () => {
    locals.options.fields["my-input"].validate = [{ type: "required" }];
    const $ = render(
      { component: "text", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $component = $(".govuk-input");
    expect($component.attr("aria-required")).toBeUndefined();

    await expectComponentToHaveNoAxeViolations($.html());
  });

  it("renders with max-length from validator", async () => {
    locals.options.fields["my-input"].validate = [
      { type: "maxlength", arguments: 5 },
    ];

    const $ = render(
      { component: "text", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $component = $(".govuk-input");
    expect($component.attr("maxlength")).toEqual("5");

    await expectComponentToHaveNoAxeViolations($.html());
  });

  it("renders with max-length from validator array", async () => {
    locals.options.fields["my-input"].validate = [
      { type: "maxlength", arguments: [5] },
    ];

    const $ = render(
      { component: "text", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $component = $(".govuk-input");
    expect($component.attr("maxlength")).toEqual("5");

    await expectComponentToHaveNoAxeViolations($.html());
  });

  it("renders with errorValue if available", async () => {
    locals.errorValues = {
      "my-input": "def456",
    };

    const $ = render(
      { component: "text", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $component = $(".govuk-input");
    expect($component.attr("value")).toEqual("def456");

    await expectComponentToHaveNoAxeViolations($.html());
  });

  it("renders error message if available", async () => {
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

    await expectComponentToHaveNoAxeViolations($.html());
  });

  it("renders label as header", async () => {
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

    await expectComponentToHaveNoAxeViolations($.html());
  });

  it("renders with nopaste", async () => {
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

    await expectComponentToHaveNoAxeViolations($.html());
  });

  it("renders with no extra classes", async () => {
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

    await expectComponentToHaveNoAxeViolations($.html());
  });

  it("renders with extra classes", async () => {
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

    await expectComponentToHaveNoAxeViolations($.html());
  });

  it("renders with extra classes and noPaste", async () => {
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

    await expectComponentToHaveNoAxeViolations($.html());
  });

  it("renders with noPaste set to false", async () => {
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

    await expectComponentToHaveNoAxeViolations($.html());
  });
});
