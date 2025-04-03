const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");

/* Scenario 1 */
Then("the {word} cookie has been set", async function(cookieName) {
    const cookies = await this.page.context().cookies();
    const expectedCookie = cookies.find(cookie => cookie.name === cookieName);
    expect(expectedCookie).toBeDefined();
});