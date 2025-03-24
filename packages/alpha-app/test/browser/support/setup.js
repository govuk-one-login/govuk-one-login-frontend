const { Before, BeforeAll, AfterAll, After } = require("@cucumber/cucumber");
const { chromium } = require("playwright");

BeforeAll(async function () {
  global.browser = await chromium.launch({
    headless: true,
    // slowMo: 500,
    // devtools: true,
  });
});

// Create a new test context and page per scenario
Before(async function () {
  this.context = await global.browser.newContext({});
  this.page = await this.context.newPage();
});

AfterAll(async function () {
  await global.browser.close();
});

// Cleanup after each scenario
After(async function () {
  await this.page.close();
  await this.context.close();
});
