import { test, expect } from '@playwright/test';

test.describe('Step Card visual regression', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/step-card');
  });

  test('should match visual snapshot in default state', async ({ page }) => {
    const stepCard = page.locator('.step-card');
    await expect(stepCard).toBeVisible();
    await expect(stepCard).toHaveScreenshot('step-card-default.png');
  });

  test('should match visual snapshot - full page', async ({ page }) => {
    await expect(page).toHaveScreenshot('step-card-fullpage.png', { fullPage: true });
  });

  test('should match visual snapshot in Welsh', async ({ page }) => {
    await page.goto('http://localhost:3000/step-card?lng=cy');
    const stepCard = page.locator('.step-card');
    await expect(stepCard).toBeVisible();
    await expect(stepCard).toHaveScreenshot('step-card-welsh.png');
  });

  test('should match visual snapshot at small screen size', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    const stepCard = page.locator('.step-card');
    await expect(stepCard).toBeVisible();
    await expect(stepCard).toHaveScreenshot('step-card-small-screen.png');
  });

  test('should match visual snapshot at very small screen size with stacked images', async ({ page }) => {
    await page.setViewportSize({ width: 280, height: 568 });
    const stepCard = page.locator('.step-card');
    await expect(stepCard).toBeVisible();
    await expect(stepCard).toHaveScreenshot('step-card-very-small-screen.png');
  });

});

test.describe('Step Card functional', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/step-card');
  });

  test('should render the correct number of steps', async ({ page }) => {
    const steps = page.locator('.step-item');
    await expect(steps).toHaveCount(4);
  });

  test('should render the heading', async ({ page }) => {
    const heading = page.locator('.step-card h2');
    await expect(heading).toBeVisible();
    await expect(heading).not.toBeEmpty();
  });

  test('should render step numbers in order', async ({ page }) => {
    const numbers = page.locator('.step-number');
    await expect(numbers).toHaveCount(4);
    await expect(numbers.nth(0)).toContainText('1.');
    await expect(numbers.nth(1)).toContainText('2.');
    await expect(numbers.nth(2)).toContainText('3.');
    await expect(numbers.nth(3)).toContainText('4.');
  });

  test('should render step titles in order', async ({ page }) => {
    const titles = page.locator('.step-header');
    await expect(titles).toHaveCount(4);
    await expect(titles.nth(0)).toContainText('Download or open the app');
    await expect(titles.nth(1)).toContainText('Scan photo ID');
    await expect(titles.nth(2)).toContainText('Take a selfie');
    await expect(titles.nth(3)).toContainText('Continue on GOV.UK website');
  });

  test('should render bullet list on the last step', async ({ page }) => {
    const lastStep = page.locator('.step-item').last();
    const bulletList = lastStep.locator('.govuk-list--bullet');
    await expect(bulletList).toBeVisible();
    const items = bulletList.locator('li');
    await expect(items.first()).not.toBeEmpty();
  });

  test('should have empty alt on all images', async ({ page }) => {
    const images = page.locator('.step-item-image img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      await expect(images.nth(i)).toHaveAttribute('alt', '');
    }
  });

  test('should have aria-hidden on image containers', async ({ page }) => {
    const imageContainers = page.locator('.step-item-image');
    const count = await imageContainers.count();
    for (let i = 0; i < count; i++) {
      await expect(imageContainers.nth(i)).toHaveAttribute('aria-hidden', 'true');
    }
  });

  test('should switch to Welsh when lng=cy is set', async ({ page }) => {
    await page.goto('http://localhost:3000/step-card?lng=cy');
    const heading = page.locator('.step-card h2');
    await expect(heading).toHaveText('Cwblhewch y camau canlynol');
  });

  test('images should stack vertically at very small screen size', async ({ page }) => {
    await page.setViewportSize({ width: 280, height: 568 });
    const container = page.locator('.step-item-container').first();
    const flexDirection = await container.evaluate(
      (el) => window.getComputedStyle(el).flexDirection
    );
    expect(flexDirection).toBe('column');
  });

});
