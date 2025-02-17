import { isChangeLink, getDomain, getDomainPath } from "./dataScrapers";

test("Get domain from element url", () => {
  const location = getDomain(
    "https://signin.account.gov.uk/enter-email-create",
  );
  expect(location).toEqual("https://signin.account.gov.uk");
});

test("Getdomain needs to return undefined if url = undefined", () => {
  const location = getDomain("undefined");
  expect(location).toEqual("undefined");
});

test("Get url path from 0 to 500 max from element url", () => {
  const location = getDomainPath(
    "https://signin.account.gov.uk/enter-email-create",
    0,
  );
  expect(location).toEqual("/enter-email-create");
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

describe("should check for changeLink", () => {
  test("should return true if element is a change link", () => {
    const href = document.createElement("a");
    href.setAttribute("href", "http://localhost?edit=true");
    expect(isChangeLink(href)).toBe(true);
  });
  test("should return false if element is not a change link", () => {
    const href = document.createElement("a");
    href.setAttribute("href", "http://localhost");
    expect(isChangeLink(href)).toBe(false);
  });
});
