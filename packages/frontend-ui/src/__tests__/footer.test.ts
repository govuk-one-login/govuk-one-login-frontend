import { axe, toHaveNoViolations } from "jest-axe";
import { JSDOM } from "jsdom";
import cyTranslations from "../../locales/cy/translation.json";
import enTranslations from "../../locales/en/translation.json";
import { nunjucksEnv } from "../test/jestHelper";

expect.extend(toHaveNoViolations);

function renderFooter(footerTranslations: typeof enTranslations.footer) {
  const macroString = `{% from "footer/macro.njk" import frontendUiFooter %}{{ frontendUiFooter(macroArg) }}`;
  const output = nunjucksEnv.renderString(macroString, {
    macroArg: { translations: footerTranslations },
  });
  const dom = new JSDOM(output);
  return dom.window.document;
}

describe("Footer Component", () => {
  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const document = renderFooter(enTranslations.footer);
      const html = document.documentElement.outerHTML;
      const results = await axe(html);
      expect(results).toHaveNoViolations();
    });
  });

  describe("English footer links", () => {
    let document: Document;

    beforeEach(() => {
      document = renderFooter(enTranslations.footer);
    });

    it("renders the correct number of footer nav links", () => {
      const links = document.querySelectorAll(
        ".govuk-footer__inline-list-item a",
      );
      expect(links.length).toBe(5);
    });

    it.each([
      [
        "Accessibility statement",
        "https://signin.account.gov.uk/accessibility-statement",
      ],
      ["Cookies", "https://signin.account.gov.uk/cookies"],
      [
        "Terms and conditions",
        "https://signin.account.gov.uk/terms-and-conditions",
      ],
      [
        "Privacy notice",
        "https://www.gov.uk/government/publications/govuk-one-login-privacy-notice",
      ],
      [
        "Support (opens in new tab)",
        "https://home.account.gov.uk/contact-gov-uk-one-login",
      ],
    ])("renders '%s' link with correct href", (expectedText, expectedHref) => {
      const links = document.querySelectorAll(
        ".govuk-footer__inline-list-item a",
      );
      const matchingLink = Array.from(links).find((link) =>
        link.textContent?.trim().includes(expectedText),
      );

      expect(matchingLink).toBeDefined();
      expect(matchingLink?.getAttribute("href")).toBe(expectedHref);
    });

    it("renders Support link with target='_blank'", () => {
      const links = document.querySelectorAll(
        ".govuk-footer__inline-list-item a",
      );
      const supportLink = Array.from(links).find((link) =>
        link.textContent?.trim().includes("Support"),
      );

      expect(supportLink?.getAttribute("target")).toBe("_blank");
    });

    it("renders Support link with rel='noreferrer noopener'", () => {
      const links = document.querySelectorAll(
        ".govuk-footer__inline-list-item a",
      );
      const supportLink = Array.from(links).find((link) =>
        link.textContent?.trim().includes("Support"),
      );

      expect(supportLink?.getAttribute("rel")).toBe("noreferrer noopener");
    });

    it("renders non-Support links without target='_blank'", () => {
      const links = document.querySelectorAll(
        ".govuk-footer__inline-list-item a",
      );
      const nonSupportLinks = Array.from(links).filter(
        (link) => !link.textContent?.trim().includes("Support"),
      );

      for (const link of nonSupportLinks) {
        expect(link.getAttribute("target")).toBeNull();
      }
    });

    it("renders the OGL licence link with correct href and text", () => {
      const licenceDescription = document.querySelector(
        ".govuk-footer__licence-description",
      );
      const oglLink = licenceDescription?.querySelector("a");

      expect(oglLink).toBeDefined();
      expect(oglLink?.getAttribute("href")).toBe(
        "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/",
      );
      expect(oglLink?.textContent?.trim()).toContain(
        "Open Government Licence v3.0",
      );
    });

    it("renders the Crown copyright link with correct text", () => {
      const copyrightLink = document.querySelector(
        ".govuk-footer__copyright-logo",
      );

      expect(copyrightLink).toBeDefined();
      expect(copyrightLink?.textContent?.trim()).toBe("© Crown copyright");
    });

    it("renders the Crown copyright link with correct href", () => {
      const copyrightLink = document.querySelector(
        ".govuk-footer__copyright-logo",
      );

      expect(copyrightLink?.getAttribute("href")).toBe(
        "https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/",
      );
    });

    it("renders the visually hidden support links header", () => {
      const hiddenHeader = document.querySelector(".govuk-visually-hidden");

      expect(hiddenHeader?.textContent?.trim()).toBe("Support links");
    });
  });

  describe("Welsh footer links", () => {
    let document: Document;

    beforeEach(() => {
      document = renderFooter(cyTranslations.footer);
    });

    it("renders the correct number of footer nav links", () => {
      const links = document.querySelectorAll(
        ".govuk-footer__inline-list-item a",
      );
      expect(links.length).toBe(5);
    });

    it.each([
      [
        "Datganiad hygyrchedd",
        "https://signin.account.gov.uk/accessibility-statement",
      ],
      ["Cwcis", "https://signin.account.gov.uk/cookies"],
      [
        "Telerau ac amodau",
        "https://signin.account.gov.uk/terms-and-conditions",
      ],
      [
        "Hysbysiad preifatrwydd",
        "https://www.gov.uk/government/publications/govuk-one-login-privacy-notice.cy",
      ],
      [
        "Cymorth (agor mewn tab newydd)",
        "https://home.account.gov.uk/contact-gov-uk-one-login",
      ],
    ])("renders '%s' link with correct href", (expectedText, expectedHref) => {
      const links = document.querySelectorAll(
        ".govuk-footer__inline-list-item a",
      );
      const matchingLink = Array.from(links).find((link) =>
        link.textContent?.trim().includes(expectedText),
      );

      expect(matchingLink).toBeDefined();
      expect(matchingLink?.getAttribute("href")).toBe(expectedHref);
    });

    it("renders Support link with target='_blank'", () => {
      const links = document.querySelectorAll(
        ".govuk-footer__inline-list-item a",
      );
      const supportLink = Array.from(links).find((link) =>
        link.textContent?.trim().includes("Cymorth"),
      );

      expect(supportLink?.getAttribute("target")).toBe("_blank");
    });

    it("renders Support link with rel='noreferrer noopener'", () => {
      const links = document.querySelectorAll(
        ".govuk-footer__inline-list-item a",
      );
      const supportLink = Array.from(links).find((link) =>
        link.textContent?.trim().includes("Cymorth"),
      );

      expect(supportLink?.getAttribute("rel")).toBe("noreferrer noopener");
    });

    it("renders the OGL licence link with correct Welsh href and text", () => {
      const licenceDescription = document.querySelector(
        ".govuk-footer__licence-description",
      );
      const oglLink = licenceDescription?.querySelector("a");

      expect(oglLink).toBeDefined();
      expect(oglLink?.getAttribute("href")).toBe(
        "https://www.nationalarchives.gov.uk/doc/open-government-licence-cymraeg/version/3/",
      );
      expect(oglLink?.textContent?.trim()).toContain(
        "Trwydded Llywodraeth Agored v3.0",
      );
    });

    it("renders the Crown copyright with correct Welsh text", () => {
      const copyrightLink = document.querySelector(
        ".govuk-footer__copyright-logo",
      );

      expect(copyrightLink?.textContent?.trim()).toBe("© Hawlfraint y goron");
    });

    it("renders the Crown copyright link with correct href", () => {
      const copyrightLink = document.querySelector(
        ".govuk-footer__copyright-logo",
      );

      expect(copyrightLink?.getAttribute("href")).toBe(
        "https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/",
      );
    });

    it("renders the visually hidden support links header in Welsh", () => {
      const hiddenHeader = document.querySelector(".govuk-visually-hidden");

      expect(hiddenHeader?.textContent?.trim()).toBe("Dolenni cymorth");
    });
  });
});
