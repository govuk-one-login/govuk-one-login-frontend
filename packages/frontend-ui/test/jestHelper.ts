import nunjucks from "nunjucks";
import { JSDOM } from "jsdom";
import path from "path";
import { addLanguageParam, contactUsUrl } from "../src/index";

const frontendUIComponentsPath = path.resolve(
  __dirname,
  "../../frontend-ui/components",
);
const govukComponentsPath = path.resolve(
  __dirname,
  "../../../node_modules/govuk-frontend",
);
const nunjucksEnv = nunjucks.configure(
  [frontendUIComponentsPath, govukComponentsPath],
  {
    autoescape: true,
    noCache: true,
  },
);
nunjucksEnv.addGlobal("addLanguageParam", addLanguageParam);
nunjucksEnv.addGlobal("contactUsUrl", contactUsUrl);
nunjucksEnv.addGlobal("May_2025_Rebrand", false);

export function render(macroFolder: string, macroName: string, params = {}) {
  const macroParams = JSON.stringify(params, null, 2);

  let macroString = `{% from "${macroFolder}/macro.njk" import ${macroName} %}`;
  macroString += `{{ ${macroName}(${macroParams}) }}`;

  const output = nunjucksEnv.renderString(macroString, params);
  const dom = new JSDOM(output);
  return dom.window.document;
}
