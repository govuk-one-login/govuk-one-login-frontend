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

describe("hmpoSubmit", () => {
  let locals: Record<string, unknown>;

  beforeEach(() => {
    locals = {};
  });

  it("renders with localisation text", () => {
    const $ = render(
      { component: "submit", params: { key: "myButtonTextKey" }, ctx: true },
      locals,
    );
    const $component = $(".govuk-button");
    expect($component.text()).toContain("buttons.myButtonTextKey");
  });

  it("renders with id", () => {
    const $ = render(
      { component: "submit", params: { id: "myid" }, ctx: true },
      locals,
    );
    const $component = $(".govuk-button");
    expect($component.attr("id")).toEqual("myid");
    expect($component.attr("name")).toEqual("myid");
  });

  it("renders with button class", () => {
    const $ = render(
      { component: "submit", params: { id: "myid" }, ctx: true },
      locals,
    );
    const $component = $(".govuk-button");
    expect($component.attr("class")).toEqual("govuk-button button");
  });

  it("renders with start button", () => {
    const $ = render(
      {
        component: "submit",
        params: { id: "myid", isStartButton: true },
        ctx: true,
      },
      locals,
    );
    const $component = $(".govuk-button");
    expect($component.attr("class")).toEqual(
      "govuk-button button govuk-button--start",
    );
  });
});
