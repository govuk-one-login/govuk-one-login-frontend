import { FormField } from "../../formTracker.interface";
import { isFormValid } from "./isFormValid";

describe("isFormValid", () => {
  beforeEach(() => {
    // Remove any existing elements from document.body if needed
    document.body.innerHTML = "";
  });

  test("isFormValid should return false if field value is empty", () => {
    const fields: FormField[] = [
      { id: "test", name: "test", value: "", type: "textarea" },
    ];
    expect(isFormValid(fields)).toBe(false);
  });

  test("isFormValid should return true if field value is here", () => {
    const fields: FormField[] = [
      { id: "test", name: "test", value: "testtest", type: "textarea" },
    ];
    expect(isFormValid(fields)).toBe(true);
  });

  test("isFormValid should return false if one of the required field values is empty", () => {
    const fields: FormField[] = [
      { id: "test", name: "test", value: "", type: "textarea" },
      { id: "test2", name: "test2", value: "test2", type: "checkbox" },
    ];
    expect(isFormValid(fields)).toBe(false);
  });

  test("isFormValid should return true if all field values are here", () => {
    const fields: FormField[] = [
      { id: "test", name: "test", value: "test1", type: "textarea" },
      { id: "test2", name: "test2", value: "test2", type: "checkbox" },
    ];
    expect(isFormValid(fields)).toBe(true);
  });

  test("isFormValid should return true if an optional field is empty", () => {
    const fields: FormField[] = [
      { id: "test", name: "test", value: "", type: "textarea", optional: true },
    ];
    expect(isFormValid(fields)).toBe(true);
  });

  test("isFormValid should return true when required fields have values and optional fields are empty", () => {
    const fields: FormField[] = [
      { id: "test", name: "test", value: "answer", type: "radio" },
      { id: "test2", name: "test2", value: "", type: "textarea", optional: true },
    ];
    expect(isFormValid(fields)).toBe(true);
  });

  test("isFormValid should return false when a required field is empty alongside an optional field", () => {
    const fields: FormField[] = [
      { id: "test", name: "test", value: "", type: "text" },
      { id: "test2", name: "test2", value: "", type: "textarea", optional: true },
    ];
    expect(isFormValid(fields)).toBe(false);
  });

  test("isFormValid should return true when all optional fields are empty", () => {
    const fields: FormField[] = [
      { id: "test", name: "test", value: "", type: "text", optional: true },
      { id: "test2", name: "test2", value: "", type: "textarea", optional: true },
    ];
    expect(isFormValid(fields)).toBe(true);
  });

  test("isFormValid should treat fields without optional property as required", () => {
    const fields: FormField[] = [
      { id: "test", name: "test", value: "", type: "text" },
    ];
    expect(isFormValid(fields)).toBe(false);
  });

  test("isFormValid should treat optional: false as required", () => {
    const fields: FormField[] = [
      { id: "test", name: "test", value: "", type: "text", optional: false },
    ];
    expect(isFormValid(fields)).toBe(false);
  });
});
