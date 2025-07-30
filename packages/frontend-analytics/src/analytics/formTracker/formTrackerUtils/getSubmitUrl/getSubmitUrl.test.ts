import { beforeEach, describe, expect, test } from "@jest/globals";
import { getSubmitUrl } from "./getSubmitUrl";

describe("getSubmitUrl", () => {
  beforeEach(() => {
    // Remove any existing elements from document.body if needed
    document.body.innerHTML = "";
  });

  test("getSubmitUrl should return submit url", () => {
    const form = document.createElement("form");
    form.action = "/test-url";
    form.innerHTML =
      '<input id="test" name="test" value="test value" type="text"/>';
    document.body.appendChild(form);
    expect(getSubmitUrl(form)).toBe("http://localhost/test-url");
  });

  test("getSubmitUrl should return submit url with the query params also", () => {
    const form = document.createElement("form");
    form.action = "/test-url?edit=true";
    form.innerHTML =
      '<input id="test" name="test" value="test value" type="text"/>';
    document.body.appendChild(form);
    expect(getSubmitUrl(form)).toBe("http://localhost/test-url?edit=true");
  });
});
