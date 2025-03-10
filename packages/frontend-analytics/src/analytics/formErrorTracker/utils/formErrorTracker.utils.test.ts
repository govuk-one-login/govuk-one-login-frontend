import { FormField } from "../../../utils/formUtils/formTracker.interface";
import { getErrorMessage, getErrorFields } from "./formErrorTracker.utils";

describe("formErrorTracker utils", () => {
  // TODO: fix bleeding tests
  describe("getErrorMessage", () => {
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
      expect(getErrorMessage(formField)).toBe(
        "error: this is an  error message",
      );
    });

    test("getErrorMessage should return parent field error message", () => {
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
      input.id = `${formField.id}-day`;
      document.body.appendChild(input);
      expect(getErrorMessage(formField)).toBe(
        "error: this is an  error message",
      );
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
  describe("getErrorFields", () => {
    test("getErrorFields should return an array of the first field in each form group in a form that have an error message", () => {
      const form = document.createElement("form");
      form.innerHTML =
        '<div class="govuk-form-group govuk-form-group--error">' +
        "<fieldset>" +
        "  <legend>checked section</legend>" +
        '  <label for="questionType">checked value</label>' +
        '  <p id="questionType-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Select one checkbox</p>' +
        '  <input type="checkbox" id="questionType" name="questionType" value="checkedValue" />' +
        '  <label for="questionType-2">checked value2</label>' +
        '  <input type="checkbox" id="questionType-2" name="questionType" value="checkedValue2" />' +
        "</fieldset>" +
        "</div>" +
        '<div class="govuk-form-group govuk-form-group--error">' +
        '  <label for="region">dropdown section</label>' +
        '  <p id="region-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Select one option from dropdown</p>' +
        '  <select id="region" name="Region"><option value="test value">test value</option><option value="test value2" >test value2</option></select>' +
        "</div>" +
        '<div class="govuk-form-group govuk-form-group--error">' +
        "<fieldset>" +
        "  <legend>radio section</legend>" +
        '  <p id="male-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Select one radio option </p>' +
        '  <label for="male">radio value</label>' +
        '  <input type="radio" id="male" name="radioGroup" value="radio value"/>' +
        '  <label for="female">radio value 2</label>' +
        '  <input type="radio" id="female" name="radioGroup" value="radio value 2"/>' +
        "</fieldset>" +
        "</div>" +
        '<div class="govuk-form-group govuk-form-group--error">' +
        '  <label for="feedback">textarea section</label>' +
        '  <p id="feedback-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Please give us your feedback</p>' +
        '  <textarea id="feedback" name="Feedback" /></textarea>' +
        "</div>" +
        '<div class="govuk-form-group govuk-form-group--error">' +
        '  <label for="email">text input section</label>' +
        '  <p id="email-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Please give us your email</p>' +
        '  <input type ="text" id="email" name="Email" /></input>' +
        "</div>" +
        '  <button id="button" type="submit">submit</button>';
      document.body.appendChild(form);
      expect(getErrorFields()).toEqual([
        {
          id: "questionType",
          name: "questionType",
          value: "checkedValue",
          type: "checkbox",
        },
        {
          id: "region",
          name: "Region",
          value: "test value",
          type: "select-one",
        },
        {
          id: "male",
          name: "radioGroup",
          value: "radio value",
          type: "radio",
        },
        {
          id: "feedback",
          name: "Feedback",
          value: "",
          type: "textarea",
        },
        {
          id: "email",
          name: "Email",
          value: "",
          type: "text",
        },
      ]);
    });
  });
});
