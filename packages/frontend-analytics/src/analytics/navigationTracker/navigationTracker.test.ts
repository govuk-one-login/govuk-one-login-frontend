import { describe, expect, jest, test } from "@jest/globals";
import { NavigationTracker } from "./navigationTracker";
import * as pushToDataLayer from "../../utils/pushToDataLayer";
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

describe("getLinkType", () => {
  new NavigationTracker(true);
  const action = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  test('should return "footer" when the element is an <a> tag within the footer tag', () => {
    const href = document.createElement("A");
    href.className = "govuk-footer__link";
    href.dispatchEvent(action);
    document.body.innerHTML = "<header></header><footer></footer>";
    const footer = document.getElementsByTagName("footer")[0];
    footer.appendChild(href);
    const element = action.target as NavigationElement;
    expect(NavigationTracker.getLinkType(element)).toBe("footer");
  });

  test('should return "header menu bar" when the element is an <a> tag within the phase banner', () => {
    const href = document.createElement("A");
    href.className = "govuk-link";
    href.dispatchEvent(action);
    document.body.innerHTML = "<div class='govuk-phase-banner'></div>";
    const phaseBanner =
      document.getElementsByClassName("govuk-phase-banner")[0];
    phaseBanner.appendChild(href);
    const element = action.target as NavigationElement;
    expect(NavigationTracker.getLinkType(element)).toBe("header menu bar");
  });

  test('should return "header menu bar" when the element is an <a> tag within the header tag', () => {
    const href = document.createElement("A");
    href.className = "header__navigation";
    href.dispatchEvent(action);
    document.body.innerHTML = "<header></header><footer></footer>";
    const header = document.getElementsByTagName("header")[0];
    header.appendChild(href);
    const element = action.target as NavigationElement;
    expect(NavigationTracker.getLinkType(element)).toBe("header menu bar");
  });

  test('should return "generic link" when the element is an <a> tag which is not inside the footer or header tags', () => {
    const href = document.createElement("A");
    href.className = "other-link";
    href.dispatchEvent(action);
    const element = action.target as NavigationElement;
    document.body.innerHTML = "<header></header><footer></footer>";
    expect(NavigationTracker.getLinkType(element)).toBe("generic link");
  });

  test('should return "generic button" when the element is a has a tag and button classname', () => {
    const button = document.createElement("A");
    button.className = "govuk-button";
    button.dispatchEvent(action);
    const element = action.target as NavigationElement;
    expect(NavigationTracker.getLinkType(element)).toBe("generic button");
  });

  test('should return "generic button" when the element is a button', () => {
    const button = document.createElement("BUTTON");
    button.setAttribute("data-nav", "true");
    button.setAttribute("data-link", "/next-url");
    button.dispatchEvent(action);
    const element = action.target as NavigationElement;
    expect(NavigationTracker.getLinkType(element)).toBe("generic button");
  });
});

describe("isExternalLink", () => {
  new NavigationTracker(true);

  test("should return false for internal links", () => {
    const url = "http://account.gov.uk";
    expect(NavigationTracker.isExternalLink(url)).toBe(false);
  });

  test("should return false for signin account links", () => {
    const url = "http://signin.account.gov.uk/cookies";
    expect(NavigationTracker.isExternalLink(url)).toBe(false);
  });

  test("should return false for signin account links in staging", () => {
    const url = "http://signin.staging.account.gov.uk/cookies";
    expect(NavigationTracker.isExternalLink(url)).toBe(false);
  });

  test("should return true for external links", () => {
    const url = "https://google.com";
    expect(NavigationTracker.isExternalLink(url)).toBe(true);
  });
});

describe("isHeaderMenuBarLink", () => {
  new NavigationTracker(true);

  test("should return true if link is inside the header tag", () => {
    document.body.innerHTML = `<header><a id="testLink">Link to GOV.UK</a></header>`;
    const element = document.getElementById("testLink") as NavigationElement;
    expect(NavigationTracker.isHeaderMenuBarLink(element)).toBe(true);
  });

  test("should return true if link is inside the nav tag", () => {
    document.body.innerHTML = `<nav><a id="testLink">Link to GOV.UK</a></nav>`;
    const element = document.getElementById("testLink") as NavigationElement;
    expect(NavigationTracker.isHeaderMenuBarLink(element)).toBe(true);
  });

  test("should return false if link is not inside the header or nav tag", () => {
    document.body.innerHTML = `<div><a id="testLink">Link to GOV.UK</a></div>`;
    const element = document.getElementById("testLink") as NavigationElement;
    expect(NavigationTracker.isHeaderMenuBarLink(element)).toBe(false);
  });
});

