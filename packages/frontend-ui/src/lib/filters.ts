import debugLib from "debug";
import type { Environment as NunjucksEnvironment } from "nunjucks";
import type { HmpoFilterCondition, HmpoTranslateFn } from "./types";

const debug = debugLib("hmpo:components:filters");

import { posix as path } from "node:path";
import bytes from "bytes";
import moment from "moment";

type GlobalThis = {
  ctx: {
    translate?: HmpoTranslateFn;
    baseUrl?: string;
  };
};

const filters = {
  currency(
    input: string,
    {
      currencySymbol = "£",
      zeroValue,
      penceToPound,
    }: {
      currencySymbol?: string;
      zeroValue?: number | string;
      penceToPound?: boolean;
    } = {},
  ) {
    let value: string | number = parseFloat(input);
    if (Number.isNaN(value)) {
      return input;
    } else if (zeroValue !== undefined && value === 0) {
      return zeroValue;
    } else if (penceToPound) {
      value = value / 100;
    }

    if (value % 1 === 0) {
      value = value.toString();
    } else {
      value = value.toFixed(2);
    }
    return currencySymbol + value;
  },

  currencyOrFree(this: GlobalThis, value: string, options: unknown) {
    return filters.currency.call(
      this,
      value,
      Object.assign(
        { zeroValue: filters.translate.call(this, "free") },
        options,
      ),
    );
  },

  date(txt: string, format = "D MMMM YYYY", locale = "en", invalid = "") {
    if (!txt) return invalid;
    const date = moment(txt);
    if (!date.isValid()) return invalid;
    date.locale(locale);
    return date.format(format);
  },

  hyphenate(txt: string) {
    if (typeof txt !== "string") return txt;
    return txt.trim().toLowerCase().replace(/\s+/g, "-");
  },

  uppercase(txt: string) {
    if (typeof txt !== "string") return txt;
    return txt.toUpperCase();
  },

  lowercase(txt: string) {
    if (typeof txt !== "string") return txt;
    return txt.toLowerCase();
  },

  capscase(txt: string) {
    if (typeof txt !== "string") return txt;
    return txt.substr(0, 1).toUpperCase() + txt.substr(1);
  },

  camelcase(txt: string) {
    if (typeof txt !== "string") return txt;
    return txt
      .toLowerCase()
      .replace(/^[^a-z0-9]+/g, "")
      .replace(/[^a-z0-9]+$/g, "")
      .replace(/[^a-z0-9]+([a-z])/g, (_, letter) => letter.toUpperCase());
  },

  possessive(txt: string, lang = "en", curly = true) {
    if (typeof txt !== "string") return txt;
    const apos = curly ? "’" : "'";
    if (lang === "en")
      return txt.slice(-1) === "s" ? txt + apos : `${txt + apos}s`;
    return txt;
  },

  /**
   * Use on whole sentences
   */
  time(
    value: string,
    { short, midnight, midday } = { short: true, midnight: true, midday: true },
  ) {
    if (midnight) {
      value = value.replace(/12:00am/gi, "midnight");
      value = value.replace(/^midnight/, "Midnight");
    }
    if (midday) {
      value = value.replace(/12:00pm/gi, "midday");
      value = value.replace(/^midday/, "Midday");
    }
    if (short) {
      value = value.replace(/:00(am|pm)/gi, "$1");
    }
    return value;
  },

  // fake first this (removed in compilation)
  translate(this: GlobalThis, txt: string, options?: Record<string, unknown>) {
    return this.ctx.translate ? this.ctx.translate(txt, options) : txt;
  },

  jsonStringify(obj: Record<string, unknown>) {
    return JSON.stringify(obj, null, 2);
  },

  // fake first this (removed in compilation)
  url(this: GlobalThis, url: string) {
    return this.ctx.baseUrl ? path.resolve(this.ctx.baseUrl, url) : url;
  },

  urlencode(url: string) {
    return typeof url === "string" ? encodeURIComponent(url) : url;
  },

  bytes(value: unknown) {
    return typeof value === "number" ? bytes(value) : value;
  },

  filter(
    obj: Record<string, Record<string, unknown>>,
    condition: HmpoFilterCondition,
  ) {
    if (!obj) return obj;
    if (Array.isArray(obj)) {
      if (condition === undefined) return obj.filter((i) => i);
      else if (condition === null)
        return obj.filter((i) => i !== null && i !== undefined);
      else if (typeof condition === "object") {
        const cnd = condition;
        return obj.filter((i) => {
          if (!i) return false;
          return Object.keys(cnd).filter((key) => i[key] === cnd[key]).length;
        });
      }
      const cnd = String(condition);
      return obj.filter((i) => i?.[cnd]);
    }
    if (typeof obj === "object") {
      let keys = Object.keys(obj);
      if (condition === undefined) keys = keys.filter((i) => obj[i]);
      else if (condition === null)
        keys = keys.filter((i) => obj[i] !== null && obj[i] !== undefined);
      else if (typeof condition === "object") {
        const cnd = condition;
        keys = keys.filter((i) => {
          if (!obj[i]) return false;
          return Object.keys(cnd).filter((key) => obj[i][key] === cnd[key])
            .length;
        });
      } else {
        const cnd = String(condition);
        keys = keys.filter((i) => obj[i]?.[cnd]);
      }
      const result: Record<string, unknown> = {};
      keys.forEach((key) => {
        result[key] = obj[key];
      });
      return result;
    }
    return obj;
  },

  push(array: Array<unknown>, item: unknown) {
    if (Array.isArray(array)) return [...array, item];
    return array;
  },

  unshift(array: Array<unknown>, item: unknown) {
    if (Array.isArray(array)) return [item, ...array];
    return array;
  },

  add(obj: Record<string, unknown>, key: string, item: unknown) {
    if (obj && typeof obj === "object")
      return Object.assign({}, obj, { [key]: item });
    return obj;
  },

  delete(obj: Record<string, unknown>, key: string) {
    if (obj && typeof obj === "object") {
      obj = Object.assign({}, obj);
      delete obj[key];
    }
    return obj;
  },
};

const addFilters = (env: NunjucksEnvironment) => {
  debug("adding filters");
  for (const name in filters)
    env.addFilter(
      name,
      (filters as Record<string, (...args: any[]) => any>)[name],
    );
};

export { addFilters, filters };
