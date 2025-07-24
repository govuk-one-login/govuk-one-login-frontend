import { NavigationElement } from "../navigationTracker.interface";
import { getLinkType, getSection } from "./navigationTrackerGetUtils";

describe("getLinkType", () => {
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
    expect(getLinkType(element)).toBe("footer");
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
    expect(getLinkType(element)).toBe("header menu bar");
  });

  test('should return "header menu bar" when the element is an <a> tag within the header tag', () => {
    const href = document.createElement("A");
    href.className = "header__navigation";
    href.dispatchEvent(action);
    document.body.innerHTML = "<header></header><footer></footer>";
    const header = document.getElementsByTagName("header")[0];
    header.appendChild(href);
    const element = action.target as NavigationElement;
    expect(getLinkType(element)).toBe("header menu bar");
  });

  test('should return "generic link" when the element is an <a> tag which is not inside the footer or header tags', () => {
    const href = document.createElement("A");
    href.className = "other-link";
    href.dispatchEvent(action);
    const element = action.target as NavigationElement;
    document.body.innerHTML = "<header></header><footer></footer>";
    expect(getLinkType(element)).toBe("generic link");
  });

  test('should return "generic button" when the element is a has a tag and button classname', () => {
    const button = document.createElement("A");
    button.className = "govuk-button";
    button.dispatchEvent(action);
    const element = action.target as NavigationElement;
    expect(getLinkType(element)).toBe("generic button");
  });

  test('should return "generic button" when the element is a button', () => {
    const button = document.createElement("BUTTON");
    button.setAttribute("data-nav", "true");
    button.setAttribute("data-link", "/next-url");
    button.dispatchEvent(action);
    const element = action.target as NavigationElement;
    expect(getLinkType(element)).toBe("generic button");
  });
});

describe("getSection", () => {
  const action = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  test("it should return undefined if section is not defined", () => {
    document.body.innerHTML = `<body><a id="testLink1">Link to GOV.UK</a></body>`;
    const element = document.getElementById("testLink1") as NavigationElement;
    expect(getSection(element)).toBe("undefined");
  });

  test("it should return logo when a link is clicked in the logo", () => {
    document.body.innerHTML = `<header><a id="testAnchor" href="http://localhost:3000">
      <span class="govuk-header__logotype"></span></header>
      </a>`;
    const element = document.getElementById("testAnchor") as NavigationElement;
    element.dispatchEvent(action);
    element.addEventListener("click", () => {
      expect(getSection(element)).toBe("logo");
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
    expect(getSection(element)).toBe("phase banner");
  });

  test("it should return menu links when a link is clicked in the header", () => {
    const href = document.createElement("A");
    href.className = "govuk-link";
    href.dispatchEvent(action);
    document.body.innerHTML = "<header></header>";
    const header = document.getElementsByTagName("header")[0];
    header.appendChild(href);
    const element = action.target as NavigationElement;
    expect(getSection(element)).toBe("menu links");
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
    expect(getSection(element)).toBe("support links");
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
    expect(getSection(element)).toBe("licence");
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
    expect(getSection(element)).toBe("copyright");
  });
});
