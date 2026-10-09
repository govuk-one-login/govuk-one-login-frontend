import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";
import deepCloneMerge from "deep-clone-merge";
import nunjucks from "nunjucks";
// @ts-expect-error
import { filters } from "../lib/filters.ts";
// The component spec files mock "../lib/globals" and "../lib/filters" via
// vi.mock, which intercepts imports by module specifier string. Importing with
// an explicit .ts extension uses a different specifier that vitest does not
// intercept, allowing us to get the real (unmocked) modules.
// @ts-expect-error — vitest resolves .ts imports but tsc may complain
import { globals } from "../lib/globals.ts";

// ---------- utilities ----------

type RenderOptions = {
  component?: string;
  params?: Record<string, unknown>;
  ctx?: boolean;
  caller?: string;
  template?: string;
  string?: string;
  ignore?: boolean | string[];
  translate?: boolean;
};

/**
 * Retrieves a nested property from an object using a dot-separated path.
 * e.g. getByPath({ a: { b: 1 } }, "a.b") => 1
 */
const getByPath = (obj: unknown, keyPath: string): unknown => {
  const parts = keyPath.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
};

const loadHtml = (html: string) => {
  return cheerio.load(html);
};

/**
 * Cleans HTML by stripping unnecessary whitespace from a cheerio selection.
 */
export const cleanHtml = (
  $: ReturnType<typeof cheerio.load> | cheerio.Cheerio<any>,
): string => {
  const html =
    typeof $.html === "function"
      ? ($ as ReturnType<typeof cheerio.load>).html()
      : (($ as cheerio.Cheerio<any>).html() ?? "");

  return html
    .replace(/&#x2019;/g, "\u2019")
    .replace(/>\s+/g, ">")
    .replace(/\s+(<\/)/g, "$1")
    .replace(/\r?\n[ \t]*/g, "")
    .trim();
};

/**
 * Loads locale data from a file or directory, merging results with deep-clone-merge.
 */
const loadLocale = (
  p: string,
  stack?: Record<string, unknown>,
): Record<string, unknown> => {
  const stat = fs.statSync(p);

  if (stat.isDirectory()) {
    const files = fs.readdirSync(p);
    let data: Record<string, unknown> = {};
    for (const file of files) {
      if (/\.(json)$/.exec(file)) {
        data = loadLocale(path.resolve(p, file), data) as Record<
          string,
          unknown
        >;
      }
    }
    return data;
  }

  let data: Record<string, unknown>;
  try {
    const text = fs.readFileSync(p).toString();
    if (/\.json$/.exec(p)) {
      data = JSON.parse(text);
    } else {
      throw new Error("Unknown file type");
    }
  } catch (e) {
    throw new Error(
      `Error loading localisation file ${p}: ${(e as Error).message}`,
    );
  }

  if (!stack) return data;

  // mount this file in the correct place in the stack based on filename
  const parts = path.basename(p).split(".");
  parts.pop();
  if (parts[0] === "default") parts.shift();
  while (parts.length) data = { [parts.pop()!]: data };
  return deepCloneMerge(stack, data);
};

/**
 * Registers globals and filters onto a nunjucks environment.
 * Inlined from globals.addGlobals / filters.addFilters to avoid importing
 * those modules (which are mocked in the component test specs).
 */
const registerGlobalsAndFilters = (env: nunjucks.Environment) => {
  for (const name in globals) {
    env.addGlobal(name, (globals as Record<string, unknown>)[name]);
  }
  for (const name in filters) {
    env.addFilter(
      name,
      (filters as Record<string, (...args: any[]) => any>)[name],
    );
  }
};

/**
 * Creates a Nunjucks renderer that returns cheerio-loaded HTML.
 */
const renderer = (
  views: string[],
  locales: string[] | null,
  realistic = false,
) => {
  const nunjucksEnv = nunjucks.configure(views, {
    trimBlocks: true,
    lstripBlocks: true,
  });

  registerGlobalsAndFilters(nunjucksEnv);

  let locale: Record<string, unknown> | undefined;
  if (locales) {
    const loaded = locales.map((l) => loadLocale(l));
    locale = deepCloneMerge(...loaded);
  }

  const render = (
    options: RenderOptions | string,
    context: Record<string, unknown> = {},
  ) => {
    if (typeof options === "string") options = { template: options };

    context = {
      translate: (
        key: string | string[],
        translateOptions: Record<string, unknown> = {},
      ) => {
        translateOptions = { self: true, ...translateOptions };
        if (realistic) {
          if (!locale) return;
          const keys = Array.isArray(key) ? key : [key];
          const found = keys.reduce<string | null>(
            (str, k) => str || (getByPath(locale, k) as string | null),
            null,
          );
          return (
            found ||
            (translateOptions.default as string) ||
            (translateOptions.self && keys[0])
          );
        }

        if (Array.isArray(key)) key = key[0];
        if (!locale) return `[${key}]`;
        const translation =
          (getByPath(locale, key) as string) ||
          (translateOptions.default as string);
        if (
          translateOptions.self &&
          !translation &&
          (options as RenderOptions).ignore !== true &&
          !(
            Array.isArray((options as RenderOptions).ignore) &&
            ((options as RenderOptions).ignore as string[]).includes(key)
          )
        ) {
          throw new Error(`Translation not found for ${key}`);
        }
        return (options as RenderOptions).translate
          ? String(translation)
          : `[${key}]`;
      },
      ctx: (key?: string) => (key ? getByPath(context, key) : context),
      ...context,
    };

    let output: string;

    if ((options as RenderOptions).template) {
      output = nunjucksEnv.render(
        (options as RenderOptions).template!,
        context,
      );
    } else if ((options as RenderOptions).string) {
      output = nunjucksEnv.renderString(
        (options as RenderOptions).string!,
        context,
      );
    } else if ((options as RenderOptions).component) {
      const opts = options as RenderOptions;
      const kebab = opts.component!.replace(
        /([A-Z])/g,
        (l) => `-${l.toLowerCase()}`,
      );
      const filename = `${kebab}/macro.njk`;
      const importString = `{% from "${filename}" import ${opts.component} %}`;
      const args: string[] = [];
      if (opts.ctx) args.push("ctx");
      if (opts.params) args.push(JSON.stringify(opts.params, null, " "));
      const macroString = `${opts.component}(${args.join(",")})`;
      const string = opts.caller
        ? `${importString}{% call ${macroString} %}${opts.caller}{% endcall %}`
        : `${importString}{{ ${macroString} }}`;
      output = nunjucksEnv.renderString(string, context);
    } else {
      throw new Error("Cannot render!");
    }

    return loadHtml(output);
  };

  (render as any).dictionary = locale;

  return render;
};

// ---------- exported helpers ----------

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

export const render = renderer(views, null);

const locales = [path.resolve(__dirname, "locale.json")];

export const renderWithLocale = renderer(views, locales, true);
