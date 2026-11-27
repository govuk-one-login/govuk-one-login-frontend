import { JSDOM } from "jsdom";
import _ from "lodash";
import { axe } from "vitest-axe";
import type { AxeMatchers } from "vitest-axe/matchers";
import * as axeMatchers from "vitest-axe/matchers";

// Ensures TS recognises axe matchers on vitest
declare module "vitest" {
  interface Assertion<T = any> extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}

expect.extend(axeMatchers);

type Input = string | Element | Document;
type Options = { wrapMain?: boolean; wrapBody?: boolean };

const isElement = (value: Input): value is Element =>
  typeof (value !== "string") && !!(value as Element).outerHTML;

const isDocument = (value: Input): value is Document =>
  typeof (value !== "string") &&
  !!(value as Document).body &&
  !!(value as Document).body.innerHTML;

const defaultOptions = { wrapMain: true, wrapBody: true };

/**
 * Wraps a piece of HTML in dummy landmarks (if necessary) and checks for aXe violations.
 * Must be awaited to avoid axe.run errors.
 * @param {string | Element | Document} html - The rendered content to check for violations.
 * @param {Options} options - Options for wrapping HTML with body / main tags. Both default to true.
 */
export const expectComponentToHaveNoAxeViolations = async (
  html: string | Element | Document,
  options: Options = {},
) => {
  options = _.extend(defaultOptions, options);
  if (!html) {
    throw new Error(`Expected HTML or element to check, but got ${html}`);
  }
  if (isDocument(html)) {
    html = html.body.innerHTML;
  }
  if (isElement(html)) {
    html = html.outerHTML;
  }
  const axeDom = new JSDOM(
    `<!DOCTYPE html>
    ${options.wrapBody ? "<body>" : ""}
    ${options.wrapMain ? "<main>" : ""}
    ${html}
    ${options.wrapMain ? "</main>" : ""}
    ${options.wrapBody ? "</body>" : ""}`,
  );
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  try {
    // @ts-expect-error assigning jsdom globals for the axe run
    globalThis.window = axeDom.window;
    globalThis.document = axeDom.window.document;
    const results = await axe(axeDom.window.document.body.outerHTML);
    expect(results).toHaveNoViolations();
  } finally {
    globalThis.window = originalWindow;
    globalThis.document = originalDocument;
  }
};
