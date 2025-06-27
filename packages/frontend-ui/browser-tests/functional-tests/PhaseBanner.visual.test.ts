import { test, expect } from '@playwright/test';

test.describe('Phase Banner Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/welcome');
  });

  test('should match visual snapshot in default state', async ({ page }) => {
    const banner = page.locator('.govuk-phase-banner');
    await expect(banner).toBeVisible();
    await expect(banner).toHaveScreenshot('phase-banner-default.png');
  });

});