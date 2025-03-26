import path from "path";
import { JSDOM } from "jsdom";
import nunjucks from "nunjucks";

export function render(macroName: string, params = {}) {
  if (Object.keys(params).length === 0 && params.constructor === Object) {
    throw new Error(
      "Parameters passed to `render` should be an object but are undefined",
    );
  }

  const macroParams = JSON.stringify(params, null, 2);

  const macroPath = `./${path.relative(process.cwd(), path.resolve(__dirname, "../src/macro.njk"))}`;
  let macroString = `{%- from "${macroPath}" import ${macroName} -%}`;
  macroString += `{{- ${macroName}(${macroParams}) -}}`;

  const output = nunjucks.renderString(macroString, {});

  const dom = new JSDOM(output);

  return dom.window.document;
}
