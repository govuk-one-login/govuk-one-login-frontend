import { getSection } from "./formChangeTracker.utils";

describe("formChangeTracker utils", () => {
  describe("getSection", () => {
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
});
