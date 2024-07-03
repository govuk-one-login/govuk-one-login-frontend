const { When, Then } = require("@cucumber/cucumber");
const { expect } = require("chai");

When("I clear the browser context", async function () {
  this.context = await global.browser.newContext({});
  this.page = await this.context.newPage();
});

Then("I do not see the cookie banner", async function () {
  const banner = await this.page.locator(".govuk-cookie-banner");
  expect(await banner.isVisible()).to.equal(false);
});

Then("The {word} cookie is not set", async function (cookieName) {
  const cookies = await this.context.cookies();
  const cookieExists = cookies.some((cookie) => cookie.name === cookieName);
  expect(cookieExists).to.equal(false);
});
