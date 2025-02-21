import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import * as formChangeTracker from "./formChangeTracker";
import * as pushToDataLayer from "../../utils/pushToDataLayer";
import { getSection } from "../../utils/dataScrapers";

function createForm() {
  document.body.innerHTML = `
    <main id="main-content">
      <form>
        <a id="change_link" href="http://localhost?edit=true">Change</a>
      </form>
    </main>
  `;

  return {
    changeLink: document.getElementById("change_link")!,
    form: document.getElementsByTagName("form")[0],
  };
}

describe("FormChangeTracker", () => {
  const action: MouseEvent = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  beforeEach(() => {
    jest.clearAllMocks();

    window.DI = { analyticsGa4: { cookie: { consent: true } } };

    jest.spyOn(pushToDataLayer, "pushToDataLayer");
    jest.spyOn(formChangeTracker, "FormChangeTracker");
  });

  test("should not call pushToDataLayer if enableFormChangeTracking is false", () => {
    formChangeTracker.FormChangeTracker(false);
    expect(pushToDataLayer.pushToDataLayer).not.toBeCalled();
  });

  test("should call pushToDataLayer if enableFormChangeTracking is true", () => {
    formChangeTracker.FormChangeTracker(true);
    const { changeLink } = createForm();
    changeLink.dispatchEvent(action);

    expect(pushToDataLayer.pushToDataLayer).toBeCalledWith({
      event: "event_data",
      event_data: {
        action: "change response",
        event_name: "form_change_response",
        external: "false",
        link_domain: "http://localhost",
        "link_path_parts.1": "/",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
        section: "undefined",
        text: "change",
        type: "undefined",
        url: "http://localhost/?edit=true",
      },
    });
  });

  test("should not call pushToDataLayer if cookie consent is false", () => {
    window.DI.analyticsGa4.cookie.consent = false;
    const { changeLink } = createForm();
    changeLink.dispatchEvent(action);
    expect(pushToDataLayer.pushToDataLayer).not.toHaveBeenCalled();
  });

  test("should not call pushToDataLayer if event is not from a change link", () => {
    const { form } = createForm();

    const href = document.createElement("div");
    href.className = "govuk-footer__link";
    form.appendChild(href);

    href.dispatchEvent(action);

    expect(pushToDataLayer.pushToDataLayer).not.toHaveBeenCalled();
  });

  test("should call pushToDataLayer if event is from a change link", () => {
    const { changeLink } = createForm();
    changeLink.dispatchEvent(action);
    expect(pushToDataLayer.pushToDataLayer).toHaveBeenCalled();
  });

  test("should not call pushToDataLayer if event is not from a Lang Toggle link", () => {
    const { changeLink } = createForm();
    changeLink.setAttribute("hreflang", "en");
    changeLink.dispatchEvent(action);
    expect(pushToDataLayer.pushToDataLayer).not.toHaveBeenCalled();
  });

  // TODO: Move to utils test file
  test("should return 'undefined' if parent element does not exist", () => {
    document.body.innerHTML = `<a id="change_link" href="http://localhost?edit=true">Change</a>`;
    const href = document.getElementById("change_link") as HTMLAnchorElement;
    expect(getSection(href)).toBe("undefined");
  });

  test("should return text content of sibling with class 'govuk-summary-list__key'", () => {
    document.body.innerHTML = `
    <div class="govuk-summary-list__key">Expected Section</div>
    <div>
      <a id="change_link">Change</a>
    </div>
  `;
    const href = document.getElementById("change_link") as HTMLAnchorElement;
    expect(getSection(href)).toBe("Expected Section");
  });

  test("should check and return text content of parent element if no matching sibling found", () => {
    document.body.innerHTML = `  
    <div>
    Postcode
      <a id="change_link">Change</a> 
    </div>
  `;
    const href = document.getElementById("change_link") as HTMLAnchorElement;
    expect(getSection(href)).toBe("Postcode");
  });

  test("should return 'undefined' if no matching sibling found and parent has no text content", () => {
    document.body.innerHTML = `
      <div>
        <a id="change_link">Change</a>
      </div>
    `;
    const href = document.getElementById("change_link") as HTMLAnchorElement;

    expect(getSection(href)).toBe("undefined");
  });

  test("should return 'undefined' if summary list key has no text content", () => {
    document.body.innerHTML = `
    <div class="govuk-summary-list__key"></div>
    <div>
      <a id="change_link">Change</a>
    </div>
  `;
    const href = document.getElementById("change_link") as HTMLAnchorElement;
    expect(getSection(href)).toBe("undefined");
  });
});
