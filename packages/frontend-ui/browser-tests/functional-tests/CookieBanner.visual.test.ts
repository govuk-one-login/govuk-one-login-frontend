import { test, expect } from '@playwright/test';

test.describe('Cookie Banner visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/welcome');
    await page.addStyleTag({ content: `
      * {
        animation: none !important;
        transition: none !important;
      }
    `})
  });

  test('should match visual snapshot in default state', async ({ page }) => {
    const banner = await page.locator('#cookies-banner-main');
    await expect(banner).toHaveScreenshot('cookie-banner-default.png');
  });

  test('should match visual snapshot after accepting cookies', async ({ page }) => {
    await page.locator('button[name="cookiesAccept"]').click();
    const accepted = await page.locator('#cookies-accepted');
    await expect(accepted).toHaveScreenshot('cookie-banner-accepted.png');
  });

  test('should match visual snapshot after rejecting cookies and then hide cookie banner', async ({ page }) => {
    await page.reload();
    // Reload the page to reset state (since previous test may accept cookies)
    await page.locator('button[name="cookiesReject"]').click();
    const rejected = await page.locator('#cookies-rejected');
    await expect(rejected).toHaveScreenshot('cookie-banner-rejected.png');
    
    // Then click on the hide banner button
    await page.locator('#cookies-rejected .cookie-hide-button').click();
    await expect(page).toHaveScreenshot('cookie-banner-rejected-hidden.png');
  });

});

