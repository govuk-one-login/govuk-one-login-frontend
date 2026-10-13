import type { Locals, NextFunction, Request, Response } from "express";

export type Key = string | Array<string>;

type FieldItemObject = {
  value: string;
  key?: Key;
  text?: string;
  label?: FieldLabel;
  divider?: unknown;
  attributes?: Record<string, unknown>;
  disabled?: boolean;
  selected?: boolean;
  hint?: { text?: string; html?: string };
  [key: string]: unknown;
};
export type FieldItem = FieldItemObject;

export type Placeholder = FieldItemObject;

export type Context = {
  (key: string): unknown;
  (): Locals;
};

export interface Params {
  id: string;
  contentKey?: string;
  label?: { key?: string; text?: string; html?: string };
  hint?: { key?: string; text?: string; html?: string };
  legend?: { key?: string; text?: string; html?: string };
  validate?: string | { type: string; arguments?: unknown };
  items?: Array<FieldItem>;
  options?: Array<FieldItem>;
  attributes?: Record<string, string>;
  classes?: string;
  placeholder?: Placeholder | true;
  conditionals?: { [key: string]: { id: unknown } };

  [key: string]: unknown;
}

export type FieldOptions = {
  items?: Array<string | { value: string | number; [key: string]: unknown }>;
} & Partial<Params>;

export type TranslateFn = (key: Key, options?: object) => string;

export type Conditionals = { [key: string]: unknown };

export type FieldLabel = {
  text: string;
  classes: string;
};

export type OptionType = "legend" | "hint" | "label" | "prefix" | "spellcheck";

export interface FieldError {
  headerMessage?: string;
  message?: string;
  key?: string;
  field?: string;
  type?: string;
  errorGroup?: string;
  args?: Record<string, unknown>;
}

export type FilterCondition =
  | {
      [key: string]: unknown;
    }
  | string
  | number
  | null
  | undefined;

export interface FormRequest extends Request {
  form: {
    options: {
      fields: Record<string, DateField>;
      dateFields: string[];
    };
    values: Record<string, string>;
  };
  sessionModel: {
    get(key: string): Record<string, string> | undefined;
  };
}

export type FormController = new (
  ...args: unknown[]
) => {
  configure(req: FormRequest, res: Response, next: NextFunction): void;
  getValues(
    req: FormRequest,
    res: Response,
    callback: (err: unknown, values?: Record<string, string>) => void,
  ): void;
  process(req: FormRequest, res: Response, next: NextFunction): void;
  validateFields(
    req: FormRequest,
    res: Response,
    callback: (errors: Record<string, FieldError>) => void,
  ): void;
  saveValues(req: FormRequest, res: Response, next: NextFunction): void;
  Error: new (
    field: string,
    options: Partial<FieldError>,
    req: FormRequest,
  ) => FieldError;
};

export interface DateField {
  inexact?: boolean;
  offset?: number;
  autocomplete?: string;
  dependent?: unknown;
  validate: Array<unknown> | string;
  errorGroup?: string;
}
