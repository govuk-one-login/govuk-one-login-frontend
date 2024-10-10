import render from "./jestHelper";

const mockParams = {
  key: "value",
};

describe("languageSelect macro render function", () => {
  it("renders the template included in languageSelect with children", () => {
    const $ = render("languageSelect", mockParams);
    const outputHtml = $.html();
    expect(outputHtml).toContain(`<nav class="language-select`);
  });

  it("renders the template included in languageSelect without children", () => {
    expect(() => render("languageSelect")).toThrow(
      "Parameters passed to `render` should be an object but are undefined",
    );
  });
});
