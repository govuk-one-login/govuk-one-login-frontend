const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("chai");

const getSessionIdCookieValue = (cookies) => {
  return cookies.find((cookie) => cookie.name === "sessionId").value;
};

Given(
  "I visit the {word} page",
  { timeout: 30 * 1000 },
  async function (title) {
    await this.page.goto(`http://localhost:3000/${title}`);
  },
);

Given("I edit the {word} page", { timeout: 30 * 1000 }, async function (title) {
  await this.page.goto(`http://localhost:3000/${title}?edit=true`);
});

When("I submit the form", async function () {
  await this.page.locator(`button[type="submit"]`).click();
  await this.page.waitForLoadState("networkidle"); // Wait for network calls to finish
});

When("I select {word} option", async function (text) {
  await this.page.locator(`input[value="${text}"]`).click();
  await this.page.waitForLoadState("networkidle"); // Wait for network calls to finish
});

When("I fill {word} field", async function (text) {
  await this.page.locator(`[id="${text}"]`).fill("test");
  await this.page.waitForLoadState("networkidle"); // Wait for network calls to finish
});

When("I choose {word} value", async function (text) {
  //await this.page.locator(`[name="chooseLocation"]`).select_option(text);
  await this.page.evaluate(
    `document.querySelector('option[value="${text}"]').selected = true`,
  );
  await this.page.waitForLoadState("networkidle"); // Wait for network calls to finish
});

When("I click Accept", async function () {
  await this.page.locator(`button:has-text("Accept"):visible`).click();
  await this.page.waitForLoadState("networkidle"); // Wait for network calls to finish
});

When("I click Reject", async function () {
  await this.page.locator(`button:has-text("Reject"):visible`).click();
  await this.page.waitForLoadState("networkidle"); // Wait for network calls to finish
});

When("I click Hide", async function () {
  await this.page.locator(`a:has-text("Hide this message"):visible`).click();
  await this.page.waitForLoadState("networkidle"); // Wait for network calls to finish
});

When("I click logo", async function () {
  await this.page.locator(`span:text-is(" GOV.UK "):visible`).click();
  await this.page.waitForLoadState("networkidle"); // Wait for network calls to finish
});

When("I click Back", async function () {
  await this.page.locator('a.govuk-back-link:text-is("Back")').click();
  await this.page.waitForLoadState("networkidle"); // Wait for network calls to finish
});

When("I click {word} {word}", async function (text, element) {
  if (element === "link") element = "a";
  await this.page.locator(`${element}:text-is("${text}"):visible`).click();
  await this.page.waitForLoadState("networkidle"); // Wait for network calls to finish
});

When("I click {word} {word} {word}", async function (text, text2, element) {
  if (element === "link") element = "a";
  await this.page
    .locator(`${element}:has-text("${text} ${text2}"):visible`)
    .click();
  await this.page.waitForLoadState("networkidle"); // Wait for network calls to finish
});

When(
  "I click {word} {word} {word} {word}",
  async function (text, text2, text3, element) {
    if (element === "link") element = "a";
    await this.page
      .locator(`${element}:has-text("${text} ${text2} ${text3}"):visible`)
      .click();
    await this.page.waitForLoadState("networkidle"); // Wait for network calls to finish
  },
);

When("I select {word}", async function (attributeValue) {
  await this.page.locator(`#${attributeValue}`).click();
  await this.page.waitForLoadState("networkidle"); // Wait for network calls to finish
});

Then("I see the heading {string}", async function (heading) {
  const content = await this.page.textContent("h1");
  expect(content.trim()).to.equal(heading);
});

Then("I see the {word} element", async function (identifier) {
  const element = await this.page.waitForSelector(`#${identifier}`);
  expect(await element.isVisible()).to.equal(true);
});

Then("I see the message {string}", async function (identifier) {
  const element = await this.page.getByText(identifier);
  expect(await element.isVisible()).to.equal(true);
});

Then("I do not see the {word} element", async function (identifier) {
  const element = await this.page.locator(`#${identifier}`);
  expect(await element.isVisible()).to.equal(false);
});

Then(
  "The {word} cookie is set to {word}",
  async function (cookieName, cookieValue) {
    const cookies = await this.context.cookies();
    const cookie = cookies.find((cookie) => cookie.name === cookieName);
    if (cookieName === "cookies_preferences_set") {
      expect(cookie.value).to.equal(`%7B%22analytics%22%3A${cookieValue}%7D`);
    } else {
      expect(cookie.value).to.equal(cookieValue);
    }
  },
);

module.exports = {
  getSessionIdCookieValue,
};
