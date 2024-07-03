const cheerio = require("cheerio");
const nunjucks = require("nunjucks");

function render(componentName, macroName, params, children = false) {
  if (typeof params === "undefined") {
    throw new Error(
      "Parameters passed to `render` should be an object but are undefined",
    );
  }

  const macroParams = JSON.stringify(params, null, 2);

  let macroString = `{%- from "${componentName}/macro.njk" import ${macroName} -%}`;

  if (children) {
    macroString += `{%- call ${macroName}(${macroParams}) -%}${children}{%- endcall -%}`;
  } else {
    macroString += `{{- ${macroName}(${macroParams}) -}}`;
  }

  const output = nunjucks.renderString(macroString);

  return cheerio.load(output);
}

module.exports = { render };
