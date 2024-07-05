const { expect } = require("chai");

async function findItem(page, pwItem) {
  return await page.locator(`[data-pw=${pwItem}]`);
}

async function clickItem(item) {
  await item.click();
}

async function findAndClickItem(page, pwItem) {
  const item = await findItem(page, pwItem);
  await clickItem(item);
}

async function clickContinueAndWait(page) {
  await findAndClickItem(page, "continue");
  await page.waitForLoadState("networkidle");
}

async function checkElementVisible(element) {
  expect(
    await element.isVisible(),
    `Element ${element} could not be found`,
  ).to.equal(true);
}

async function checkElementsVisible(elements) {
  for (const element of elements) {
    await checkElementVisible(element);
  }
}

async function goToUrl(page, url) {
  await page.goto(url.toString());
}

async function goToPage(page, path) {
  await goToUrl(page, `${process.env.FRONT_END_URL}${path}`);
}

async function getUrlOnItem(page, pwItem) {
  const item = await findItem(page, pwItem);
  return await item.getAttribute("href");
}

async function checkOnRightPage(page, path) {
  const url = await page.url();
  const baseUrl = url.split("?")[0];
  expect(baseUrl).to.equal(`${process.env.FRONT_END_URL}${path}`);
}

module.exports = {
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
