import nunjucks from "nunjucks";
import { JSDOM } from "jsdom";
import path from "path";
import { addLanguageParam, contactUsUrl } from "../index";

const govukComponentsPath = path.resolve(
  __dirname,
  "../../../../node_modules/govuk-frontend",
);
const frontendUIComponentsPath = path.resolve(__dirname, "../../components");
const frontendUIBuildPath = path.resolve(__dirname, "../../../");
const stubs = path.resolve(__dirname, "./stubs");
export const nunjucksEnv = nunjucks.configure(
  [frontendUIComponentsPath, govukComponentsPath, frontendUIBuildPath, stubs],
  {
    autoescape: true,
    noCache: true,
  },
);
nunjucksEnv.addGlobal("addLanguageParam", addLanguageParam);
nunjucksEnv.addGlobal("contactUsUrl", contactUsUrl);
nunjucksEnv.addGlobal("MAY_2025_REBRAND_ENABLED", true);
nunjucksEnv.addFilter("translate", function () {
  return "";
});

export function render(macroFolder: string, macroName: string, params = {}) {
  const macroParams = JSON.stringify(params, null, 2);

  let macroString = `{% from "${macroFolder}/macro.njk" import ${macroName} %}`;
  macroString += `{{ ${macroName}(${macroParams}) }}`;

  const output = nunjucksEnv.renderString(macroString, params);
  const dom = new JSDOM(output);
  return dom.window.document;
}

export function renderTemplate(macroPath: string, params = {}) {
  const macroString = `{% extends "bases/${macroPath}" %}`;

  const output = nunjucksEnv.renderString(macroString, params);
  const dom = new JSDOM(output);
  return dom.window.document;
}
