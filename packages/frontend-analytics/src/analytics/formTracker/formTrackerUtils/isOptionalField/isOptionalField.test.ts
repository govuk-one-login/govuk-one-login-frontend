import { isOptionalField } from "./isOptionalField";

describe("isOptionalField", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("returns true when element has aria-required=false", () => {
    const el = document.createElement("input");
    el.setAttribute("aria-required", "false");
    document.body.appendChild(el);
    expect(isOptionalField(el)).toBe(true);
  });

  test("returns false when element has no aria-required attribute", () => {
    const el = document.createElement("input");
    document.body.appendChild(el);
    expect(isOptionalField(el)).toBe(false);
  });

  test("returns false when element has aria-required=true", () => {
    const el = document.createElement("input");
    el.setAttribute("aria-required", "true");
    document.body.appendChild(el);
    expect(isOptionalField(el)).toBe(false);
  });

  test("returns true when closest fieldset has aria-required=false", () => {
    document.body.innerHTML =
      '<fieldset aria-required="false">' +
      '  <input type="radio" id="opt-radio" name="opt-radio" value="yes"/>' +
      "</fieldset>";
    const el = document.getElementById("opt-radio") as HTMLElement;
    expect(isOptionalField(el)).toBe(true);
  });

  test("returns false when element is in a fieldset without aria-required", () => {
    document.body.innerHTML =
      "<fieldset>" +
      '  <input type="radio" id="req-radio" name="req-radio" value="yes"/>' +
      "</fieldset>";
    const el = document.getElementById("req-radio") as HTMLElement;
    expect(isOptionalField(el)).toBe(false);
  });

  test("returns false when element is in a fieldset with aria-required=true", () => {
    document.body.innerHTML =
      '<fieldset aria-required="true">' +
      '  <input type="radio" id="req-radio" name="req-radio" value="yes"/>' +
      "</fieldset>";
    const el = document.getElementById("req-radio") as HTMLElement;
    expect(isOptionalField(el)).toBe(false);
  });

  test("element aria-required=false takes precedence over fieldset with no aria-required", () => {
    document.body.innerHTML =
      "<fieldset>" +
      '  <input type="text" id="opt-text" name="opt-text" aria-required="false"/>' +
      "</fieldset>";
    const el = document.getElementById("opt-text") as HTMLElement;
    expect(isOptionalField(el)).toBe(true);
  });
});
