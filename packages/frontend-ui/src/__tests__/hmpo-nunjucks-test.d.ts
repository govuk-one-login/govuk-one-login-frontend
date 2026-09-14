declare module "hmpo-nunjucks-test" {
  import { CheerioAPI } from "cheerio";

  function renderer(
    views: string[],
    locales: string[] | null,
    globals: object,
    filters: object,
    withLocale?: boolean,
  ): (...args: unknown[]) => CheerioAPI;

  function cleanHtml(
    html: import("cheerio").Cheerio<import("domhandler").Element> | string,
  ): string;

  export { cleanHtml, renderer };
}
