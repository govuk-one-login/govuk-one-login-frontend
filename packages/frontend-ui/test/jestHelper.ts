import nunjucks from "nunjucks";
import { JSDOM } from "jsdom";
import path from "path";

const componentsPath = path.resolve(__dirname, "../../frontend-ui/components");
console.log(componentsPath);
const nunjucksEnv = nunjucks.configure(componentsPath, {
  autoescape: true,
  noCache: true,
});

nunjucksEnv.addGlobal('componentsPath', componentsPath);

export function render(macroName: string, params = {}) {
  if (Object.keys(params).length === 0 && params.constructor === Object) {
    throw new Error(
      "Parameters passed to `render` should be an object but are undefined",
    );
  }

  const macroParams = JSON.stringify(params, null, 2);

  const macroPath = `./${macroName}`;
  let macroString = `{% from "${macroName}/macro.njk" import ${macroName} %}`;
  macroString += `{{ ${macroName}(${macroParams}) }}`;

  console.log("COMPONENTS PATH", componentsPath); 
  console.log("MACRO PATH", macroPath);
  console.log("NAME:", macroName);
  console.log("STRING:", macroString);


const output = nunjucksEnv.renderString(macroString, params);
const dom = new JSDOM(output);
return dom.window.document;
}