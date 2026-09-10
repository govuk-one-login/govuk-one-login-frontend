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

describe("hmpoForm", () => {
  let locals: Record<string, unknown>;

  beforeEach(() => {
    locals = {
      "csrf-token": "abcd1234",
    };
  });

  it("renders with default action and method", () => {
    const $ = render({ component: "form", params: {}, ctx: true }, locals);

    const $component = $("form");
    expect($component.attr("action")).toEqual("");
    expect($component.attr("method")).toEqual("POST");
  });

  it("renders with action from locals", () => {
    locals.action = "/local/action";

    const $ = render({ component: "form", params: {}, ctx: true }, locals);

    const $component = $("form");
    expect($component.attr("action")).toEqual("/local/action");
  });

  it("renders with overridden action and method", () => {
    const $ = render(
      {
        component: "form",
        params: { action: "/path", method: "GET" },
        ctx: true,
      },
      locals,
    );

    const $component = $("form");
    expect($component.attr("action")).toEqual("/path");
    expect($component.attr("method")).toEqual("GET");
  });

  it("renders caller children", () => {
    const caller = '<span id="child"></span>';
    const $ = render(
      { component: "form", params: {}, caller, ctx: true },
      locals,
    );

    const $children = $("form #child");
    expect($children.length).toEqual(1);
  });

  it("renders csrf hidden input", () => {
    const $ = render({ component: "form", params: {}, ctx: true }, locals);

    const $csrf = $("input");
    expect($csrf.attr("type")).toEqual("hidden");
    expect($csrf.attr("name")).toEqual("x-csrf-token");
    expect($csrf.attr("value")).toEqual("abcd1234");
  });

  it("does not render csrf hidden input if no value supplied in locals", () => {
    delete locals["csrf-token"];
    const $ = render({ component: "form", params: {}, ctx: true }, locals);

    const $csrf = $("input");
    expect($csrf.length).toEqual(0);
  });
});
