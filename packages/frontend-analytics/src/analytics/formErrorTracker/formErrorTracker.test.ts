import { describe, expect, jest, test, beforeEach } from "@jest/globals";
import * as FormErrorTracker from "./formErrorTracker";
import { FormEventInterface } from "../formTracker/formTracker.interface";
import * as pushToDataLayer from "../../utils/pushToDataLayerUtil/pushToDataLayer";
import { acceptCookies, rejectCookies } from "../../../test/utils";

const FREE_TEXT_FIELD_TYPE = "free text field";

window.DI = { analyticsGa4: { cookie: { consent: true } } };

describe("FormErrorTracker", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });
  jest.spyOn(pushToDataLayer, "pushToDataLayer");
  jest.spyOn(FormErrorTracker, "trackFormError");

  test("trackFormError should return false if not cookie consent", () => {
    rejectCookies();

    FormErrorTracker.trackFormError(true);

    expect(pushToDataLayer.pushToDataLayer).not.toHaveBeenCalled();
  });

  test("form error tracker should define a DL for each field in form", () => {
    acceptCookies();
    document.body.innerHTML =
      '<div id="main-content">' +
      '<form action="/test-url" method="post">' +
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
      '<div class="govuk-form-group govuk-form-group--error">' +
      '  <label for="password">password input section</label>' +
      '  <p id="password-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Please give us your password</p>' +
      '  <input type ="password" id="password" name="password" /></input>' +
      "</div>" +
      '  <button id="button" type="submit">submit</button>' +
      "</form>" +
      "</div>";

    const dataLayerEventCheckbox: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_error",
        type: "checkbox",
        url: "http://localhost/test-url",
        text: "error: select one checkbox",
        section: "checked section",
        action: "error",
        external: "false",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
      },
    };
    const dataLayerEventDropdown: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_error",
        type: "drop-down list",
        url: "http://localhost/test-url",
        text: "error: select one option from dropdown",
        section: "dropdown section",
        action: "error",
        external: "false",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
      },
    };
    const dataLayerEventRadio: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_error",
        type: "radio buttons",
        url: "http://localhost/test-url",
        text: "error: select one radio option",
        section: "radio section",
        action: "error",
        external: "false",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
      },
    };
    const dataLayerEventTextarea: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_error",
        type: FREE_TEXT_FIELD_TYPE,
        url: "http://localhost/test-url",
        text: "error: please give us your feedback",
        section: "textarea section",
        action: "error",
        external: "false",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
      },
    };
    const dataLayerEventText: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_error",
        type: FREE_TEXT_FIELD_TYPE,
        url: "http://localhost/test-url",
        text: "error: please give us your email",
        section: "text input section",
        action: "error",
        external: "false",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
      },
    };

    const dataLayerEventPassword: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_error",
        type: FREE_TEXT_FIELD_TYPE,
        url: "http://localhost/test-url",
        text: "error: please give us your password",
        section: "password input section",
        action: "error",
        external: "false",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
      },
    };
    FormErrorTracker.trackFormError(true);

    expect(pushToDataLayer.pushToDataLayer).toBeCalledWith(
      dataLayerEventDropdown,
    );
    expect(pushToDataLayer.pushToDataLayer).toBeCalledWith(dataLayerEventRadio);
    expect(pushToDataLayer.pushToDataLayer).toBeCalledWith(
      dataLayerEventTextarea,
    );
    expect(pushToDataLayer.pushToDataLayer).toBeCalledWith(dataLayerEventText);
    expect(pushToDataLayer.pushToDataLayer).toBeCalledWith(
      dataLayerEventPassword,
    );
    expect(pushToDataLayer.pushToDataLayer).toBeCalledWith(
      dataLayerEventCheckbox,
    );
  });

  test("datalayer event should be defined", () => {
    acceptCookies();

    document.body.innerHTML =
      '<div id="main-content">' +
      '<form action="/test-url" method="post">' +
      '<div class="govuk-form-group govuk-form-group--error">' +
      "<fieldset>" +
      "  <legend>test label questions</legend>" +
      '  <p id="organisationType-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Select one option</p>' +
      '  <label for="organisationType">test label question 1</label>' +
      '  <input type="checkbox" id="organisationType" name="organisationType" value="test value" checked/>' +
      '  <label for="organisationType-2">test label question 2</label>' +
      '  <input type="checkbox" id="organisationType-2" name="organisationType2" value="test value"/>' +
      "</fieldset>" +
      "</div>" +
      '  <button id="button" type="submit">submit</button>' +
      "</form>" +
      "</div>";

    const dataLayerEvent: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_error",
        type: "checkbox",
        url: "http://localhost/test-url",
        text: "error: select one option",
        section: "test label questions",
        action: "error",
        external: "false",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
      },
    };

    FormErrorTracker.trackFormError(true);
    expect(pushToDataLayer.pushToDataLayer).toBeCalledWith(dataLayerEvent);
  });
});
