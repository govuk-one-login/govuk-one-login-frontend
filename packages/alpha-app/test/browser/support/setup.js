const { Before, BeforeAll, AfterAll, After } = require("@cucumber/cucumber");
const { chromium } = require("playwright");

BeforeAll(async () => {
  global.browser = await chromium.launch({
    // Not headless so we can watch test runs
    headless: true,
    // Slow so we can see things happening
    // slowMo: 500
  });
});

// Create a new test context and page per scenario
Before(async function () {
  this.context = await global.browser.newContext({});
  this.page = await this.context.newPage();
});

AfterAll(async () => {
  await global.browser.close();
});

// Cleanup after each scenario
After(async function () {
  await this.page.close();
  await this.context.close();
});
