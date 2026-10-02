import { cleanHtml } from "hmpo-nunjucks-test";
import { axe, toHaveNoViolations } from "jest-axe";
import { JSDOM } from "jsdom";

expect.extend(toHaveNoViolations);

// Must be awaited to avoid axe.run errors!
export const expectComponentToHaveNoAxeViolations = async (
  html: string | Element,
  wrapBody: boolean = true,
) => {
  const axeDom = new JSDOM(
    wrapBody
      ? `<!DOCTYPE html><body><main>${html}</main></body>`
      : `<!DOCTYPE html>${html}`,
  );
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  // @ts-expect-error assigning jsdom globals for the axe run
  globalThis.window = axeDom.window;
  globalThis.document = axeDom.window.document;
  // console.log(axeDom.window.document.body.outerHTML);
  const results = await axe(axeDom.window.document.body.outerHTML);
  expect(results).toHaveNoViolations();
  globalThis.window = originalWindow;
  globalThis.document = originalDocument;
};
