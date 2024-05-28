import nunjucks from "nunjucks";
import cheerio from "cheerio";

export default function render(macroName: string, params = {}, children = false) {
  if (typeof params === "undefined") {
    throw new Error(
      "Parameters passed to `render` should be an object but are undefined"
    );
  }

  const macroParams = JSON.stringify(params, null, 2);

  let macroString = `{%- from "./macro.njk" import ${macroName} -%}`;

  if (children) {
    macroString += `{%- call ${macroName}(${macroParams}) -%}${children}{%- endcall -%}`;
  } else {
    macroString += `{{- ${macroName}(${macroParams}) -}}`;
  }

  const output = nunjucks.renderString(macroString, {});

  return cheerio.load(output);
}
