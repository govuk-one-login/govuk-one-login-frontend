import { describe, expect, jest, test, beforeEach } from "@jest/globals";
import { FormResponseTracker } from "./formResponseTracker";
import { FormEventInterface } from "../formTracker/formTracker.interface";
import * as pushToDataLayer from "../../utils/pushToDataLayer";

window.DI = { analyticsGa4: { cookie: { consent: true } } };

describe("form with multiple fields", () => {
  const action = new Event("submit", {
    bubbles: true,
    cancelable: true,
  });

  beforeEach(() => {
    // Remove any existing elements from document.body if needed
    document.body.innerHTML = "";
  });

  jest.spyOn(pushToDataLayer, "pushToDataLayer");

  test("trackFormResponse should return false if tracking is deactivated", () => {
    window.DI.analyticsGa4.cookie.consent = true;
    const isDataSensitive = false;
    const isPageSensitive = false;
    const enableFormResponseTracking = false;
    const instance = new FormResponseTracker(
      isDataSensitive,
      isPageSensitive,
      enableFormResponseTracking,
    );
    document.body.innerHTML =
      '<div id="main-content">' +
      '<form action="/test-url" method="post">' +
      '  <label for="username">test label username</label>' +
      '  <select id="username" name="username"><option value="test value">test value</option><option value="test value2" selected>test value2</option></select>' +
      '  <button id="button" type="submit">submit</button>' +
      "</form></div>";
    document.dispatchEvent(action);

    expect(instance.trackFormResponse).toReturnWith(false);
  });

  test("event fired and data layer defined for each of the fields", () => {
    const isDataSensitive = false;
    const isPageSensitive = false;
    const enableFormResponseTracking = true;
    const instance = new FormResponseTracker(
      isDataSensitive,
      isPageSensitive,
      enableFormResponseTracking,
    );
    document.body.innerHTML =
      '<div id="main-content">' +
      '<form action= "/test-url" method= "post">' +
      "<fieldset>" +
      "  <legend>checked section</legend>" +
      '  <label for="question-1">checked value</label>' +
      '  <input type="checkbox" id="question-1" name="question-1" value="checkedValue" checked/>' +
      '  <label for="question-2">checked value2</label>' +
      '  <input type="checkbox" id="question-2" name="question-1" value="checkedValue2" checked/>' +
      "</fieldset>" +
      '  <label for="region">dropdown section</label>' +
      '  <select id="region" name="region"><option value="test value">test value</option><option value="test value2" selected>test value2</option></select>' +
      '  <label for="username">text input section</label>' +
      '  <input type="text" id="username" name="username" value="test value"/>' +
      '  <label for="password">password input section</label>' +
      '  <input type="password" id="password" name="password" value="test gregre value"/>' +
      "<fieldset>" +
      "  <legend>radio section</legend>" +
      '  <label for="male">radio value</label>' +
      '  <input type="radio" id="male" name="radioGroup" value="radio value" checked/>' +
      '  <label for="female">radio value 2</label>' +
      '  <input type="radio" id="female" name="radioGroup" value="radio value 2"/>' +
      "</fieldset>" +
      '  <label for="feedback">textarea section</label>' +
      '  <textarea id="feedback" name="feedback" value="test value"/>test value</textarea>' +
      '  <button id="button" type="submit">submit</button>' +
      "</form></div>";
    document.dispatchEvent(action);

    const dataLayerEventCheckbox: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_response",
        type: "checkbox",
        url: "http://localhost/test-url",
        text: "checked value, checked value2",
        section: "checked section",
        action: "undefined",
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
        event_name: "form_response",
        type: "drop-down list",
        url: "http://localhost/test-url",
        text: "test value2",
        section: "dropdown section",
        action: "undefined",
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
        event_name: "form_response",
        type: instance.FREE_TEXT_FIELD_TYPE,
        url: "http://localhost/test-url",
        text: "undefined",
        section: "text input section",
        action: "undefined",
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
        event_name: "form_response",
        type: instance.FREE_TEXT_FIELD_TYPE,
        url: "http://localhost/test-url",
        text: "undefined",
        section: "password input section",
        action: "undefined",
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
        event_name: "form_response",
        type: "radio buttons",
        url: "http://localhost/test-url",
        text: "radio value",
        section: "radio section",
        action: "undefined",
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
        event_name: "form_response",
        type: instance.FREE_TEXT_FIELD_TYPE,
        url: "http://localhost/test-url",
        text: "undefined",
        section: "textarea section",
        action: "undefined",
        external: "false",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
      },
    };
    expect(pushToDataLayer.pushToDataLayer).toBeCalledWith(
      dataLayerEventCheckbox,
    );
    expect(pushToDataLayer.pushToDataLayer).toBeCalledWith(
      dataLayerEventDropdown,
    );
    expect(pushToDataLayer.pushToDataLayer).toBeCalledWith(dataLayerEventText);
    expect(pushToDataLayer.pushToDataLayer).toBeCalledWith(
      dataLayerEventPassword,
    );
    expect(pushToDataLayer.pushToDataLayer).toBeCalledWith(dataLayerEventRadio);
    expect(pushToDataLayer.pushToDataLayer).toBeCalledWith(
      dataLayerEventTextarea,
    );
  });
});

