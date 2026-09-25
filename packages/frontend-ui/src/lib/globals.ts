import debugLib from "debug";

const debug = debugLib("hmpo:components:globals");

import deepCloneMerge from "deep-clone-merge";
import type { Environment as NunjucksEnvironment } from "nunjucks";
import _ from "underscore";
import type {
  HmpoContext,
  HmpoError,
  HmpoFieldOptions,
  HmpoItem,
  HmpoKey,
  HmpoLabel,
  HmpoOptionType,
  HmpoParams,
  HmpoPlaceholder,
  HmpoTranslateFn,
} from "./types";

const globals = {
  isArray(arr: unknown) {
    return Array.isArray(arr);
  },

  isObject(obj: unknown) {
    return obj !== null && typeof obj === "object" && !Array.isArray(obj);
  },

  isString(str: unknown) {
    return typeof str === "string";
  },

  isNumber(num: unknown) {
    return typeof num === "number";
  },

  isBoolean(bool: unknown) {
    return typeof bool === "boolean";
  },

  startsWith(str: unknown, substr: string) {
    return typeof str === "string" && str.startsWith(substr);
  },

  endsWith(str: unknown, substr: string) {
    return typeof str === "string" && str.endsWith(substr);
  },

  merge(...src: Array<object | undefined>) {
    return _.pick(deepCloneMerge(...src), (v) => v !== undefined);
  },

  set(obj: { [key: string]: unknown }, key: string, value: unknown) {
    obj[key] = value;
    return obj[key];
  },

  substr(str: unknown, start: number, length: number) {
    return typeof str === "string" ? str.substr(start, length) : "";
  },

  hmpoGetParams(ctx: HmpoContext, params: HmpoParams, ...base: object[]) {
    const options =
      params && (ctx(`options.fields.${params.id}`) as HmpoFieldOptions);
    const mergedItems: { items?: HmpoItem[] } = {};
    if (options?.items && params?.items) {
      const indexedParamItems = _.isArray(params.items)
        ? _.indexBy(params.items, "value")
        : params.items;
      mergedItems.items = options.items.map((i) => {
        if (typeof i !== "object") i = { value: i };
        const r = deepCloneMerge(i, indexedParamItems[i.value]) as HmpoItem;
        return r;
      });
    }
    return deepCloneMerge(...base, options, params, mergedItems);
  },

  hmpoGetValidator(
    _ctx: HmpoContext,
    params: HmpoParams,
    type: HmpoParams["validate"],
  ) {
    if (!params.validate) return;
    if (params.validate === type) return { type };
    if (!Array.isArray(params.validate)) return;
    if (params.validate.includes(type)) return { type };
    const validator = params.validate.filter((v) => v.type === type)[0];
    if (!validator) return;
    return {
      type,
      arguments: Array.isArray(validator.arguments)
        ? validator.arguments
        : validator.arguments
          ? [validator.arguments]
          : [],
    };
  },

  hmpoGetAttributes(
    _ctx: HmpoContext,
    params: HmpoParams,
    attributes: Record<string, string>,
  ) {
    return params.attributes
      ? globals.merge(attributes, params.attributes)
      : attributes;
  },

  hmpoGetValidatorAttribute(
    ctx: HmpoContext,
    params: HmpoParams,
    type: string,
    // type: HmpoParams["validate"],
    value = true,
    falseValue = typeof value === "boolean" ? false : undefined,
  ) {
    const validator = globals.hmpoGetValidator(ctx, params, type);
    if (!validator) return falseValue;
    if (typeof value === "number") return validator.arguments[value];
    return value;
  },

  hmpoGetItems(
    ctx: HmpoContext,
    params: HmpoParams,
    value: string | number,
    required: boolean,
    setIdsBasedOnValues: boolean,
    defaults: Array<HmpoItem>,
  ) {
    const translate = ctx("translate") as HmpoTranslateFn;
    let items: Array<HmpoItem | HmpoPlaceholder> =
      params.items || params.options || defaults || [];
    const conditionals = params.conditionals || {};
    const contentKey = `fields.${params.contentKey || params.id}`;
    let placeholder: Partial<HmpoParams["placeholder"]> = params.placeholder;
    if (placeholder === true) placeholder = { value: "" };
    if (placeholder) {
      const key = placeholder.key || `${contentKey}.placeholder`;
      placeholder.text = translate(key, { default: " " });
      if (required) placeholder.disabled = true;
      if (value === undefined || value === "") placeholder.selected = true;
      items = [placeholder as HmpoPlaceholder, ...items];
    }
    items = items.map((item, index) => {
      if (typeof item === "string") item = { value: item };

      if (item.divider) {
        if (typeof item.divider !== "string") {
          const key: HmpoKey = (item.key as HmpoKey) || [
            `${contentKey}.divider.label`,
            "fields.default.divider.label",
          ];
          item.divider = translate(key);
        }
        return item;
      }

      if (!item.text && !item.html) {
        const key = (item.key as HmpoKey) || [
          `${contentKey}.items.${item.value}.label`,
          `fields.default.items.${item.value}.label`,
        ];
        item.html = item.text = translate(key);
      }
      if (!item.name) item.name = params.id;
      if (item.value !== undefined) {
        if (Array.isArray(value) && value.includes(item.value))
          item.selected = item.checked = true;
        if (value === item.value) item.selected = item.checked = true;
      }
      const conditional = conditionals[item.value];
      if (conditional) {
        if (!params.inline) {
          item.conditional =
            typeof conditional === "string"
              ? { html: conditional }
              : conditional;
        } else if (conditional.id) {
          item.attributes = item.attributes || {};
          item.attributes["data-aria-controls"] = conditional.id;
        }
      }
      if (setIdsBasedOnValues) {
        const cleanedValue = String(item.value).replace(/[^a-zA-Z0-9]+/g, "");
        if (cleanedValue) item.id = `${params.id}-${cleanedValue}`;
      }
      if (item.id) {
        item.label = globals.merge(
          {
            attributes: { id: `${item.id}-label` },
          },
          item.label,
        ) as HmpoLabel;
      }

      // override id of first item to be field name for accessibility
      if (setIdsBasedOnValues && index === 0) item.id = params.id;

      if (!item.hint || (!item.hint.html && !item.hint.text)) {
        const key = [
          `${contentKey}.items.${item.value}.hint`,
          `fields.default.items.${item.value}.hint`,
        ];
        const html = translate(key, { self: false });
        if (html) {
          if (!item.hint) item.hint = {};
          item.hint.html = html;
        }
      }

      return item;
    });

    debug("hmpoGetItems", params, value, items);
    return items;
  },

  hmpoGetOptions(
    ctx: HmpoContext,
    params: HmpoParams,
    type: HmpoOptionType,
    optional = false,
  ) {
    const translate = ctx("translate") as HmpoTranslateFn;
    let options: Record<string, unknown> = {};
    if (typeof params[type] === "string") {
      options = {
        text: params[type],
      };
    } else {
      options = Object.assign({}, params[type]);
      if (!options.text && !options.html) {
        const contentKey = `fields.${params.contentKey || params.id}`;
        const key: HmpoKey = (options.key as string) || `${contentKey}.${type}`;
        options.html = translate(key, { self: !optional });
        if (optional && !options.html) return undefined;
      }
    }
    debug("hmpoGetOptions", params, type, options);
    return options;
  },

  hmpoTranslateExtraFieldContent(
    ctx: HmpoContext,
    params: HmpoParams,
    fieldKey: HmpoKey,
    optional = false,
  ) {
    const translate = ctx("translate") as HmpoTranslateFn;
    const contentKey = `fields.${params.contentKey || params.id}`;
    const key = `${contentKey}.${fieldKey}`;
    const translation = translate(key, { self: !optional });
    debug("hmpoTranslateExtraFieldContent", params, fieldKey, translation);
    return translation === `[${key}]` ? undefined : translation;
  },

  hmpoGetValue(ctx: HmpoContext, params: HmpoParams) {
    const errorValue = ctx(`errorValues.${params.id}`);
    return errorValue !== undefined ? errorValue : ctx(`values.${params.id}`);
  },

  hmpoBuildErrorMessage(ctx: HmpoContext, error: HmpoError, header = false) {
    if (error.message) return error.message;
    if (header && error.headerMessage) return error.headerMessage;

    const translate = ctx("translate") as HmpoTranslateFn;

    const contentkey =
      ctx(`options.fields.${error.key}.contentKey`) || error.key;

    const keys = [];

    if (header)
      keys.push(
        `fields.${contentkey}.validation.${error.type}_header`,
        `validation.${contentkey}.${error.type}_header`,
        `fields.${contentkey}.validation.default_header`,
        `validation.${contentkey}.default_header`,
      );

    if (header && error.errorGroup)
      keys.push(
        `fields.${error.errorGroup}.validation.${error.type}_header`,
        `validation.${error.errorGroup}.${error.type}_header`,
        `fields.${error.errorGroup}.validation.default_header`,
        `validation.${error.errorGroup}.default_header`,
      );

    keys.push(
      `fields.${contentkey}.validation.${error.type}`,
      `validation.${contentkey}.${error.type}`,
      `fields.${contentkey}.validation.default`,
      `validation.${contentkey}.default`,
    );

    if (error.errorGroup)
      keys.push(
        `fields.${error.errorGroup}.validation.${error.type}`,
        `validation.${error.errorGroup}.${error.type}`,
        `fields.${error.errorGroup}.validation.default`,
        `validation.${error.errorGroup}.default`,
      );

    keys.push(`validation.${error.type}`, "validation.default");

    const context = Object.assign(
      {},
      ctx(),
      {
        error,
        key: `fields.${contentkey}`,
        label: translate(`fields.${contentkey}.label`).toLowerCase(),
        legend: translate(`fields.${contentkey}.legend`).toLowerCase(),
        name: translate([
          `fields.${contentkey}.name`,
          `fields.${contentkey}.label`,
          `fields.${contentkey}.legend`,
        ]).toLowerCase(),
      },
      error.args,
    );

    return translate(keys, { context, self: false });
  },

  hmpoGetError(ctx: HmpoContext, params: HmpoParams) {
    const error = ctx(`errors.${params.id}`);

    const translate = ctx("translate") as HmpoTranslateFn;

    // if this field is part of a group and the group has a group error style this field as an error
    const fieldErrorGroup = ctx(`options.fields.${params.id}.errorGroup`);
    if (fieldErrorGroup) {
      if (error) return true;
      const errorGroupError =
        fieldErrorGroup && ctx(`errors.${fieldErrorGroup}`);
      if (
        errorGroupError &&
        !(errorGroupError as Record<string, unknown>).errorGroup
      )
        return true;
      return;
    }

    if (!error) return;

    const govukError = {
      id: `${params.id}-error`,
      visuallyHiddenText: translate("govuk.error"),
      text: globals.hmpoBuildErrorMessage(ctx, error),
    };
    debug("hmpoGetError", params, error, govukError);
    return govukError;
  },

  hmpoGetErrorSummary(ctx: HmpoContext) {
    const errors = ctx("errorlist") as Array<HmpoError> | undefined;
    if (!errors) return;
    const errorSummary = [];
    for (const error of errors) {
      errorSummary.push({
        href: `#${error.field || error.key}`,
        text: globals.hmpoBuildErrorMessage(ctx, error, true),
      });
    }
    debug("hmpoGetErrorSummary", errors, errorSummary);
    return errorSummary;
  },
};

const addGlobals = (env: NunjucksEnvironment) => {
  debug("adding globals");
  for (const name in globals) {
    env.addGlobal(name, (globals as Record<string, unknown>)[name]);
  }
};

export { addGlobals, globals };
