import { test, expect } from '@playwright/test';

test.describe('Header component visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/welcome');
  });

  test('should match visual snapshot of default header', async ({ page }) => {
    const header = await page.locator('header.govuk-header');
    await expect(header).toHaveScreenshot('header-default.png');
  });

  test('should take screenshots before and after clicking "Sign out"', async ({ page }) => {
    const signOutLink = page.locator('a[href="https://signin.account.gov.uk/signed-out"]');
    const header = page.locator('header.govuk-header');

    // Step 1: Prevent navigation, simulate click, and screenshot header
    await page.evaluate(() => {
      const link = document.querySelector('a[href="https://signin.account.gov.uk/signed-out"]');
      if (link) {
        link.addEventListener('click', (e) => e.preventDefault());
      }
    });

    await signOutLink.click();
    await page.waitForTimeout(200);

    await expect(header).toHaveScreenshot('header-after-signout-click-no-nav.png');

    // Step 2: Manual navigation to sign out page then take a screenshot after navigated.
    await page.goto('https://signin.account.gov.uk/signed-out');
    
    const newHeader = page.locator('header.govuk-header');
    await expect(newHeader).toBeVisible();
    await expect(newHeader).toHaveScreenshot('header-after-signout-navigated.png');
  });

});
