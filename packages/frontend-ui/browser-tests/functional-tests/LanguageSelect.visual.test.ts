import { test, expect } from '@playwright/test';

test.describe('Language Select component visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/welcome');
  });

  test('should match visual snapshot of language select component with English default', async ({ page }) => {
    const languageNav = page.locator('nav.language-select');
    await expect(languageNav).toBeVisible();
    await expect(languageNav).toHaveScreenshot('language-select-default-en.png');

    await expect(page).toHaveScreenshot('language-select-en-fullpage.png', {
        fullPage: true,
    });
  });
  
  test('should match visual snapshot with Cymraeg selected', async ({ page }) => {
    await page.goto('http://localhost:3000/welcome?lang=cy&lng=cy');
    
    const languageNav = page.locator('nav.language-select');
    await expect(languageNav).toBeVisible();
    await expect(languageNav).toHaveScreenshot('language-select-cy.png');
    
    await expect(page).toHaveScreenshot('language-select-cy-fullpage.png', {
        fullPage: true,
    });
  });
});