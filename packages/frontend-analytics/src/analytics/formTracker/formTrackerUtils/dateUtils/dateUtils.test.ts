import { beforeEach, describe, expect, test } from "@jest/globals";
import { combineDateFields, isDateFields } from "./dateUtils";
import { FormField } from "../../formTracker.interface";

describe("dateUtils", () => {
  beforeEach(() => {
    // Remove any existing elements from document.body if needed
    document.body.innerHTML = "";
  });

  test("isDateFields should return true if date fields are present", () => {
    const formFields: FormField[] = [
      {
        id: "fieldId-day",
        name: "fieldId-day",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId-month",
        name: "fieldId-month",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId-year",
        name: "fieldId-year",
        value: "2000",
        type: "text",
      },
    ];
    expect(isDateFields(formFields)).toBe(true);
  });
  test("isDateFields should return true if date fields are present", () => {
    const formFields: FormField[] = [
      {
        id: "fieldId-day",
        name: "fieldId-day",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId-month",
        name: "fieldId-month",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId-year",
        name: "fieldId-year",
        value: "2000",
        type: "text",
      },
      {
        id: "fieldname",
        name: "fieldname",
        value: "myname",
        type: "text",
      },
      {
        id: "fieldId2-day",
        name: "fieldId2-day",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId2-month",
        name: "fieldId2-month",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId2-year",
        name: "fieldId2-year",
        value: "2000",
        type: "text",
      },
    ];
    expect(isDateFields(formFields)).toBe(true);
  });
  test("isDateFields should return false if date fields are not present", () => {
    const formFields: FormField[] = [
      {
        id: "fieldId",
        name: "fieldId",
        value: "test",
        type: "text",
      },
    ];
    expect(isDateFields(formFields)).toBe(false);
  });
  test("combineDateFields should return 1 specific formField from date fields", () => {
    const formFields: FormField[] = [
      {
        id: "fieldId-day",
        name: "fieldId-day",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId-month",
        name: "fieldId-month",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId-year",
        name: "fieldId-year",
        value: "2000",
        type: "text",
      },
    ];

    const result: FormField[] = [
      {
        id: "fieldId-day",
        name: "fieldId",
        value: "01-01-2000",
        type: "date",
      },
    ];
    expect(combineDateFields(formFields)).toStrictEqual(result);
  });
  test("combineDateFields should return 2 formFields from date fields", () => {
    const formFields: FormField[] = [
      {
        id: "fieldId-day",
        name: "fieldId-day",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId-month",
        name: "fieldId-month",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId-year",
        name: "fieldId-year",
        value: "2000",
        type: "text",
      },
      {
        id: "fieldId2-day",
        name: "fieldId2-day",
        value: "02",
        type: "text",
      },
      {
        id: "fieldId2-month",
        name: "fieldId2-month",
        value: "02",
        type: "text",
      },
      {
        id: "fieldId2-year",
        name: "fieldId2-year",
        value: "2002",
        type: "text",
      },
    ];

    const result: FormField[] = [
      {
        id: "fieldId-day",
        name: "fieldId",
        value: "01-01-2000",
        type: "date",
      },
      {
        id: "fieldId2-day",
        name: "fieldId2",
        value: "02-02-2002",
        type: "date",
      },
    ];
    expect(combineDateFields(formFields)).toStrictEqual(result);
  });
});
