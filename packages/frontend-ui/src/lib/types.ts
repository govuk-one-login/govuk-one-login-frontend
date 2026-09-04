import type { Locals, NextFunction, Request, Response } from "express";

export type HmpoKey = string | Array<string>;

type HmpoItemObject = {
  value: string;
  key?: HmpoKey;
  text?: string;
  label?: HmpoLabel;
  divider?: unknown;
  attributes?: Record<string, unknown>;
  disabled?: boolean;
  selected?: boolean;
  hint?: { text?: string; html?: string };
  [key: string]: unknown;
};
export type HmpoItem = HmpoItemObject;

export type HmpoPlaceholder = HmpoItemObject;

export type HmpoContext = {
  (key: string): unknown;
  (): Locals;
};

export interface HmpoParams {
  id: string;
  contentKey?: string;
  label?: { key?: string; text?: string; html?: string };
  hint?: { key?: string; text?: string; html?: string };
  legend?: { key?: string; text?: string; html?: string };
  validate?: string | { type: string; arguments?: unknown };
  items?: Array<HmpoItem>;
  options?: Array<HmpoItem>;
  attributes?: Record<string, string>;
  classes?: string;
  placeholder?: HmpoPlaceholder | true;
  conditionals?: { [key: string]: { id: unknown } };

  [key: string]: unknown;
}

export type HmpoFieldOptions = {
  items?: Array<string | { value: string | number; [key: string]: unknown }>;
} & Partial<HmpoParams>;

export type HmpoTranslateFn = (key: HmpoKey, options?: object) => string;

export type HmpoConditionals = { [key: string]: unknown };

export type HmpoLabel = {
  text: string;
  classes: string;
};

export type HmpoOptionType =
  | "legend"
  | "hint"
  | "label"
  | "prefix"
  | "spellcheck";

export interface HmpoError {
  headerMessage?: string;
  message?: string;
  key?: string;
  field?: string;
  type?: string;
  errorGroup?: string;
  args?: Record<string, unknown>;
}

export type HmpoFilterCondition =
  | {
      [key: string]: unknown;
    }
  | string
  | number
  | null
  | undefined;

export interface HmpoRequest extends Request {
  form: {
    options: {
      fields: Record<string, HmpoDateField>;
      dateFields: string[];
    };
    values: Record<string, string>;
  };
  sessionModel: {
    get(key: string): Record<string, string> | undefined;
  };
}

export type HmpoController = new (
  ...args: unknown[]
) => {
  configure(req: HmpoRequest, res: Response, next: NextFunction): void;
  getValues(
    req: HmpoRequest,
    res: Response,
    callback: (err: unknown, values?: Record<string, string>) => void,
  ): void;
  process(req: HmpoRequest, res: Response, next: NextFunction): void;
  validateFields(
    req: HmpoRequest,
    res: Response,
    callback: (errors: Record<string, HmpoError>) => void,
  ): void;
  saveValues(req: HmpoRequest, res: Response, next: NextFunction): void;
  Error: new (
    field: string,
    options: Partial<HmpoError>,
    req: HmpoRequest,
  ) => HmpoError;
};

export interface HmpoDateField {
  inexact?: boolean;
  offset?: number;
  autocomplete?: string;
  dependent?: unknown;
  validate: Array<unknown> | string;
  errorGroup?: string;
}
