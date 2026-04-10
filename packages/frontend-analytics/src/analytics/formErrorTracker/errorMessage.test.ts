import { describe, expect, test, beforeEach } from "@jest/globals";
import { type FormField } from "../formTracker/formTracker.interface";
import { getErrorMessage } from "./errorMessage";

describe("FormErrorTracker - Error Message", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("getErrorMessage should return error message", () => {
    const formField: FormField = {
      id: "fieldId",
      name: "fieldName",
      value: "fieldValue",
      type: "text",
    };

    // Create error element
    const errorElement = document.createElement("p");
    errorElement.id = "fieldId-error";
    errorElement.textContent = "error: this is an  error message";
    document.body.appendChild(errorElement);
    // Create input element
    const input = document.createElement("input");
    input.id = formField.id;
    document.body.appendChild(input);
    expect(getErrorMessage(formField)).toBe("error: this is an  error message");
  });

  test("getErrorMessage should return parent field error message", () => {
    document.body.innerHTML = `
      <p id="fieldId-error">error: this is an error message</p>
      <input id="fieldId-day" />
    `;

    const formField: FormField = {
      id: "fieldId",
      name: "fieldName",
      value: "fieldValue",
      type: "text",
    };

    expect(getErrorMessage(formField)).toBe("error: this is an error message");
  });

  test("getErrorMessage should return parent field error message - when the id contains a hyphen", () => {
    document.body.innerHTML = `
      <p id="fieldId-error">error: this is an error message</p>
      <input id="fieldId-day" />
    `;

    const formField: FormField = {
      id: "fieldId-day",
      name: "fieldName",
      value: "fieldValue",
      type: "text",
    };

    expect(getErrorMessage(formField)).toBe("error: this is an error message");
  });

  test("getErrorMessage should return undefined , when there is no error message", () => {
    const formField: FormField = {
      id: "fieldId",
      name: "fieldName",
      value: "fieldValue",
      type: "text",
    };

    // Create input element
    const input = document.createElement("input");
    input.id = formField.id;
    document.body.appendChild(input);
    expect(getErrorMessage(formField)).toBe("undefined");
  });
});
