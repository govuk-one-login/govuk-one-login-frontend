import type { NextFunction, Response } from "express";
import _ from "underscore";
import type { Mock } from "vitest";
import type {
  HmpoController,
  HmpoDateField,
  HmpoError,
  HmpoRequest,
} from "../../types";
import DateMixin from "../date";

describe("Date Mixin", () => {
  let BaseController: new () => object;
  let Controller: HmpoController;
  let instance: InstanceType<HmpoController> & {
    Error: new (
      key: string,
      options: Partial<HmpoError>,
      req: HmpoRequest,
    ) => HmpoError & { key: string };
    configureDateField: Mock;
    processDateField: Mock;
    validateDateField: Mock;
  };
  let req: HmpoRequest;
  let res: Response;
  let next: Mock;
  let callback: Mock;
  let options: {
    route: string;
    template: string;
    fields: Record<string, Partial<HmpoDateField> & { errorGroup?: string }>;
    dateFields?: string[];
  };

  beforeEach(() => {
    options = {
      route: "/index",
      template: "index",
      fields: {
        date1: {
          autocomplete: "mydate",
          validate: ["required", "date"],
        },
        date2: {
          autocomplete: "off",
          validate: "date",
        },
        "date2-year": {
          autocomplete: "mycomplete",
          validate: "part-validator",
        },
        town: {},
        country: {},
      },
    };

    req = {
      form: {
        options,
        values: {},
      },
      sessionModel: {
        get: vi.fn(),
      },
    } as unknown as HmpoRequest;
    res = {} as Response;
    next = vi.fn();
    callback = vi.fn();

    BaseController = class {};
    Controller = DateMixin(BaseController as unknown as HmpoController);
    instance = new Controller() as typeof instance;
    instance.Error = class {
      key: string;
      constructor(key: string, options: Partial<HmpoError>) {
        this.key = key;
        _.extend(this, options);
      }
    };

    vi.useFakeTimers();
    vi.setSystemTime(1425918611263); // approx. 2015-03-09T16:30:00Z;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("exports a function", () => {
    // @ts-ignore - toBeTypeOf is a valid vitest matcher, blocked by jest-axe pulling in @types/jest
    expect(DateMixin).toBeTypeOf("function");
  });

  it("should extend the BaseControllerr", () => {
    expect(instance).toBeInstanceOf(BaseController);
  });

  describe("configure", () => {
    beforeEach(() => {
      (BaseController.prototype as Record<string, unknown>).configure = vi.fn();
      instance.configureDateField = vi.fn();
    });

    it("should set a list of date fields by usage of date validator", () => {
      instance.configure(req, res, next as unknown as NextFunction);
      expect(options.dateFields).toEqual(["date1", "date2"]);
    });

    it("should run configureDateField for each date field", () => {
      instance.configure(req, res, next as unknown as NextFunction);
      expect(instance.configureDateField).toHaveBeenCalledTimes(2);
      expect(instance.configureDateField).toHaveBeenCalledWith(req, "date1");
      expect(instance.configureDateField).toHaveBeenCalledWith(req, "date2");
    });

    it("should call the super configure method", () => {
      instance.configure(req, res, next as unknown as NextFunction);
      expect(
        (BaseController.prototype as Record<string, Mock>).configure,
      ).toHaveBeenCalledWith(req, res, next);
    });
  });

  describe("configureDateField", () => {
    it("should add date part fields for date field", () => {
      instance.configureDateField(req, "date1");
      expect(req.form.options.fields).toMatchObject({
        "date1-day": expect.anything(),
        "date1-month": expect.anything(),
        "date1-year": expect.anything(),
      });
    });

    it("should prepend date part validators to date part field", () => {
      instance.configureDateField(req, "date2");
      expect(
        (req.form.options.fields["date2-year"] as HmpoDateField).validate,
      ).toEqual(["numeric", "date-year", "part-validator"]);
    });

    it("should prepend required validator if the date field is required", () => {
      instance.configureDateField(req, "date1");
      expect(
        (req.form.options.fields["date1-year"] as HmpoDateField).validate,
      ).toEqual(["required", "numeric", "date-year"]);
    });

    it("should set the errorGroup to the date field", () => {
      instance.configureDateField(req, "date1");
      expect(req.form.options.fields["date1-year"].errorGroup).toEqual("date1");
    });

    it("should set the autocomplete values of the parent date field", () => {
      instance.configureDateField(req, "date1");
      expect(req.form.options.fields["date1-day"].autocomplete).toEqual(
        "mydate-day",
      );
      expect(req.form.options.fields["date1-month"].autocomplete).toEqual(
        "mydate-month",
      );
      expect(req.form.options.fields["date1-year"].autocomplete).toEqual(
        "mydate-year",
      );
    });

    it("should override the autocomplete values specific part configs", () => {
      instance.configureDateField(req, "date2");
      expect(req.form.options.fields["date2-day"].autocomplete).toEqual("off");
      expect(req.form.options.fields["date2-month"].autocomplete).toEqual(
        "off",
      );
      expect(req.form.options.fields["date2-year"].autocomplete).toEqual(
        "mycomplete",
      );
    });

    it("should not populate autocomplete if not specified", () => {
      delete options.fields.date2.autocomplete;
      delete options.fields["date2-year"];
      instance.configureDateField(req, "date2");
      expect(req.form.options.fields["date2-day"].autocomplete).toBeUndefined();
      expect(
        req.form.options.fields["date2-month"].autocomplete,
      ).toBeUndefined();
      expect(
        req.form.options.fields["date2-year"].autocomplete,
      ).toBeUndefined();
    });
  });

  describe("getValues", () => {
    beforeEach(() => {
      options.dateFields = ["date1", "date2"];
      (BaseController.prototype as Record<string, unknown>).getValues = vi
        .fn()
        .mockImplementation(
          (
            _req: HmpoRequest,
            _res: Response,
            cb: (err: null, values: Record<string, string>) => void,
          ) => cb(null, { date1: "1980-04-23", date2: "2017-10-04" }),
        );
    });

    it("should parse out date values if no raw values are present", () => {
      (req.sessionModel.get as Mock).mockReturnValue(undefined);
      instance.getValues(req, res, callback);
      expect(callback).toHaveBeenCalledWith(null, {
        date1: "1980-04-23",
        "date1-day": "23",
        "date1-month": "04",
        "date1-year": "1980",
        date2: "2017-10-04",
        "date2-day": "04",
        "date2-month": "10",
        "date2-year": "2017",
      });
    });

    it("should use raw values if present instead of using date values", () => {
      (req.sessionModel.get as Mock).mockReturnValue({
        "date1-day-raw": "1",
        "date1-month-raw": "1",
        "date1-year-raw": "1900",
      });
      options.dateFields = ["date1"];
      (
        BaseController.prototype as Record<string, Mock>
      ).getValues.mockImplementation(
        (
          _req: HmpoRequest,
          _res: Response,
          cb: (err: null, values: Record<string, string>) => void,
        ) => cb(null, { date1: "1980-04-23" }),
      );
      instance.getValues(req, res, callback);
      expect(callback).toHaveBeenCalledWith(null, {
        date1: "1980-04-23",
        "date1-day": "1",
        "date1-month": "1",
        "date1-year": "1900",
      });
    });

    it("should not populate blank date values with defaults", () => {
      options.dateFields = ["date1"];
      (
        BaseController.prototype as Record<string, Mock>
      ).getValues.mockImplementation(
        (
          _req: HmpoRequest,
          _res: Response,
          cb: (err: null, values: Record<string, string>) => void,
        ) => cb(null, { date1: "1980--" }),
      );
      instance.getValues(req, res, callback);
      expect(callback).toHaveBeenCalledWith(null, {
        date1: "1980--",
        "date1-day": "",
        "date1-month": "",
        "date1-year": "1980",
      });
    });

    it("should not populate parts of no valud exists", () => {
      options.dateFields = ["date1"];
      (
        BaseController.prototype as Record<string, Mock>
      ).getValues.mockImplementation(
        (
          _req: HmpoRequest,
          _res: Response,
          cb: (err: null, values: Record<string, string>) => void,
        ) => cb(null, {}),
      );
      instance.getValues(req, res, callback);
      expect(callback).toHaveBeenCalledWith(null, {});
    });

    it("should call callback once in case of error", () => {
      const err = new Error("msg");
      (
        BaseController.prototype as Record<string, Mock>
      ).getValues.mockImplementation(
        (_req: HmpoRequest, _res: Response, cb: (err: Error) => void) =>
          cb(err),
      );
      instance.getValues(req, res, callback);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(err);
    });
  });

  describe("process", () => {
    beforeEach(() => {
      options.dateFields = ["date1", "date2"];
      (BaseController.prototype as Record<string, unknown>).process = vi.fn();
      instance.processDateField = vi.fn();
    });

    it("should run processDateField for each date field", () => {
      instance.process(req, res, next as unknown as NextFunction);
      expect(instance.processDateField).toHaveBeenCalledTimes(2);
      expect(instance.processDateField).toHaveBeenCalledWith(req, "date1");
      expect(instance.processDateField).toHaveBeenCalledWith(req, "date2");
    });

    it("should call the super process method", () => {
      instance.process(req, res, next as unknown as NextFunction);
      expect(
        (BaseController.prototype as Record<string, Mock>).process,
      ).toHaveBeenCalledWith(req, res, next);
    });
  });

  describe("processDateField", () => {
    beforeEach(() => {
      req.form.values = {
        "date1-day": "24",
        "date1-month": "10",
        "date1-year": "1982",
      };
    });

    it("should use separate input fields for year, month and day", () => {
      instance.processDateField(req, "date1");
      expect(req.form.values["date1"]).toEqual("1982-10-24");
    });

    it("should pad date day with leading zero if required", () => {
      req.form.values["date1-day"] = "1";
      instance.processDateField(req, "date1");
      expect(req.form.values["date1"]).toEqual("1982-10-01");
    });

    it("should pad date month with leading zero if required", () => {
      req.form.values["date1-month"] = "1";
      instance.processDateField(req, "date1");
      expect(req.form.values["date1"]).toEqual("1982-01-24");
    });

    it("should leave blank sections of date blank for validation", () => {
      // moment would fill in missing values with 01/0001 respectively
      req.form.values["date1-day"] = "";
      req.form.values["date1-month"] = "";
      instance.processDateField(req, "date1");
      expect(req.form.values["date1"]).toEqual("1982--");
    });

    it("should leave field blank if no values are entered", () => {
      req.form.values["date1-day"] = "";
      req.form.values["date1-month"] = "";
      req.form.values["date1-year"] = "";
      instance.processDateField(req, "date1");
      expect(req.form.values["date1"]).toEqual("");
    });

    it('should default day to "01" if field is set up as "inexact"', () => {
      options.fields["date1"].inexact = true;
      req.form.values["date1-day"] = "";
      instance.processDateField(req, "date1");
      expect(req.form.values["date1"]).toEqual("1982-10-01");
    });

    it("should handle two digit years", () => {
      req.form.values["date1-year"] = "14";
      instance.processDateField(req, "date1");
      expect(req.form.values["date1"]).toEqual("2014-10-24");

      req.form.values["date1-year"] = "16";
      instance.processDateField(req, "date1");
      expect(req.form.values["date1"]).toEqual("1916-10-24");
    });

    it("supports offset option when expanding two digit year values", () => {
      options.fields["date1"].offset = 20;

      req.form.values["date1-year"] = "34";
      instance.processDateField(req, "date1");
      expect(req.form.values["date1"]).toEqual("2034-10-24");

      req.form.values["date1-year"] = "36";
      instance.processDateField(req, "date1");
      expect(req.form.values["date1"]).toEqual("1936-10-24");
    });

    it("should leave field blank if set as inexact and no month or year values are entered", () => {
      options.fields["date1"].inexact = true;
      req.form.values["date1-month"] = "";
      req.form.values["date1-year"] = "";
      instance.processDateField(req, "date1");
      expect(req.form.values["date1"]).toEqual("");
    });

    it("should set the raw values for day, month, and year", () => {
      req.form.values["date1-day"] = "01";
      req.form.values["date1-month"] = "02";
      req.form.values["date1-year"] = "1900";
      instance.processDateField(req, "date1");
      expect(req.form.values["date1-day-raw"]).toEqual("01");
      expect(req.form.values["date1-month-raw"]).toEqual("02");
      expect(req.form.values["date1-year-raw"]).toEqual("1900");
    });
  });

  describe("validateFields", () => {
    let errors: Record<string, HmpoError>;

    beforeEach(() => {
      errors = {};
      options.dateFields = ["date1", "date2"];
      (BaseController.prototype as Record<string, unknown>).validateFields = vi
        .fn()
        .mockImplementation(
          (
            _req: HmpoRequest,
            _res: Response,
            cb: (errors: Record<string, HmpoError>) => void,
          ) => cb(errors),
        );
      instance.validateDateField = vi.fn();
    });

    it("should call the super validateFields method", () => {
      instance.validateFields(
        req,
        res,
        next as unknown as (errors: Record<string, HmpoError>) => void,
      );
      expect(
        (BaseController.prototype as Record<string, Mock>).validateFields,
      ).toHaveBeenCalledWith(req, res, expect.any(Function));
    });

    it("should run validateDateField for each date field", () => {
      instance.validateFields(
        req,
        res,
        next as unknown as (errors: Record<string, HmpoError>) => void,
      );
      expect(instance.validateDateField).toHaveBeenCalledTimes(2);
      expect(instance.validateDateField).toHaveBeenCalledWith(
        req,
        "date1",
        errors,
      );
      expect(instance.validateDateField).toHaveBeenCalledWith(
        req,
        "date2",
        errors,
      );
    });

    it("should call the super validateFields method", () => {
      instance.validateFields(
        req,
        res,
        next as unknown as (errors: Record<string, HmpoError>) => void,
      );
      expect(
        (BaseController.prototype as Record<string, Mock>).validateFields,
      ).toHaveBeenCalledWith(req, res, expect.any(Function));
    });
  });

  describe("validateDateField", () => {
    let errors: Record<string, HmpoError>;

    beforeEach(() => {
      errors = {};
      req.form.values = {
        date1: "2017-01-02",
      };
    });

    it("should not validate if the field is empty - this should be handled by a required validator", () => {
      req.form.values = {};
      errors = {};

      instance.validateDateField(req, "date1", errors);

      expect(errors).toEqual({});
    });

    describe("sets required error if the parts have required errors", () => {
      it("should create a new error if the day is missing", () => {
        errors = {
          other: { type: "required" },
          date1: { type: "original" },
          "date1-day": { errorGroup: "date1", type: "required" },
        };

        instance.validateDateField(req, "date1", errors);

        expect(errors["date1"].type).toEqual("required-day");
        expect(errors["date1"].field).toEqual("date1-day");
      });

      it("should create the first part required error if the day and month are missing", () => {
        errors = {
          other: { type: "required" },
          date1: { type: "original" },
          "date1-day": { errorGroup: "date1", type: "required" },
          "date1-month": { errorGroup: "date1", type: "required" },
        };

        instance.validateDateField(req, "date1", errors);

        expect(errors["date1"].type).toEqual("required-day");
        expect(errors["date1"].field).toEqual("date1-day");
      });

      it("should create a new required error if all three parts are missing", () => {
        errors = {
          other: { type: "other" },
          date1: { type: "original" },
          "date1-day": { errorGroup: "date1", type: "required" },
          "date1-month": { errorGroup: "date1", type: "required" },
          "date1-year": { errorGroup: "date1", type: "required" },
        };

        instance.validateDateField(req, "date1", errors);

        expect(errors["date1"].type).toEqual("required");
        expect(errors["date1"].field).toEqual("date1-day");
      });

      it("should create a new required error if inexact and the month and year parts are missing", () => {
        errors = {
          other: { type: "other" },
          date1: { type: "original" },
          "date1-month": { errorGroup: "date1", type: "required" },
          "date1-year": { errorGroup: "date1", type: "required" },
        };

        options.fields["date1"].inexact = true;

        instance.validateDateField(req, "date1", errors);

        expect(errors["date1"].type).toEqual("required");
        expect(errors["date1"].field).toEqual("date1-day");
      });
    });

    describe("sets numeric error if the parts have numeric errors", () => {
      it("should leaving existing error if the value is empty", () => {
        errors = {
          other: { type: "numeric" },
          date1: { type: "original" },
          "date1-day": { errorGroup: "date1", type: "numeric" },
        };
        req.form.values["date1"] = "";

        instance.validateDateField(req, "date1", errors);

        expect(errors["date1"].type).toEqual("original");
      });

      it("should create a new error if letters are used in the day", () => {
        errors = {
          other: { type: "other" },
          date1: { type: "original" },
          "date1-day": { errorGroup: "date1", type: "numeric" },
        };

        instance.validateDateField(req, "date1", errors);

        expect(errors["date1"].type).toEqual("numeric-day");
        expect(errors["date1"].field).toEqual("date1-day");
      });

      it("should create a new error if letters are used in the month", () => {
        errors = {
          other: { type: "other" },
          date1: { type: "original" },
          "date1-month": { errorGroup: "date1", type: "numeric" },
        };

        instance.validateDateField(req, "date1", errors);

        expect(errors["date1"].type).toEqual("numeric-month");
        expect(errors["date1"].field).toEqual("date1-month");
      });

      it("should create a new error if letters are used in multiple parts of the date", () => {
        errors = {
          other: { type: "other" },
          date1: { type: "original" },
          "date1-day": { errorGroup: "date1", type: "numeric" },
          "date1-month": { errorGroup: "date1", type: "numeric" },
          "date1-year": { errorGroup: "date1", type: "numeric" },
        };

        instance.validateDateField(req, "date1", errors);

        expect(errors["date1"].type).toEqual("numeric");
        expect(errors["date1"].field).toEqual("date1-day");
      });

      it("should not set a date field error if an error is not numeric", () => {
        errors = {
          other: { type: "other" },
          date1: { type: "original" },
          "date1-day": { errorGroup: "date1", type: "other" },
        };

        instance.validateDateField(req, "date1", errors);

        expect(errors["date1"].type).toEqual("original");
      });

      it("should not create a new error if date is not a valid format (eg if year is missing)", () => {
        req.form.values["date1"] = "-10-22";

        instance.validateDateField(req, "date1", errors);

        expect(errors).toEqual({});
      });
    });

    describe("checks validity of numerical values in date fields", () => {
      it("should creates a new error if the day number is invalid for the month", () => {
        req.form.values["date1"] = "1970-02-30";

        instance.validateDateField(req, "date1", errors);

        expect(errors["date1"]).toEqual(
          new instance.Error(
            "date1-day",
            { type: "date-day", errorGroup: "date1", field: "date1-day" },
            req,
          ),
        );
        expect(errors["date1-day"]).toEqual(
          new instance.Error(
            "date1-day",
            { type: "date-day", errorGroup: "date1", field: "date1-day" },
            req,
          ),
        );
      });

      it("should create a new error if the day number is invalid", () => {
        req.form.values["date1"] = "1970-11-33";

        instance.validateDateField(req, "date1", errors);

        expect(errors["date1"]).toEqual(
          new instance.Error(
            "date1-day",
            { type: "date-day", errorGroup: "date1", field: "date1-day" },
            req,
          ),
        );
        expect(errors["date1-day"]).toEqual(
          new instance.Error(
            "date1-day",
            { type: "date-day", errorGroup: "date1", field: "date1-day" },
            req,
          ),
        );
      });

      it("should create a new error if the month number is invalid", () => {
        req.form.values["date1"] = "1970-13-22";

        instance.validateDateField(req, "date1", errors);

        expect(errors["date1"]).toEqual(
          new instance.Error(
            "date1-month",
            { type: "date-month", errorGroup: "date1", field: "date1-month" },
            req,
          ),
        );
        expect(errors["date1-month"]).toEqual(
          new instance.Error(
            "date1-month",
            { type: "date-month", errorGroup: "date1", field: "date1-month" },
            req,
          ),
        );
      });

      it("should not create a new error if moment doesnt report year day or month", () => {
        req.form.values["date1"] = "2017-10-22";

        instance.validateDateField(req, "date1", errors);

        expect(errors).toEqual({});
      });
    });
  });

  describe("saveValues", () => {
    beforeEach(() => {
      (BaseController.prototype as Record<string, unknown>).saveValues =
        vi.fn();
      options.dateFields = ["date1", "date2"];
      req.form.values = {
        date1: "1900-02-01",
        "date1-day": "01",
        "date1-month": "02",
        "date1-year": "1900",
        "date1-day-raw": "01",
        "date1-month-raw": "02",
        "date1-year-raw": "1900",
        date2: "2019-02-01",
        "date2-day": "01",
        "date2-month": "02",
        "date2-year": "2019",
        "date2-day-raw": "01",
        "date2-month-raw": "02",
        "date2-year-raw": "2019",
        other: "value",
      };
    });

    it("should remove the parts and raw parts of each date field", () => {
      instance.saveValues(req, res, next as unknown as NextFunction);
      expect(req.form.values).toEqual({
        date1: "1900-02-01",
        date2: "2019-02-01",
        other: "value",
      });
    });

    it("should call the super saveValues method", () => {
      instance.saveValues(req, res, next as unknown as NextFunction);
      expect(
        (BaseController.prototype as Record<string, Mock>).saveValues,
      ).toHaveBeenCalledWith(req, res, next);
    });
  });
});
