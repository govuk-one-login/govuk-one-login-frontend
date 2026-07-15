import { test, expect } from '@playwright/test';
import { time } from 'console';

test.describe('Progress Button visual regression', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/test-progress-button');
    await page.evaluate(() => {
    const form = document.getElementById('myForm');
    if (form) {
      form.addEventListener('submit', (event) => {
        console.log('Playwright injected: Preventing default form submission!');
        event.preventDefault();
      });
    }
  });
  });

  test('should match visual snapshot in default state', async ({ page }) => {
    const button = await page.locator('.govuk-button--progress').first();
    await expect(button).toHaveScreenshot('progress-button-default.png');
  });

  test('should match visual snapshot after clicking', async ({ page }) => {
    const button = page.locator('.govuk-button--progress').first();
    button.click({force: true});
    await expect(button).toHaveScreenshot('progress-button-clicked.png');
  });

  test('should match visual snapshot after clicking and waiting 5 seconds', async ({ page }) => {
    const button = page.locator('.govuk-button--progress').first();
    await button.click({force: true});
    await page.waitForTimeout(5100); // slightly over 5s to ensure the timeout has triggered
    await page.waitForSelector('.govuk-button--progress:has-text("Keep waiting")', { state: 'visible' });
    await expect(button).toHaveScreenshot('progress-button-clicked-and-waited.png', { timeout: 10000 });
  });


    test('should match visual snapshot in default state - reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const button = await page.locator('.govuk-button--progress').first();
    await expect(button).toHaveScreenshot('progress-button-default-no-motion.png');
  });

  test('should match visual snapshot after clicking - reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const button = page.locator('.govuk-button--progress').first();
    button.click({force: true});
    await expect(button).toHaveScreenshot('progress-button-clicked-no-motion.png');
  });

  test('should match visual snapshot after clicking and waiting 5 seconds - reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const button = page.locator('.govuk-button--progress').first();
    await button.click({force: true});
    await page.waitForTimeout(5100); // slightly over 5s to ensure the timeout has triggered
    await page.waitForSelector('.govuk-button--progress:has-text("Keep waiting")', { state: 'visible' });
    await expect(button).toHaveScreenshot('progress-button-clicked-and-waited-no-motion.png', { timeout: 10000 });
  });

});

test.describe('Progress Button mobile layout', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // any width value below the govuk-frontend tablet breakpoint

  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/test-progress-button");
    await page.evaluate(() => {
      const form = document.getElementById("myForm");
      if (form) {
        form.addEventListener("submit", (event) => event.preventDefault());
      }
    });
  });

  test("button fills its container width on mobile", async ({ page }) => {
    const button = page.locator(".govuk-button--progress").first();
    const { buttonWidth, parentWidth } = await button.evaluate((el) => ({
      buttonWidth: el.getBoundingClientRect().width,
      parentWidth: (el.parentElement as HTMLElement).getBoundingClientRect()
        .width,
    }));
    expect(buttonWidth).toBeCloseTo(parentWidth, 0);
  });

  test("loading state applies flex centering", async ({ page }) => {
    const button = page.locator(".govuk-button--progress").first();
    await button.click({ force: true });
    const styles = await button.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        display: cs.display,
        justifyContent: cs.justifyContent,
        alignItems: cs.alignItems,
      };
    });
    expect(styles.display).toBe("inline-flex");
    expect(styles.justifyContent).toBe("center");
    expect(styles.alignItems).toBe("center");
  });

  test("should match visual snapshot in default state", async ({
    page,
  }) => {
    const button = page.locator(".govuk-button--progress").first();
    await expect(button).toHaveScreenshot("progress-button-mobile-default.png");
  });

  test("should match visual snapshot after clicking", async ({
    page,
  }) => {
    const button = page.locator(".govuk-button--progress").first();
    await button.click({ force: true });
    await expect(button).toHaveScreenshot("progress-button-mobile-clicked.png");
  });
});

test.describe('Progress Button inside govuk-button-group', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/test-progress-button');
  });

  test('should match visual snapshot of button group in default state', async ({ page }) => {
    const group = page.locator('.govuk-button-group', { has: page.locator('.govuk-button--progress') });
    await expect(group).toHaveScreenshot('progress-button-group-default.png');
  });

  test('should match visual snapshot of button group after clicking progress button', async ({ page }) => {
    const group = page.locator('.govuk-button-group', { has: page.locator('.govuk-button--progress') });
    const progressButton = group.locator('.govuk-button--progress');
    await progressButton.click({ force: true });
    await expect(group).toHaveScreenshot('progress-button-group-clicked.png');
  });

  test('sibling button does not move vertically when progress button is clicked', async ({ page }) => {
    const group = page.locator('.govuk-button-group', { has: page.locator('.govuk-button--progress') });
    const progressButton = group.locator('.govuk-button--progress');
    const secondaryButton = group.locator('.govuk-button--secondary');

    const beforeBox = await secondaryButton.boundingBox();
    await progressButton.click({ force: true });
    await progressButton.evaluate((el) => el.classList.contains('govuk-button--progress-loading'));
    const afterBox = await secondaryButton.boundingBox();

    expect(beforeBox).not.toBeNull();
    expect(afterBox).not.toBeNull();
    expect(Math.abs(afterBox!.y - beforeBox!.y)).toBeLessThan(1);
  });
});

test.describe('Progress Button with JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false });

  test('should match visual snapshot of form button with JS disabled', async ({ page }) => {
    await page.goto('http://localhost:3000/test-progress-button');
    const form = page.locator('#myForm');
    await expect(form).toHaveScreenshot('progress-button-no-js.png');
  });

  test('should match visual snapshot of button group with JS disabled', async ({ page }) => {
    await page.goto('http://localhost:3000/test-progress-button');
    const group = page.locator('.govuk-button-group', { has: page.locator('.govuk-button--progress') });
    await expect(group).toHaveScreenshot('progress-button-group-no-js.png');
  });
});

