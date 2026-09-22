import type { NextFunction, Response } from "express";
import moment from "moment";
import _ from "underscore";
import type {
  HmpoController,
  HmpoDateField,
  HmpoError,
  HmpoRequest,
} from "../types";

const DATE_PARTS = ["day", "month", "year"];

export default (Controller: HmpoController) =>
  class extends Controller {
    configure(req: HmpoRequest, res: Response, next: NextFunction) {
      req.form.options.dateFields = _.keys(
        _.pick(
          req.form.options.fields,
          (field: HmpoDateField) =>
            field.validate === "date" || _.contains(field.validate, "date"),
        ),
      );

      _.forEach(req.form.options.dateFields, (fieldName: string) =>
        this.configureDateField(req, fieldName),
      );

      super.configure(req, res, next);
    }

    configureDateField(req: HmpoRequest, fieldName: string) {
      const dateField = req.form.options.fields[fieldName];
      const required = _.contains(dateField.validate, "required");

      DATE_PARTS.forEach((part) => {
        // get any existing date part field options
        let field = req.form.options.fields[`${fieldName}-${part}`];

        field = _.extend(
          {
            errorGroup: fieldName,
            hintId: `${fieldName}-hint`,
            contentKey: `date-${part}`,
            autocomplete:
              dateField.autocomplete &&
              (dateField.autocomplete === "off"
                ? "off"
                : `${dateField.autocomplete}-${part}`),
            dependent: dateField.dependent,
            labelClassName: "form-label",
          },
          field,
        );

        // add date part validators first
        if (!field.validate) field.validate = [];
        if (!Array.isArray(field.validate)) field.validate = [field.validate];

        field.validate.unshift("numeric", `date-${part}`);

        // only make part required if date field is required
        if (required) field.validate.unshift("required");

        req.form.options.fields[`${fieldName}-${part}`] = field;
      });
    }

    getValues(
      req: HmpoRequest,
      res: Response,
      callback: (err: unknown, values?: Record<string, string>) => void,
    ) {
      super.getValues(req, res, (err, values) => {
        if (err) return callback(err);
        if (!values) return;
        const errorValues = req.sessionModel.get("errorValues") || {};
        req.form.options.dateFields.forEach((fieldName) => {
          if (!values[fieldName]) return;
          const [year, month, day] = values[fieldName].split("-");
          values[`${fieldName}-day`] =
            errorValues[`${fieldName}-day-raw`] || day;
          values[`${fieldName}-month`] =
            errorValues[`${fieldName}-month-raw`] || month;
          values[`${fieldName}-year`] =
            errorValues[`${fieldName}-year-raw`] || year;
        });
        callback(null, values);
      });
    }

    process(req: HmpoRequest, res: Response, next: NextFunction) {
      _.forEach(req.form.options.dateFields, (fieldName: string) =>
        this.processDateField(req, fieldName),
      );
      super.process(req, res, next);
    }

    processDateField(req: HmpoRequest, fieldName: string) {
      const dayName = `${fieldName}-day`;
      const monthName = `${fieldName}-month`;
      const yearName = `${fieldName}-year`;

      const body = req.form.values;
      const field = req.form.options.fields[fieldName];

      // save raw values to replay on validation error
      body[`${dayName}-raw`] = body[dayName];
      body[`${monthName}-raw`] = body[monthName];
      body[`${yearName}-raw`] = body[yearName];

      body[dayName] = field.inexact ? "01" : this._padDayMonth(body[dayName]);
      body[monthName] = this._padDayMonth(body[monthName]);
      body[yearName] = this._padYear(body[yearName], field.offset || 0);

      body[fieldName] = `${body[yearName]}-${body[monthName]}-${body[dayName]}`;

      if (
        body[fieldName] === "--" ||
        (field.inexact && body[fieldName] === "--01")
      ) {
        body[fieldName] = "";
      }
    }

    _padDayMonth(value: string) {
      if (/^\d$/.exec(value)) return `0${value}`;
      return value;
    }

    _padYear(value: string, offset: number) {
      if (/^\d{2}$/.exec(value)) {
        const year = Number.parseInt(value, 10);
        const centurySplit = moment().year() - 2000 + (offset || 0);
        const prefix = year <= centurySplit ? "20" : "19";
        return prefix + value;
      }
      return value;
    }

    validateFields(
      req: HmpoRequest,
      res: Response,
      callback: (errors: Record<string, HmpoError>) => void,
    ) {
      super.validateFields(req, res, (errors) => {
        _.forEach(req.form.options.dateFields, (fieldName: string) =>
          this.validateDateField(req, fieldName, errors),
        );
        callback(errors);
      });
    }

    validateDateField(
      req: HmpoRequest,
      fieldName: string,
      errors: Record<string, HmpoError>,
    ) {
      const fieldErrors = _.pick(
        errors,
        (error, key) => key !== fieldName && error.errorGroup === fieldName,
      );

      const requiredErrors = _.pick(
        fieldErrors,
        (error) => error!.type === "required",
      );
      if (!_.isEmpty(requiredErrors)) {
        const field = req.form.options.fields[fieldName];
        const fieldCount = field.inexact ? 2 : 3;
        let errorType = "required";
        let part: string | undefined;
        if (Object.keys(requiredErrors).length < fieldCount) {
          part = DATE_PARTS.find(
            (part) => !!requiredErrors[`${fieldName}-${part}`],
          );
          /* istanbul ignore next */
          if (part) errorType += `-${part}`;
        }
        errors[fieldName] = new this.Error(
          fieldName,
          {
            type: errorType,
            field: `${fieldName}-${part || "day"}`,
            errorGroup: fieldName,
          },
          req,
        );
        return;
      }

      if (!req.form.values[fieldName]) return;

      const numericErrors = _.pick(
        fieldErrors,
        (error) => error!.type === "numeric",
      );
      if (!_.isEmpty(numericErrors)) {
        let errorType = "numeric";
        let part: string | undefined;
        if (Object.keys(numericErrors).length === 1) {
          part = DATE_PARTS.find(
            (part) => !!numericErrors[`${fieldName}-${part}`],
          );
          /* istanbul ignore next */
          if (part) errorType += `-${part}`;
        }
        errors[fieldName] = new this.Error(
          fieldName,
          {
            type: errorType,
            field: `${fieldName}-${part || "day"}`,
            errorGroup: fieldName,
          },
          req,
        );
        return;
      }

      if (/^\d{4}-\d{2}-\d{2}$/.exec(req.form.values[fieldName])) {
        const code = moment(
          req.form.values[fieldName],
          "YYYY-MM-DD",
        ).invalidAt();
        let invalidElement = null;
        /* istanbul ignore next */
        if (code === 0) invalidElement = "year";
        if (code === 1) invalidElement = "month";
        if (code === 2) invalidElement = "day";

        if (invalidElement) {
          errors[fieldName] = errors[`${fieldName}-${invalidElement}`] =
            new this.Error(
              `${fieldName}-${invalidElement}`,
              {
                type: `date-${invalidElement}`,
                field: `${fieldName}-${invalidElement}`,
                errorGroup: fieldName,
              },
              req,
            );
        }
      }

      if (errors[fieldName] && !errors[fieldName].field) {
        errors[fieldName].field = `${fieldName}-day`;
      }
    }

    saveValues(req: HmpoRequest, res: Response, next: NextFunction) {
      _.forEach(req.form.options.dateFields, (fieldName: string) => {
        DATE_PARTS.forEach((part) => {
          delete req.form.values[`${fieldName}-${part}`];
          delete req.form.values[`${fieldName}-${part}-raw`];
        });
      });
      super.saveValues(req, res, next);
    }
  };
