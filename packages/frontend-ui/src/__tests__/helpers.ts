import path from "node:path";
import nunjucksTest from "hmpo-nunjucks-test";
import { filters } from "../lib/filters";
import { globals } from "../lib/globals";

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

export const render = nunjucksTest.renderer(views, null, globals, filters);

// Used in other components, will be reenabled or deleted as part of that work
// const locales = [path.resolve(__dirname, "locale.json")];

// export const renderWithLocale = nunjucksTest.renderer(
//   views,
//   locales,
//   globals,
//   filters,
//   true,
// );
// global.cleanHtml = nunjucksTest.cleanHtml;
