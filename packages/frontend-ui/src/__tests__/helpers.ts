import path from "node:path";
import nunjucksTest from "hmpo-nunjucks-test";
import { filters } from "../lib/filters";
import { globals } from "../lib/globals";

const views = [
  path.resolve(__dirname, "..", "..", "components"),
  path.resolve(__dirname, "..", "..", ".."),
  path.resolve(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "node_modules",
    "govuk-frontend",
    "dist",
  ),
];

export const render = nunjucksTest.renderer(views, null, globals, filters);

const locales = [path.resolve(__dirname, "locale.json")];

export const renderWithLocale = nunjucksTest.renderer(
  views,
  locales,
  globals,
  filters,
  true,
);
export const cleanHtml = nunjucksTest.cleanHtml;
