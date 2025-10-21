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
    button.click({force: true});
    const waited = await page.getByText("Keep waiting");
    await expect(waited).toHaveScreenshot('progress-button-clicked-and-waited.png', { timeout: 10000 });
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
    button.click();
    const waited = await page.getByText("Keep waiting")
    await expect(waited).toHaveScreenshot('progress-button-clicked-and-waited-no-motion.png', { timeout: 10000 });
  });

});

