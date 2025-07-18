import { test, expect } from '@playwright/test';

test.describe('Skip Link Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/welcome');
  });

  test('should match visual snapshot default state', async ({ page }) => {
    const skipLink = page.locator('.govuk-skip-link');
    await expect(skipLink).toBeVisible();

    await expect(skipLink).toHaveScreenshot('skip-link-default.png');

    await expect(page).toHaveScreenshot('skip-link-default-fullpage.png', {
      fullPage: true,
    });
  });
});