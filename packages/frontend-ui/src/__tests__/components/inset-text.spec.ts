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

describe("hmpoInsetText", () => {
  it("renders with text", () => {
    const $ = render({
      component: "insetText",
      params: { text: "my text <br>" },
    });

    const $component = $("div");
    expect(cleanHtml($component)).toEqual("my text &lt;br&gt;");
  });

  it("renders with html", () => {
    const $ = render({
      component: "insetText",
      params: { html: "my text <br>" },
    });

    const $component = $("div");
    expect(cleanHtml($component)).toEqual("my text <br>");
  });

  it("renders with caller", () => {
    const $ = render({
      component: "insetText",
      params: { html: "my text <br>" },
      caller: "<br>caller text<br>",
    });

    const $component = $("div");
    expect(cleanHtml($component)).toEqual("<br>caller text<br>");
  });
});
