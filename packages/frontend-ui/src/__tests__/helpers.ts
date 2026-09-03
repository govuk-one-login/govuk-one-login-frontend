import nunjucksTest from "hmpo-nunjucks-test";
import path from "path";
import { globals } from "../lib/globals";
import { filters } from "../lib/filters";

const views = [
  path.resolve(__dirname, "..", "..", "components"),
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

const locales = [path.resolve(__dirname, "locale.json")];

export const render = nunjucksTest.renderer(views, null, globals, filters);

// Used in other components, will be reenabled or deleted as part of that work
// export const renderWithLocale = nunjucksTest.renderer(
//   views,
//   locales,
//   globals,
//   filters,
//   true,
// );
// global.cleanHtml = nunjucksTest.cleanHtml;
