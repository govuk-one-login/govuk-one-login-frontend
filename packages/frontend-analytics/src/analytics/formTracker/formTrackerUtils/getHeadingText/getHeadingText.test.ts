import { beforeEach, describe, expect, test } from "@jest/globals";
import { getHeadingText } from "./getHeadingText";

describe("getHeadingText", () => {
  beforeEach(() => {
    // Remove any existing elements from document.body if needed
    document.body.innerHTML = "";
  });

  test("getHeadingText should return h1 content if it has a rel attribute matching commonId", () => {
    // create h1 with rel attribute

    const h1 = document.createElement("h1");
    h1.textContent = "H1 with rel attribute";
    h1.setAttribute("rel", "example");

    document.body.appendChild(h1);

    expect(getHeadingText("example_1")).toBe("H1 with rel attribute");
  });

  test("getHeadingText should return undefined if there is no h1/h2 with a rel attribute matching commonId", () => {
    // create h2
    const h2 = document.createElement("h2");
    document.body.appendChild(h2);

    expect(getHeadingText("example_1")).toBe("undefined");
  });
});
