import { expect } from "chai";
import type { Page, Locator } from "playwright";

async function findItem(page: Page, pwItem: string) {
  return await page.locator(`#${pwItem}`);
}

async function clickItem(item: Locator) {
  await item.click();
}

async function findAndClickItem(page: Page, pwItem: string) {
  const item = await findItem(page, pwItem);
  await clickItem(item);
}

async function clickContinueAndWait(page: Page) {
  await findAndClickItem(page, "continue");
  await page.waitForLoadState("networkidle");
}

async function checkElementVisible(element: Locator) {
  expect(
    await element.isVisible(),
    `Element ${element} could not be found`,
  ).to.equal(true);
}

async function checkElementsVisible(elements: Locator[]) {
  for (const element of elements) {
    await checkElementVisible(element);
  }
}

async function goToUrl(page: Page, url: string) {
  await page.goto(url.toString());
}

async function goToPage(page: Page, path: string) {
  await goToUrl(page, `${process.env.FRONT_END_URL}${path}`);
}

async function getUrlOnItem(page: Page, pwItem: string) {
  const item = await findItem(page, pwItem);
  return await item.getAttribute("href");
}

async function checkOnRightPage(page: Page, path: string) {
  const url = await page.url();
  const baseUrl = url.split("?")[0];
  expect(baseUrl).to.equal(`${process.env.FRONT_END_URL}${path}`);
}

export {
  findItem,
  findAndClickItem,
  clickContinueAndWait,
  checkElementVisible,
  checkElementsVisible,
  goToUrl,
  goToPage,
  checkOnRightPage,
  getUrlOnItem,
};
