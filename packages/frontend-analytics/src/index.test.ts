import "./index";
import { type FormEventInterface } from "./analytics/formTracker/formTracker.interface";
import * as pushToDataLayer from "./utils/pushToDataLayerUtil/pushToDataLayer";
import { acceptCookies } from "../test/utils";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    DI: any;
  }
}

const action = new Event("submit", {
  bubbles: true,
  cancelable: true,
});

describe("appInit", () => {
  it("should redact data by default if isPageDataSensitive is unset", () => {
    acceptCookies();

    jest.spyOn(pushToDataLayer, "pushToDataLayer");

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

    window.DI.appInit({}, { enableGa4Tracking: true, isDataSensitive: false });

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

    expect(pushToDataLayer.pushToDataLayer).toHaveBeenNthCalledWith(
      2,
      dataLayerEvent,
    );
  });
});
