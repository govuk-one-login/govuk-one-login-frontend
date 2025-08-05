import { beforeEach, describe, expect, test } from "@jest/globals";
import { isExcludedType } from "./isExcludedType";

describe("isExludedType", () => {
  beforeEach(() => {
    // Remove any existing elements from document.body if needed
    document.body.innerHTML = "";
  });

  test("isExcludedType should return true for hidden input type", () => {
    const element: HTMLInputElement = { type: "hidden" } as HTMLInputElement;
    const result = isExcludedType(element);
    expect(result).toBe(true);
  });
  test("isExcludedType should return true for submit input type", () => {
    const element: HTMLInputElement = { type: "submit" } as HTMLInputElement;
    const result = isExcludedType(element);
    expect(result).toBe(true);
  });
  test("isExcludedType should return true for button type", () => {
    const element: HTMLInputElement = { type: "button" } as HTMLInputElement;
    const result = isExcludedType(element);
    expect(result).toBe(true);
  });
  test("isExcludedType should return true for fieldset input type", () => {
    const element: HTMLInputElement = { type: "fieldset" } as HTMLInputElement;
    const result = isExcludedType(element);
    expect(result).toBe(true);
  });
  test("isExcludedType should return false for other input types", () => {
    const element: HTMLInputElement = { type: "text" } as HTMLInputElement;
    const result = isExcludedType(element);
    expect(result).toBe(false);
  });
});
