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

describe("hmpoDate", () => {
  let locals: {
    options: { fields: Record<string, { validate?: string }> };
  };

  beforeEach(() => {
    locals = {
      options: {
        fields: {
          "my-input": {
            validate: "required",
          },
        },
      },
    };
  });

  it("renders inputs with ids and names", () => {
    const $ = render(
      { component: "date", params: { id: "my-input" }, ctx: true },
      locals,
    );

    const $day = $(".govuk-input").eq(0);
    expect($day.attr("id")).toEqual("my-input-day");
    expect($day.attr("name")).toEqual("my-input-day");
    expect($day.attr("type")).toEqual("text");
    expect($day.attr("maxlength")).toEqual("2");
    const $month = $(".govuk-input").eq(1);
    expect($month.attr("id")).toEqual("my-input-month");
    expect($month.attr("name")).toEqual("my-input-month");
    expect($month.attr("type")).toEqual("text");
    expect($month.attr("maxlength")).toEqual("2");
    const $year = $(".govuk-input").eq(2);
    expect($year.attr("id")).toEqual("my-input-year");
    expect($year.attr("name")).toEqual("my-input-year");
    expect($year.attr("type")).toEqual("text");
    expect($year.attr("maxlength")).toEqual("4");
  });

  it("sets id on fieldset", () => {
    const $ = render(
      { component: "date", params: { id: "my-input" }, ctx: true },
      locals,
    );
    const $fieldset = $(".govuk-fieldset");
    expect($fieldset.attr("id")).toEqual("my-input-fieldset");
  });

  it("renders legend as header", () => {
    const $ = render(
      {
        component: "date",
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

  it("renders with header label localisation instead of legend when legend is not present", () => {
    const $ = renderWithLocale(
      {
        component: "date",
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
});
