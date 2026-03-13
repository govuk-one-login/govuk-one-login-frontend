import { describe, expect, test } from "@jest/globals";
import { NavigationElement } from "../navigationTracker.interface";
import {
  isExternalLink,
  isHeaderMenuBarLink,
  isFooterLink,
  isBackLink,
} from "./navigationTrackerLinkUtils";

describe("navigationTrackerLinkUtils", () => {
  describe("isExternalLink", () => {
    // @ts-expect-error global.window.location type fudging
    const setMockLocation = (url: string) => (global.window.location = url);

    test("should return false for internal links", () => {
      setMockLocation("https://account.gov.uk");
      const url = "http://account.gov.uk";
      expect(isExternalLink(url)).toBe(false);
    });

    test("should return false for signin account links", () => {
      setMockLocation("https://account.gov.uk");
      const url = "http://signin.account.gov.uk/cookies";
      expect(isExternalLink(url)).toBe(false);
    });

    test("should return false for signin account links in staging", () => {
      setMockLocation("https://account.gov.uk");
      const url = "http://signin.staging.account.gov.uk/cookies";
      expect(isExternalLink(url)).toBe(false);
    });

    test("should return true for external links", () => {
      setMockLocation("https://account.gov.uk");
      const url = "https://google.com";
      expect(isExternalLink(url)).toBe(true);
    });

    test("should return false for localhost links", () => {
      setMockLocation("http://localhost");
      const url = "http://localhost";
      expect(isExternalLink(url)).toBe(false);
    });

    test("should return true for external links with localhost in them", () => {
      setMockLocation("http://localhost:8000");
      const url = "http://localhost.com";
      expect(isExternalLink(url)).toBe(true);
    });

    test("return false if not a valid url", () => {
      setMockLocation("http://localhost:8000");
      const url = "abc...";
      expect(isExternalLink(url)).toBe(false);
    });
  });

  describe("isHeaderMenuBarLink", () => {
    test("should return true if link is inside the header tag", () => {
      document.body.innerHTML = `<header><a id="testLink">Link to GOV.UK</a></header>`;
      const element = document.getElementById("testLink") as NavigationElement;
      expect(isHeaderMenuBarLink(element)).toBe(true);
    });

    test("should return true if link is inside the nav tag", () => {
      document.body.innerHTML = `<nav><a id="testLink">Link to GOV.UK</a></nav>`;
      const element = document.getElementById("testLink") as NavigationElement;
      expect(isHeaderMenuBarLink(element)).toBe(true);
    });

    test("should return false if link is not inside the header or nav tag", () => {
      document.body.innerHTML = `<div><a id="testLink">Link to GOV.UK</a></div>`;
      const element = document.getElementById("testLink") as NavigationElement;
      expect(isHeaderMenuBarLink(element)).toBe(false);
    });
  });

  describe("isFooterLink", () => {
    test("should return true if link is inside the footer tag", () => {
      document.body.innerHTML = `<footer><a id="testLink2">Link to GOV.UK</a></footer>`;
      const element = document.getElementById("testLink2") as NavigationElement;
      expect(isFooterLink(element)).toBe(true);
    });

    test("should return true if link is not inside the footer tag", () => {
      document.body.innerHTML = `<footer></footer><a id="testLink2">Link to GOV.UK</a>`;
      const element = document.getElementById("testLink2") as NavigationElement;
      expect(isFooterLink(element)).toBe(false);
    });
  });

  describe("isBackLink", () => {
    test("should return true if link is a back button", () => {
      document.body.innerHTML = `<a id="testLink3" href="/welcome" class="govuk-back-link">Back</a>`;
      const element = document.getElementById("testLink3") as NavigationElement;
      expect(isBackLink(element)).toBe(true);
    });

    test("should return false if link is not a back button", () => {
      document.body.innerHTML = `<a id="testLink3" href="/welcome" class="govuk-random-link">Back</a>`;
      const element = document.getElementById("testLink3") as NavigationElement;
      expect(isBackLink(element)).toBe(false);
    });
  });
});