describe("isFooterLink", () => {
  new NavigationTracker(true);

  test("should return true if link is inside the footer tag", () => {
    document.body.innerHTML = `<footer><a id="testLink2">Link to GOV.UK</a></footer>`;
    const element = document.getElementById("testLink2") as NavigationElement;
    expect(NavigationTracker.isFooterLink(element)).toBe(true);
  });

  test("should return true if link is not inside the footer tag", () => {
    document.body.innerHTML = `<footer></footer><a id="testLink2">Link to GOV.UK</a>`;
    const element = document.getElementById("testLink2") as NavigationElement;
    expect(NavigationTracker.isFooterLink(element)).toBe(false);
  });
});

describe("isBackLink", () => {
  new NavigationTracker(true);

  test("should return true if link is a back button", () => {
    document.body.innerHTML = `<a id="testLink3" href="/welcome" class="govuk-back-link">Back</a>`;
    const element = document.getElementById("testLink3") as NavigationElement;
    expect(NavigationTracker.isBackLink(element)).toBe(true);
  });

  test("should return false if link is not a back button", () => {
    document.body.innerHTML = `<a id="testLink3" href="/welcome" class="govuk-random-link">Back</a>`;
    const element = document.getElementById("testLink3") as NavigationElement;
    expect(NavigationTracker.isBackLink(element)).toBe(false);
  });
});

describe("getSection", () => {
  new NavigationTracker(true);
  const action = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  test("it should return undefined if section is not defined", () => {
    document.body.innerHTML = `<body><a id="testLink1">Link to GOV.UK</a></body>`;
    const element = document.getElementById("testLink1") as NavigationElement;
    expect(NavigationTracker.getSection(element)).toBe("undefined");
  });

  test("it should return logo when a link is clicked in the logo", () => {
    document.body.innerHTML = `<header><a id="testAnchor" href="http://localhost:3000">
      <span class="govuk-header__logotype"></span></header>
      </a>`;
    const element = document.getElementById("testAnchor") as NavigationElement;
    element.dispatchEvent(action);
    element.addEventListener("click", () => {
      expect(NavigationTracker.getSection(element)).toBe("logo");
    });
  });

  test("it should return phase banner when a link is clicked in the phase banner", () => {
    const href = document.createElement("A");
    href.className = "govuk-link";
    href.dispatchEvent(action);
    document.body.innerHTML = "<div class='govuk-phase-banner'></div>";
    const phaseBanner =
      document.getElementsByClassName("govuk-phase-banner")[0];
    phaseBanner.appendChild(href);
    const element = action.target as NavigationElement;
    expect(NavigationTracker.getSection(element)).toBe("phase banner");
  });

  test("it should return menu links when a link is clicked in the header", () => {
    const href = document.createElement("A");
    href.className = "govuk-link";
    href.dispatchEvent(action);
    document.body.innerHTML = "<header></header>";
    const header = document.getElementsByTagName("header")[0];
    header.appendChild(href);
    const element = action.target as NavigationElement;
    expect(NavigationTracker.getSection(element)).toBe("menu links");
  });

  test("it should return support links when a link is clicked in the support links", () => {
    const href = document.createElement("A");
    href.className = "govuk-link";
    href.dispatchEvent(action);
    document.body.innerHTML = "<div class='govuk-footer__inline-list'></div>";
    const footerInlineList = document.getElementsByClassName(
      "govuk-footer__inline-list",
    )[0];
    footerInlineList.appendChild(href);
    const element = action.target as NavigationElement;
    expect(NavigationTracker.getSection(element)).toBe("support links");
  });

  test("it should return licence links when a link is clicked in the licence link", () => {
    const href = document.createElement("A");
    href.className = "govuk-link";
    href.dispatchEvent(action);
    document.body.innerHTML =
      "<span class='govuk-footer__licence-description'></span>";
    const licence = document.getElementsByClassName(
      "govuk-footer__licence-description",
    )[0];
    licence.appendChild(href);
    const element = action.target as NavigationElement;
    expect(NavigationTracker.getSection(element)).toBe("licence");
  });

  test("it should return copyright when a link is clicked on copyright image", () => {
    const href = document.createElement("A");
    href.className = "govuk-link";
    href.dispatchEvent(action);
    document.body.innerHTML =
      "<span class='govuk-footer__copyright-logo'></span>";
    const copyright = document.getElementsByClassName(
      "govuk-footer__copyright-logo",
    )[0];
    copyright.appendChild(href);
    const element = action.target as NavigationElement;
    expect(NavigationTracker.getSection(element)).toBe("copyright");
  });
});
