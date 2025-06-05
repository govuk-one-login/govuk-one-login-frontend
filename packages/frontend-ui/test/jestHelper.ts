import nunjucks from "nunjucks";
import { JSDOM } from "jsdom";
import path from "path";

const nunjucksEnv = nunjucks.configure(path.resolve(__dirname, "../../packages/frontend-ui/components"), {
  autoescape: true,
  noCache: true,
});

export function render(macroName: string, params = {}) {
  if (Object.keys(params).length === 0 && params.constructor === Object) {
    throw new Error(
      "Parameters passed to `render` should be an object but are undefined",
    );
  }

  const macroParams = JSON.stringify(params, null, 2);
  const macroPath = `./${path.relative(process.cwd(), path.resolve(__dirname, "./../components"))}`;
  let macroString = `{% from "${macroPath}/${macroName}/macro.njk" import ${macroName} %}`;
  macroString += `{{ ${macroName}(${macroParams}) }}`;
  
  console.log("PATH", macroPath);
  console.log("NAME:", macroName);

  console.log("STRING:", macroString);

  const output = nunjucks.renderString(macroString, {});
  const dom = new JSDOM(output);
  return dom.window.document;
}