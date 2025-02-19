import {
  getLoggedInStatus,
  getRelyingParty,
  getFirstPublishedAt,
  getUpdatedAt,
} from "./pageViewTracker.utils";

describe("pageViewTracker Utils", () => {
  describe("getLoggedInStatus", () => {
    test("should return `logged in` if parameter is `true`", () => {
      const status = getLoggedInStatus(true);
      expect(status).toBe("logged in");
    });

    test("should return `logged out` if parameter is `false`", () => {
      const status = getLoggedInStatus(false);
      expect(status).toBe("logged out");
    });

    test("should return `undefined` if parameter is `undefined`", () => {
      const status = getLoggedInStatus(undefined);
      expect(status).toBe("undefined");
    });
  });

  describe("getRelyingParty", () => {
    test("should return the current hostname", () => {
      const relyingParty = getRelyingParty();
      expect(relyingParty).toBe("localhost");
    });
  });

  describe("getFirstPublishedAt", () => {
    test("should return undefined if first published-at tag doesn't exists", () => {
      const firstPublishedAt = getFirstPublishedAt();
      expect(firstPublishedAt).toBe("undefined");
    });

    test("getFirstPublishedAt returns the good data if first published-at tag exists", () => {
      const newTag = document.createElement("meta");
      newTag.setAttribute("name", "govuk:first-published-at");
      newTag.setAttribute("content", "2022-09-01T00:00:00.000Z");
      document.head.appendChild(newTag);
      const firstPublishedAt = getFirstPublishedAt();
      expect(firstPublishedAt).toBe("2022-09-01T00:00:00.000Z");
    });
  });

  describe("getUpdatedAt", () => {
    test("returns undefined if updated-at tag doesn't exists", () => {
      const updatedAt = getUpdatedAt();
      expect(updatedAt).toBe("undefined");
    });

    test("returns the good data if updated-at tag exists", () => {
      const metaTag = document.createElement("meta");
      metaTag.setAttribute("name", "govuk:updated-at");
      metaTag.setAttribute("content", "2022-09-02T00:00:00.000Z");
      document.head.appendChild(metaTag);
      const updatedAt = getUpdatedAt();
      expect(updatedAt).toBe("2022-09-02T00:00:00.000Z");
    });
  });
});
