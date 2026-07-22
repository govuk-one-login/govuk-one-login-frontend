import { NavigationElement } from "../navigationTracker.interface";
import {
  isExternalLink,
  isHeaderMenuBarLink,
  isFooterLink,
  isBackLink,
  isNavigatingElement,
} from "./navigationTrackerLinkUtils";

describe("navigationTrackerLinkUtils", () => {
  describe("isExternalLink", () => {
    const setMockLocation = (url: string) =>
      (global.window.location = url as string & Location);

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
      setMockLocation("http://localhost:3000");
      const url = "http://localhost:3000";
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

  describe("isNavigatingElement", () => {
    describe("only allows http/https protocol schemes", () => {
      test("should return false for tel: links", () => {
        document.body.innerHTML = `<a id="tel" href="tel:07123456789">07123 456 789</a>`;
        const element = document.getElementById("tel") as NavigationElement;
        expect(isNavigatingElement(element)).toBe(false);
      });

      test("should return false for mailto: links", () => {
        document.body.innerHTML = `<a id="mailto" href="mailto:test@example.com">test@example.com</a>`;
        const element = document.getElementById("mailto") as NavigationElement;
        expect(isNavigatingElement(element)).toBe(false);
      });

      test("should return false for sms: links", () => {
        document.body.innerHTML = `<a id="sms" href="sms:07123456789">07123 456 789</a>`;
        const element = document.getElementById("sms") as NavigationElement;
        expect(isNavigatingElement(element)).toBe(false);
      });

      test("should return false for geo: links", () => {
        document.body.innerHTML = `<a id="geo" href="geo:51.5074,-0.1278">10 Downing Street</a>`;
        const element = document.getElementById("geo") as NavigationElement;
        expect(isNavigatingElement(element)).toBe(false);
      });

      test("should return false for unknown/custom protocol schemes", () => {
        document.body.innerHTML = `<a id="custom" href="custom-app:some-data">Open app</a>`;
        const element = document.getElementById("custom") as NavigationElement;
        expect(isNavigatingElement(element)).toBe(false);
      });

      test("should return true for http: links", () => {
        document.body.innerHTML = `<a id="http" href="http://www.gov.uk/page">GOV.UK</a>`;
        const element = document.getElementById("http") as NavigationElement;
        expect(isNavigatingElement(element)).toBe(true);
      });

      test("should return true for https: links", () => {
        document.body.innerHTML = `<a id="https" href="https://www.gov.uk/page">GOV.UK</a>`;
        const element = document.getElementById("https") as NavigationElement;
        expect(isNavigatingElement(element)).toBe(true);
      });
    });
  });
