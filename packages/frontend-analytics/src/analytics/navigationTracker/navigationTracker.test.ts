import { describe, expect, jest, test } from "@jest/globals";
import { NavigationTracker } from "./navigationTracker";
import * as pushToDataLayer from "../../utils/pushToDataLayerUtil/pushToDataLayer";
import { NavigationElement } from "./navigationTracker.interface";

window.DI = { analyticsGa4: { cookie: { consent: true } } };

describe("navigationTracker", () => {
  const enableNavigationTracking = true;
  const newInstance = new NavigationTracker(enableNavigationTracking);
  const action = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  jest.spyOn(pushToDataLayer, "pushToDataLayer");
  jest.spyOn(NavigationTracker.prototype, "trackNavigation");
  jest.spyOn(NavigationTracker.prototype, "initialiseEventListener");

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
    const containerElement = document.createElement("A");
    containerElement.className = "govuk-header__link";
    containerElement.appendChild(clickedElement);

    document.body.innerHTML = "<header></header>";
    const header = document.getElementsByTagName("header")[0];
    header.appendChild(containerElement);

    clickedElement.dispatchEvent(action);
    clickedElement.addEventListener("click", () => {
      expect(pushToDataLayer.pushToDataLayer).toBeCalled();
    });
  });

  test("should push data into data layer if click on logo icon within core", () => {
    const element = document.createElement("span");
    element.className = "govuk-header__logotype-crown";

    document.body.innerHTML = "<header></header>";
    const header = document.getElementsByTagName("header")[0];
    header.appendChild(element);

    element.dispatchEvent(action);
    element.addEventListener("click", () => {
      expect(pushToDataLayer.pushToDataLayer).toBeCalled();
    });
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
    const href = document.createElement("div");
    href.className = "govuk-footer__link";
    href.addEventListener("click", (event) => {
      expect(newInstance.trackNavigation(event)).toBe(false);
    });
    href.dispatchEvent(action);
  });

  test("trackNavigation should return true if a link", () => {
    document.body.innerHTML = `<header></header>
    <a id="testLink" class="govuk-footer__link" href="http://www.test.co.uk">Link to GOV.UK</a><footer></footer>`;
    const element = document.getElementById("testLink") as NavigationElement;
    element.addEventListener("click", (event) => {
      expect(newInstance.trackNavigation(event)).toBe(true);
    });
    element.dispatchEvent(action);
  });

  test("trackNavigation should return true if a navigation button", () => {
    document.body.innerHTML = "<header></header><footer></footer>";
    const href = document.createElement("BUTTON");
    href.setAttribute("data-nav", "true");
    href.setAttribute("data-link", "/next-url");
    href.innerHTML = "Continue";
    href.addEventListener("click", (event) => {
      expect(newInstance.trackNavigation(event)).toBe(true);
    });
    href.dispatchEvent(action);
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
    const href = document.createElement("A");
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
    jest.spyOn(NavigationTracker.prototype, "trackNavigation");
    window.DI.analyticsGa4.cookie.consent = false;
    const instance = new NavigationTracker(true);
    const href = document.createElement("A");
    href.className = "govuk-footer__link";
    href.addEventListener("click", () => {
      expect(instance.trackNavigation).toReturnWith(false);
    });
  });
});
