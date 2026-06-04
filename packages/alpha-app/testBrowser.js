import { browser } from "k6/browser";

export const options = {
  scenarios: {
    ui: {
      executor: "ramping-arrival-rate",
      options: {
        browser: {
          type: "chromium",
        },
      },

      startRate: 1,
      timeUnit: "1s",
      preAllocatedVUs: 1,
      maxVUs: 4,
      stages: [
        { target: 2, duration: "30s" }, // Ramps up to target load
        { target: 2, duration: "30s" }, // Holds at target load
      ],
    },
  },
  thresholds: {
    browser_web_vital_fcp: ["p(95) < 1000"],
    browser_web_vital_lcp: ["p(95) < 2000"],
  },
};

export default async function () {
  const page = await browser.newPage();

  try {
    await page.goto("http://localhost:3000");

    await page.click("#start");

    await page.waitForSelector('input[name="name"]', { timeout: 5000 });
    await page.fill('input[name="name"]', "Umma");
    await page.click('button[type="submit"]');

    await page.waitForSelector("#header", { timeout: 5000 });
    const headerText = await page.textContent("#header");
    if (!headerText.includes("Check answers")) {
      throw new Error(`Header ${headerText} does not match expected text!`);
    }
  } finally {
    await page.close();
  }
}