describe("FormResponseTracker", () => {
  new Event("submit", {
    bubbles: true,
    cancelable: true,
  });

  jest.spyOn(pushToDataLayer, "pushToDataLayer");
  jest.spyOn(FormResponseTracker.prototype, "initialiseEventListener");

  test("new instance should call initialiseEventListener", () => {
    const instance = new FormResponseTracker(true, true, true);
    expect(instance.initialiseEventListener).toBeCalled();
  });
});

describe("form with radio buttons", () => {
  const action = new Event("submit", {
    bubbles: true,
    cancelable: true,
  });

  jest.spyOn(pushToDataLayer, "pushToDataLayer");

  test("datalayer event should be defined as default", () => {
    const isDataSensitive = false;
    const isPageSensitive = false;
    const enableFormResponseTracking = true;
    new FormResponseTracker(
      isDataSensitive,
      isPageSensitive,
      enableFormResponseTracking,
    );
    document.body.innerHTML =
      '<div id="main-content">' +
      '<form action="/test-url" method="post">' +
      "<fieldset>" +
      "  <legend>test label questions</legend>" +
      '  <label for="male">test label male</label>' +
      '  <input type="radio" id="male" name="male" value="Male" checked/>' +
      '  <label for="female">test label female</label>' +
      '  <input type="radio" id="female" name="female" value="Male"/>' +
      "</fieldset>" +
      '  <button id="button" type="submit">submit</button>' +
      "</form></div>";
    document.dispatchEvent(action);

    const dataLayerEvent: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_response",
        type: "radio buttons",
        url: "http://localhost/test-url",
        text: "test label male",
        section: "test label questions",
        action: "undefined",
        external: "false",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
      },
    };
    expect(pushToDataLayer.pushToDataLayer).toBeCalledWith(dataLayerEvent);
  });

  test("datalayer event should redact information if data is flagged as sensitive", () => {
    const isDataSensitive = true;
    const isPageSensitive = false;
    const enableFormResponseTracking = true;
    new FormResponseTracker(
      isDataSensitive,
      isPageSensitive,
      enableFormResponseTracking,
    );

    document.body.innerHTML = `
      <div id="main-content">
        <form action="/test-url" method="post"> 
          <fieldset> 
            <legend>test label questions</legend> 
            <label for="male">test label male</label> 
              <input type="radio" id="male" name="male" value="Male" checked/> 
              <label for="female">test label female</label> 
              <input type="radio" id="female" name="female" value="Male"/> 
          </fieldset>
          <button id="button" type="submit">submit</button>
        </form>
      </div>
    `;
    document.dispatchEvent(action);

    const dataLayerEvent: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_response",
        type: "radio buttons",
        url: "http://localhost/test-url",
        text: "undefined",
        section: "test label questions",
        action: "undefined",
        external: "false",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
      },
    };
    expect(pushToDataLayer.pushToDataLayer).toBeCalledWith(dataLayerEvent);
  });
});

describe("form with input checkbox", () => {
  const action = new Event("submit", {
    bubbles: true,
    cancelable: true,
  });

  jest.spyOn(pushToDataLayer, "pushToDataLayer");

  test("datalayer event should be defined", () => {
    const isDataSensitive = false;
    const isPageSensitive = false;
    const enableFormResponseTracking = true;
    new FormResponseTracker(
      isDataSensitive,
      isPageSensitive,
      enableFormResponseTracking,
    );

    document.body.innerHTML = `
      <div id="main-content"> 
        <form action="/test-url" method="post"> 
          <fieldset> 
            <legend>test label questions</legend>"
            <label for="question-1">test value</label> 
            <input type="checkbox" id="question-1" name="question-1" value="testValue" checked/> 
            <label for="question-2">test value2</label> 
            <input type="checkbox" id="question-2" name="question-2" value="testValue2"/> 
          </fieldset>
          <button id="button" type="submit">submit</button>
        </form>
      </div>
    `;
    document.dispatchEvent(action);

    const dataLayerEvent: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_response",
        type: "checkbox",
        url: "http://localhost/test-url",
        text: "test value",
        section: "test label questions",
        action: "undefined",
        external: "false",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
      },
    };
    expect(pushToDataLayer.pushToDataLayer).toBeCalledWith(dataLayerEvent);
  });
});
describe("form with input text", () => {
  const action = new Event("submit", {
    bubbles: true,
    cancelable: true,
  });

  jest.spyOn(pushToDataLayer, "pushToDataLayer");

  test("datalayer event should be defined", () => {
    const isDataSensitive = false;
    const isPageSensitive = false;
    const enableFormResponseTracking = true;
    const instance = new FormResponseTracker(
      isDataSensitive,
      isPageSensitive,
      enableFormResponseTracking,
    );
    document.body.innerHTML =
      '<div id="main-content">' +
      '<form action="/test-url" method="post">' +
      '  <label for="username">test label username</label>' +
      '  <input type="text" id="username" name="username" value="test value"/>' +
      '  <button id="button" type="submit">submit</button>' +
      "</form></div>";
    document.dispatchEvent(action);

    const dataLayerEvent: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_response",
        type: instance.FREE_TEXT_FIELD_TYPE,
        url: "http://localhost/test-url",
        text: "undefined",
        section: "test label username",
        action: "undefined",
        external: "false",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
      },
    };
    expect(pushToDataLayer.pushToDataLayer).toBeCalledWith(dataLayerEvent);
  });
});

