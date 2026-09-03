import debugLib from "debug";
const debug = debugLib("hmpo:components:globals");
import deepCloneMerge from "deep-clone-merge";
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
import type { Environment as NunjucksEnvironment } from "nunjucks";

let globals = {
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
    return (obj[key] = value);
  },

  substr(str: unknown, start: number, length: number) {
    return typeof str === "string" ? str.substr(start, length) : "";
  },

  hmpoGetParams(ctx: HmpoContext, params: HmpoParams, ...base: object[]) {
    let options =
      params && (ctx("options.fields." + params.id) as HmpoFieldOptions);
    let mergedItems: { items?: HmpoItem[] } = {};
    if (options && options.items && params && params.items) {
      let indexedParamItems = _.isArray(params.items)
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
    ctx: HmpoContext,
    params: HmpoParams,
    type: HmpoParams["validate"],
  ) {
    if (!params.validate) return;
    if (params.validate === type) return { type };
    if (!Array.isArray(params.validate)) return;
    if (params.validate.includes(type)) return { type };
    let validator = params.validate.filter((v) => v.type === type)[0];
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
    ctx: HmpoContext,
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
    let validator = globals.hmpoGetValidator(ctx, params, type);
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
    let translate = ctx("translate") as HmpoTranslateFn;
    let items: Array<HmpoItem | HmpoPlaceholder> =
      params.items || params.options || defaults || [];
    let conditionals = params.conditionals || {};
    let contentKey = "fields." + (params.contentKey || params.id);
    let placeholder: Partial<HmpoParams["placeholder"]> = params.placeholder;
    if (placeholder === true) placeholder = { value: "" };
    if (placeholder) {
      let key = placeholder.key || contentKey + ".placeholder";
      placeholder.text = translate(key, { default: " " });
      if (required) placeholder.disabled = true;
      if (value === undefined || value === "") placeholder.selected = true;
      items = [placeholder as HmpoPlaceholder, ...items];
    }
    items = items.map((item, index) => {
      if (typeof item === "string") item = { value: item };

      if (item.divider) {
        if (typeof item.divider !== "string") {
          let key: HmpoKey = (item.key as HmpoKey) || [
            contentKey + ".divider.label",
            "fields.default.divider.label",
          ];
          item.divider = translate(key);
        }
        return item;
      }

      if (!item.text && !item.html) {
        let key = (item.key as HmpoKey) || [
          contentKey + ".items." + item.value + ".label",
          "fields.default.items." + item.value + ".label",
        ];
        item.html = item.text = translate(key);
      }
      if (!item.name) item.name = params.id;
      if (item.value !== undefined) {
        if (Array.isArray(value) && value.includes(item.value))
          item.selected = item.checked = true;
        if (value === item.value) item.selected = item.checked = true;
      }
      let conditional = conditionals[item.value];
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
        let cleanedValue = String(item.value).replace(/[^a-zA-Z0-9]+/g, "");
        if (cleanedValue) item.id = params.id + "-" + cleanedValue;
      }
      if (item.id) {
        item.label = globals.merge(
          {
            attributes: { id: item.id + "-label" },
          },
          item.label,
        ) as HmpoLabel;
      }

      // override id of first item to be field name for accessibility
      if (setIdsBasedOnValues && index === 0) item.id = params.id;

      if (!item.hint || (!item.hint.html && !item.hint.text)) {
        let key = [
          contentKey + ".items." + item.value + ".hint",
          "fields.default.items." + item.value + ".hint",
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
    let translate = ctx("translate") as HmpoTranslateFn;
    let options: Record<string, unknown> = {};
    if (typeof params[type] === "string") {
      options = {
        text: params[type],
      };
    } else {
      options = Object.assign({}, params[type]);
      if (!options.text && !options.html) {
        let contentKey = "fields." + (params.contentKey || params.id);
        let key: HmpoKey = (options.key as string) || contentKey + "." + type;
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
    let translate = ctx("translate") as HmpoTranslateFn;
    let contentKey = "fields." + (params.contentKey || params.id);
    let key = contentKey + "." + fieldKey;
    const translation = translate(key, { self: !optional });
    debug("hmpoTranslateExtraFieldContent", params, fieldKey, translation);
    return translation == `[${key}]` ? undefined : translation;
  },

  hmpoGetValue(ctx: HmpoContext, params: HmpoParams) {
    let errorValue = ctx("errorValues." + params.id);
    return errorValue !== undefined ? errorValue : ctx("values." + params.id);
  },

  hmpoBuildErrorMessage(ctx: HmpoContext, error: HmpoError, header = false) {
    if (error.message) return error.message;
    if (header && error.headerMessage) return error.headerMessage;

    let translate = ctx("translate") as HmpoTranslateFn;

    let contentkey =
      ctx("options.fields." + error.key + ".contentKey") || error.key;

    let keys = [];

    if (header)
      keys.push(
        "fields." + contentkey + ".validation." + error.type + "_header",
        "validation." + contentkey + "." + error.type + "_header",
        "fields." + contentkey + ".validation.default_header",
        "validation." + contentkey + ".default_header",
      );

    if (header && error.errorGroup)
      keys.push(
        "fields." + error.errorGroup + ".validation." + error.type + "_header",
        "validation." + error.errorGroup + "." + error.type + "_header",
        "fields." + error.errorGroup + ".validation.default_header",
        "validation." + error.errorGroup + ".default_header",
      );

    keys.push(
      "fields." + contentkey + ".validation." + error.type,
      "validation." + contentkey + "." + error.type,
      "fields." + contentkey + ".validation.default",
      "validation." + contentkey + ".default",
    );

    if (error.errorGroup)
      keys.push(
        "fields." + error.errorGroup + ".validation." + error.type,
        "validation." + error.errorGroup + "." + error.type,
        "fields." + error.errorGroup + ".validation.default",
        "validation." + error.errorGroup + ".default",
      );

    keys.push("validation." + error.type, "validation.default");

    let context = Object.assign(
      {},
      ctx(),
      {
        error,
        key: "fields." + contentkey,
        label: translate("fields." + contentkey + ".label").toLowerCase(),
        legend: translate("fields." + contentkey + ".legend").toLowerCase(),
        name: translate([
          "fields." + contentkey + ".name",
          "fields." + contentkey + ".label",
          "fields." + contentkey + ".legend",
        ]).toLowerCase(),
      },
      error.args,
    );

    return translate(keys, { context, self: false });
  },

  hmpoGetError(ctx: HmpoContext, params: HmpoParams) {
    let error = ctx("errors." + params.id);

    let translate = ctx("translate") as HmpoTranslateFn;

    // if this field is part of a group and the group has a group error style this field as an error
    let fieldErrorGroup = ctx("options.fields." + params.id + ".errorGroup");
    if (fieldErrorGroup) {
      if (error) return true;
      let errorGroupError = fieldErrorGroup && ctx("errors." + fieldErrorGroup);
      if (
        errorGroupError &&
        !(errorGroupError as Record<string, unknown>).errorGroup
      )
        return true;
      return;
    }

    if (!error) return;

    let govukError = {
      id: params.id + "-error",
      visuallyHiddenText: translate("govuk.error"),
      text: globals.hmpoBuildErrorMessage(ctx, error),
    };
    debug("hmpoGetError", params, error, govukError);
    return govukError;
  },

  hmpoGetErrorSummary(ctx: HmpoContext) {
    let errors = ctx("errorlist") as Array<HmpoError> | undefined;
    if (!errors) return;
    let errorSummary = [];
    for (let error of errors) {
      errorSummary.push({
        href: "#" + (error.field || error.key),
        text: globals.hmpoBuildErrorMessage(ctx, error, true),
      });
    }
    debug("hmpoGetErrorSummary", errors, errorSummary);
    return errorSummary;
  },
};

let addGlobals = (env: NunjucksEnvironment) => {
  debug("adding globals");
  for (let name in globals) {
    env.addGlobal(name, (globals as Record<string, unknown>)[name]);
  }
};

export { globals, addGlobals };
