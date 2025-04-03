const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");

/* requisites for scenarios */
Given("I am an FEC dev", async function() {
    console.log("Running as FEC dev");
});

/* Scenario 1 */
When("I run an E2E test in the alpha app", async function() {
    await this.page.goto("http://localhost:3000/welcome");
});

Then("I accept analytics cookies from the banner", async function () {
    const acceptButton = await this.page.locator("[name=cookiesAccept]");
    await acceptButton.click();
});

Then("the cookie has been set", async function() {
    const cookies = await this.page.context().cookies();
    const fingerprintCookie = cookies.find(cookie => cookie.name === "di-device-intelligence");
    expect(fingerprintCookie).toBeDefined();
});

/* Scenario 2 */
When("I run an E2E refresh test in the alpha app", async function() {
    await this.page.reload();
});

Then("the cookie should be reset in the web page", async function() {
   const cookies = await this.page.context().cookies();
   const fingerprintCookie = cookies.find(cookie => cookie.name === "di-device-intelligence");
   expect(fingerprintCookie).toBeUndefined(); 
});