describe("form with input textarea", () => {
  const action = new Event("submit", {
    bubbles: true,
    cancelable: true,
  });

  jest.spyOn(pushToDataLayer, "pushToDataLayer");

  test("datalayer event should be defined", () => {
    const isDataSensitive = false;
    const isPageSensitive = false;
    const enableFormResponseTracking = true;
    const instance = new FormResponseTracker(
      isDataSensitive,
      isPageSensitive,
      enableFormResponseTracking,
    );
    document.body.innerHTML =
      '<div id="main-content">' +
      '<form action="/test-url" method="post">' +
      '  <label for="username">test label username</label>' +
      '  <textarea id="username" name="username" value="test value"/>test value</textarea>' +
      '  <button id="button" type="submit">submit</button>' +
      "</form></div>";
    document.dispatchEvent(action);

    const dataLayerEvent: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_response",
        type: instance.FREE_TEXT_FIELD_TYPE,
        url: "http://localhost/test-url",
        text: "undefined",
        section: "test label username",
        action: "undefined",
        external: "false",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
      },
    };
    expect(pushToDataLayer.pushToDataLayer).toBeCalledWith(dataLayerEvent);
  });
});

describe("form with dropdown", () => {
  const action = new Event("submit", {
    bubbles: true,
    cancelable: true,
  });

  jest.spyOn(pushToDataLayer, "pushToDataLayer");

  test("datalayer event should be defined", () => {
    const isDataSensitive = false;
    const isPageSensitive = false;
    const enableFormResponseTracking = true;
    new FormResponseTracker(
      isDataSensitive,
      isPageSensitive,
      enableFormResponseTracking,
    );
    document.body.innerHTML =
      '<div id="main-content">' +
      '<form action="/test-url" method="post">' +
      '  <label for="username">test label username</label>' +
      '  <select id="username" name="username"><option value="test value">test value</option><option value="test value2" selected>test value2</option></select>' +
      '  <button id="button" type="submit">submit</button>' +
      "</form></div>";
    document.dispatchEvent(action);

    const dataLayerEvent: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_response",
        type: "drop-down list",
        url: "http://localhost/test-url",
        text: "test value2",
        section: "test label username",
        action: "undefined",
        external: "false",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
      },
    };
    expect(pushToDataLayer.pushToDataLayer).toBeCalledWith(dataLayerEvent);
  });
});

describe("Cookie Management", () => {
  const action = new Event("submit", {
    bubbles: true,
    cancelable: true,
  });
  jest.spyOn(FormResponseTracker.prototype, "trackFormResponse");
  const instance = new FormResponseTracker(true, true, true);

  test("trackFormResponse should return false if not cookie consent", () => {
    window.DI.analyticsGa4.cookie.consent = false;
    document.body.innerHTML =
      '<div id="main-content">' +
      '<form action="/test-url" method="post">' +
      '  <label for="username">test label username</label>' +
      '  <select id="username" name="username"><option value="test value">test value</option><option value="test value2" selected>test value2</option></select>' +
      '  <button id="button" type="submit">submit</button>' +
      "</form></div>";
    document.dispatchEvent(action);

    expect(instance.trackFormResponse).toReturnWith(false);
  });
});

describe("cancel event if form is invalid", () => {
  const action = new Event("submit", {
    bubbles: true,
    cancelable: true,
  });
  jest.spyOn(FormResponseTracker.prototype, "trackFormResponse");
  const instance = new FormResponseTracker(true, true, true);

  test("trackFormResponse should return false if form is invalid", () => {
    window.DI.analyticsGa4.cookie.consent = true;
    document.body.innerHTML =
      '<div id="main-content">' +
      '<form action="/test-url" method="post">' +
      '  <label for="email">test label email</label>' +
      '  <input type="text" id="email" name="email" value=""/>' +
      '  <label for="username">test label username</label>' +
      '  <select id="username" name="username"><option value="test value">test value</option><option value="test value2" selected>test value2</option></select>' +
      '  <button id="button" type="submit">submit</button>' +
      "</form></div>";
    document.dispatchEvent(action);
    expect(instance.trackFormResponse).toReturnWith(false);
  });
});
