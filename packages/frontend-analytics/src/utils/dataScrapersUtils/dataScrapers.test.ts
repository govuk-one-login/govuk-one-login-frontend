import { isChangeLink, getDomain, getDomainPath } from "./dataScrapers";

describe("getDomain", () => {
  test("Get domain from absolute url", () => {
    const location = getDomain(
      "https://signin.account.gov.uk/enter-email-create",
    );
    expect(location).toEqual("https://signin.account.gov.uk");
  });

  test("Get domain from relative url", () => {
    const location = getDomain("/enter-email-create");
    expect(location).toEqual("http://localhost:3000");
  });

  test("Getdomain needs to return undefined if url = undefined", () => {
    const location = getDomain("undefined");
    expect(location).toEqual("undefined");
  });
});

describe("getDomainPath", () => {
  test("Get url path from 0 to 500 max from element url", () => {
    const location = getDomainPath(
      "https://signin.account.gov.uk/enter-email-create",
      0,
    );
    expect(location).toEqual("/enter-email-create");
  });

  test("Get url path longer than 500 characters", () => {
    // 499 characters because a '/' is appended to the start when we fetch the path
    const longUrlFirst499Characters =
      "DPtnYonMCTeWdtVDhroFHMqqIGEoICSMcIuoJvPDnXWqwefwNejqzEZoxxiXdgfpQdWVWsGtEHOGYtwBVlFxFEqGxIhvkQMqMDdGgTWrWkHeCWTzhmKsfWZttoEoRiBfbCYIxDHQubdknmLdzexXCnearPrqIfjCBXgDsoQMjonbPtjYUIgthMdrLjIWcDnmXyveOFREJAIaXfPGqcRIhfkxpRVNiFevDBjqIGjHAZXysfgyxYahBjOzfHJPYPidKbQDEJxmWDkfUGKGKTUKpBJixXxBdtpHeLJhYvVzynFPkLFSEHpsToygMESyGjSKEsxbnqDDnvrcaTHGbpDWPHpWlVyAHpQqGTcBbCLPrdOZLxUGWrDMTEhrbfMTnObSaOdHQQEwEaavHuETnqCVHZnSqrXuaSJgCPrJPylXVnyQhLjxQTlsbXfsJtRhjdrdKikvWoiiixETbGqvVofTGOkwwlBTsHgylNpdpkspyIgshZzJgLz";
    const longUrlLast4Characters = "test";

    const location1 = getDomainPath(
      longUrlFirst499Characters + longUrlLast4Characters,
      0,
    );
    const location2 = getDomainPath(
      longUrlFirst499Characters + longUrlLast4Characters,
      1,
    );

    expect(location1).toEqual(
      "/DPtnYonMCTeWdtVDhroFHMqqIGEoICSMcIuoJvPDnXWqwefwNejqzEZoxxiXdgfpQdWVWsGtEHOGYtwBVlFxFEqGxIhvkQMqMDdGgTWrWkHeCWTzhmKsfWZttoEoRiBfbCYIxDHQubdknmLdzexXCnearPrqIfjCBXgDsoQMjonbPtjYUIgthMdrLjIWcDnmXyveOFREJAIaXfPGqcRIhfkxpRVNiFevDBjqIGjHAZXysfgyxYahBjOzfHJPYPidKbQDEJxmWDkfUGKGKTUKpBJixXxBdtpHeLJhYvVzynFPkLFSEHpsToygMESyGjSKEsxbnqDDnvrcaTHGbpDWPHpWlVyAHpQqGTcBbCLPrdOZLxUGWrDMTEhrbfMTnObSaOdHQQEwEaavHuETnqCVHZnSqrXuaSJgCPrJPylXVnyQhLjxQTlsbXfsJtRhjdrdKikvWoiiixETbGqvVofTGOkwwlBTsHgylNpdpkspyIgshZzJgLz",
    );
    expect(location2).toEqual("test");
  });

  test("Get domain path needs to return undefined if url = undefined", () => {
    const location = getDomainPath("undefined", 0);
    expect(location).toEqual("undefined");
  });

  test("Get undefined if url path part is not found from element url", () => {
    const location = getDomainPath(
      "https://signin.account.gov.uk/enter-email-create",
      1,
    );
    expect(location).toEqual("undefined");
  });

  test("Get domain from relative url", () => {
    const location = getDomainPath("/enter-email-create", 0);
    expect(location).toEqual("/enter-email-create");
  });
});

describe("should check for changeLink", () => {
  test("should return true if element is a change link", () => {
    const href = document.createElement("a");
    href.setAttribute("href", "http://localhost?edit=true");
    expect(isChangeLink(href)).toBe(true);
  });
  test("should return false if element is not a change link", () => {
    const href = document.createElement("a");
    href.setAttribute("href", "http://localhost:3000");
    expect(isChangeLink(href)).toBe(false);
  });
});
