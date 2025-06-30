import { test, expect } from '@playwright/test';

test.describe('Footer component visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/welcome');
  });

  test('should match visual snapshot of the footer', async ({ page }) => {
    const footer = await page.locator('[aria-label="footer"]');
    await expect(footer).toHaveScreenshot('footer-default.png');
  });
});