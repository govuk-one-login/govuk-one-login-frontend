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

  test("isFormValid should return false if one of the field value is empty", () => {
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
});
