const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");

Then("the {word} cookie has been set", async function(cookieName) {
    const cookies = await this.page.context().cookies();
    const expectedCookie = cookies.find(cookie => cookie.name === cookieName);
    expect(expectedCookie).toBeDefined();
    this.originalCookieValue = expectedCookie.value;
});

When("I refresh the {word} page", async function(title) {
    await this.page.goto(`http://localhost:3000/${title}`);
    await this.page.reload();
});

Then("I should see an identical {word} cookie value after the page refresh", async function(cookieName) {
    const cookies = await this.page.context().cookies();
    const expectedCookie = cookies.find(cookie => cookie.name === cookieName);
    expect(expectedCookie).toBeDefined();
    expect(expectedCookie.value).toEqual(this.originalCookieValue);
});