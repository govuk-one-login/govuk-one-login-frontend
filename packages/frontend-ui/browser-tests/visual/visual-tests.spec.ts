import { test, expect } from '@playwright/test';

test.describe('Header visual regression', () => {
  test('should match the header snapshot', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForTimeout(500)
    const header = page.locator('.govuk-header');
    await expect(header).toHaveScreenshot('header.png');
  });
});

test.describe('cookie banner visual regression', () => {
  test('should match the cookie-banner snapshot', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForTimeout(500)
    const cookieBanner = page.locator('.govuk-cookie-banner');
    await expect(cookieBanner).toHaveScreenshot('cookie-banner.png');
  });
});

test.describe('phase banner visual regression', () => {
  test('should match the phase-banner snapshot', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForTimeout(500)
    const phaseBanner = page.locator('.govuk-phase-banner');
    await expect(phaseBanner).toHaveScreenshot('phase-banner.png');
  });
});

test.describe('language select visual regression', () => {
  test('should match the language-select snapshot', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForTimeout(500)
    const languageSelect = page.locator('.language-select');
    await expect(languageSelect).toHaveScreenshot('language-select.png');
  });
});

test.describe('footer visual regression', () => {
  test('should match the footer snapshot', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForTimeout(500)
    const footer = page.locator('.govuk-footer');
    await expect(footer).toHaveScreenshot('footer.png');
  });
});