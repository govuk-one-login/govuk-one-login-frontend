import { cleanHtml } from "hmpo-nunjucks-test";
import { axe, toHaveNoViolations } from "jest-axe";
import { JSDOM } from "jsdom";

expect.extend(toHaveNoViolations);

// Must be awaited to avoid axe.run errors!
export const expectComponentToHaveNoAxeViolations = async (
  html: string | Element,
) => {
  const axeDom = new JSDOM(`<!DOCTYPE html><body><main>${html}</main></body>`);
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  // @ts-expect-error assigning jsdom globals for the axe run
  globalThis.window = axeDom.window;
  globalThis.document = axeDom.window.document;
  const results = await axe(axeDom.window.document.body.outerHTML);
  expect(results).toHaveNoViolations();
  globalThis.window = originalWindow;
  globalThis.document = originalDocument;
};
