import { NavigationTracker } from "./navigationTracker";
import * as pushToDataLayer from "../../utils/pushToDataLayerUtil/pushToDataLayer";
import { NavigationElement } from "./navigationTracker.interface";
import { acceptCookies, rejectCookies } from "../../../test/utils";

describe("navigationTracker", () => {
  const enableNavigationTracking = true;
  const newInstance = new NavigationTracker(enableNavigationTracking);
  const action = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  const spies = [
    vi.spyOn(pushToDataLayer, "pushToDataLayer"),
    vi.spyOn(NavigationTracker.prototype, "trackNavigation"),
    vi.spyOn(NavigationTracker.prototype, "initialiseEventListener"),
  ];

  beforeEach(() => {
    acceptCookies();
    spies.forEach((spy) => spy.mockClear());
  });

  test("new instance should call initialiseEventListener", () => {
    new NavigationTracker(true);
    expect(newInstance.initialiseEventListener).toBeCalled();
  });

  test("click should call trackNavigation", () => {
    const href = document.createElement("A");
    href.className = "govuk-footer__link";
    href.innerHTML = "Link to GOV.UK";
    href.addEventListener("click", () => {
      expect(newInstance.trackNavigation).toBeCalled();
    });
  });

  test("should push data into data layer if click on logo icon", () => {
    const clickedElement = document.createElement("svg");
    const containerElement = document.createElement("A") as HTMLAnchorElement;
    containerElement.className = "govuk-header__link";
    containerElement.href = "http://localhost:3000";
    containerElement.appendChild(clickedElement);

    document.body.innerHTML = "<header></header>";
    const header = document.getElementsByTagName("header")[0];
    header.appendChild(containerElement);

    clickedElement.dispatchEvent(action);
    expect(pushToDataLayer.pushToDataLayer).toBeCalled();
  });

  test("should push data into data layer if click on logo icon within core", () => {
    document.body.innerHTML = `<header><a class="govuk-header__link" href="http://localhost:3000"><span class="govuk-header__logotype-crown" id="crownSpan"></span></a></header>`;
    const element = document.getElementById("crownSpan") as HTMLElement;

    element.dispatchEvent(action);
    expect(pushToDataLayer.pushToDataLayer).toBeCalled();
  });

  test("trackNavigation return false if tracker is deactivated", () => {
    const instance = new NavigationTracker(false);
    const href = document.createElement("BUTTON");
    href.setAttribute("data-nav", "true");
    href.setAttribute("data-link", "/next-url");
    href.innerHTML = "Continue";
    href.addEventListener("click", (event) => {
      expect(instance.trackNavigation(event)).toBe(false);
    });
    href.dispatchEvent(action);
  });

  test("trackNavigation should return false if not a link or a button", () => {
    document.body.innerHTML = `<div id="testDiv" class="govuk-footer__link">Not a link</div>`;
    const element = document.getElementById("testDiv") as HTMLElement;
    element.dispatchEvent(action);
    expect(pushToDataLayer.pushToDataLayer).not.toBeCalled();
  });

  test("trackNavigation should return false for plain text in a dd element (summary list value)", () => {
    document.body.innerHTML = `
      <dl class="govuk-summary-list">
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">Expiry date</dt>
          <dd class="govuk-summary-list__value" id="dateValue">24 08 2026</dd>
        </div>
      </dl>`;
    const element = document.getElementById("dateValue") as HTMLElement;
    element.dispatchEvent(action);
    expect(pushToDataLayer.pushToDataLayer).not.toBeCalled();
  });

  test("trackNavigation should return false for clicks on non-link text elements", () => {
    document.body.innerHTML = `<p id="textParagraph">Some plain text content</p>`;
    const element = document.getElementById("textParagraph") as HTMLElement;
    element.dispatchEvent(action);
    expect(pushToDataLayer.pushToDataLayer).not.toBeCalled();
  });

  test("trackNavigation should return true if a link is clicked directly", () => {
    document.body.innerHTML = `<header></header>
    <a id="testLink" class="govuk-footer__link" href="http://www.test.co.uk">Link to GOV.UK</a><footer></footer>`;
    const element = document.getElementById("testLink") as NavigationElement;
    element.dispatchEvent(action);
    expect(pushToDataLayer.pushToDataLayer).toBeCalled();
  });

  test("trackNavigation should return true if a child of a link is clicked", () => {
    document.body.innerHTML = `<header></header>
    <a id="testLink" class="govuk-footer__link" href="http://www.test.co.uk"><span id="innerSpan">Link text</span></a><footer></footer>`;
    const innerElement = document.getElementById("innerSpan") as HTMLElement;
    innerElement.dispatchEvent(action);
    expect(pushToDataLayer.pushToDataLayer).toBeCalled();
  });

  test("trackNavigation should return true if a navigation button is clicked", () => {
    document.body.innerHTML = "<header></header><footer></footer>";
    const href = document.createElement("BUTTON");
    href.setAttribute("data-nav", "true");
    href.setAttribute("data-link", "/next-url");
    href.innerHTML = "Continue";
    document.body.appendChild(href);
    href.dispatchEvent(action);
    expect(pushToDataLayer.pushToDataLayer).toBeCalled();
  });

  test("trackNavigation should return false if not a navigation button", () => {
    document.body.innerHTML = "<header></header><footer></footer>";
    const href = document.createElement("BUTTON");
    href.innerHTML = "Continue";
    href.addEventListener("click", (event) => {
      expect(newInstance.trackNavigation(event)).toBe(false);
    });
    href.dispatchEvent(action);
  });

  test("trackNavigation should return false if it is a change link", () => {
    document.body.innerHTML = "<div></div>";
    const href = document.createElement("A") as HTMLAnchorElement;
    href.innerHTML = "Change answer";
    href.setAttribute("href", "http://localhost?edit=true");
    href.addEventListener("click", (event) => {
      expect(newInstance.trackNavigation(event)).toBe(false);
    });
    href.dispatchEvent(action);
  });

  test("pushToDataLayer is not called without a href", () => {
    const element = document.createElement("A");
    element.className = "govuk-footer__link";
    element.addEventListener("click", (event) => {
      newInstance.trackNavigation(event);
    });
    element.dispatchEvent(action);
    expect(pushToDataLayer.pushToDataLayer).not.toBeCalled();
  });
});

describe("Cookie Management", () => {
  test("trackNavigation should return false if not cookie consent", () => {
    vi.spyOn(NavigationTracker.prototype, "trackNavigation");
    rejectCookies();
    const instance = new NavigationTracker(true);
    const href = document.createElement("A");
    href.className = "govuk-footer__link";
    href.addEventListener("click", () => {
      expect(instance.trackNavigation).toReturnWith(false);
    });
  });
});
