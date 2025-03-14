import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import "jest-localstorage-mock";

import {
  PageViewParametersInterface,
  PageViewEventInterface,
} from "./pageViewTracker.interface";
import { PageViewTracker } from "./pageViewTracker";
import { OptionsInterface } from "../core/core.interface";
import * as FormErrorTracker from "../formErrorTracker/formErrorTracker";
import * as pushToDataLayer from "../../utils/pushToDataLayer";
import {
  getLanguage,
  getLocation,
  getReferrer,
  getLoggedInStatus,
  getFirstPublishedAt,
  getUpdatedAt,
  getRelyingParty,
} from "./utils/pageViewTracker.utils";

window.DI = { analyticsGa4: { cookie: { consent: true } } };

const getParameters = (
  override: Partial<PageViewParametersInterface> = {},
): PageViewParametersInterface => ({
  statusCode: 200,
  englishPageTitle: "home",
  taxonomy_level1: "taxo1",
  taxonomy_level2: "taxo2",
  taxonomy_level3: "taxo3",
  taxonomy_level4: "taxo4",
  taxonomy_level5: "taxo5",
  content_id: "<e4a3603d-2d3c-4ff1-9b80-d72c1e6b7a58>",
  logged_in_status: true,
  dynamic: true,
  ...override,
});

const getOptions = (
  override: Partial<OptionsInterface> = {},
): OptionsInterface => ({
  cookieDomain: "localhost",
  isDataSensitive: true,
  enableGa4Tracking: true,
  enableUaTracking: false,
  enableFormChangeTracking: true,
  enableFormErrorTracking: true,
  enableFormResponseTracking: true,
  enableNavigationTracking: true,
  enablePageViewTracking: true,
  enableSelectContentTracking: true,
  ...override,
});

describe("pageViewTracker", () => {
  let instance: PageViewTracker;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(pushToDataLayer, "pushToDataLayer");
    instance = new PageViewTracker(
      getOptions({
        enablePageViewTracking: true,
      }),
    );
  });

  test("should not call pushToDataLayer if enablePageViewTracking is disabled", () => {
    const newPageView = new PageViewTracker(
      getOptions({
        enablePageViewTracking: false,
      }),
    );
    newPageView.trackOnPageLoad(getParameters());
    expect(pushToDataLayer.pushToDataLayer).not.toHaveBeenCalled();
  });

  test("pushToDataLayer is called", () => {
    const newInstance = new PageViewTracker(
      getOptions({
        enablePageViewTracking: true,
      }),
    );
    newInstance.trackOnPageLoad(getParameters());
    expect(pushToDataLayer.pushToDataLayer).toBeCalled();
  });

  test("should call pushToDataLayer with a valid dataLayerEvent", () => {
    const parameters = getParameters();
    const dataLayerEvent: PageViewEventInterface = {
      event: instance.eventName,
      page_view: {
        language: getLanguage(),
        location: getLocation(),
        organisations: instance.organisations,
        primary_publishing_organisation:
          instance.primary_publishing_organisation,
        referrer: getReferrer(),
        status_code: parameters.statusCode.toString(),
        title: parameters.englishPageTitle,
        taxonomy_level1: parameters.taxonomy_level1,
        taxonomy_level2: parameters.taxonomy_level2,
        taxonomy_level3: parameters.taxonomy_level3,
        taxonomy_level4: parameters.taxonomy_level4,
        taxonomy_level5: parameters.taxonomy_level5,
        content_id: parameters.content_id,
        logged_in_status: getLoggedInStatus(parameters.logged_in_status),
        dynamic: parameters.dynamic.toString(),
        first_published_at: getFirstPublishedAt(),
        updated_at: getUpdatedAt(),
        relying_party: getRelyingParty(),
      },
    };
    instance.trackOnPageLoad(parameters);
    expect(pushToDataLayer.pushToDataLayer).toBeCalledWith(dataLayerEvent);
  });

  test("pushToDataLayer is called with the good data", () => {
    const parameters = getParameters();
    const dataLayerEvent: PageViewEventInterface = {
      event: instance.eventName,
      page_view: {
        language: getLanguage(),
        location: getLocation(),
        organisations: instance.organisations,
        primary_publishing_organisation:
          instance.primary_publishing_organisation,
        referrer: getReferrer(),
        status_code: parameters.statusCode.toString(),
        title: parameters.englishPageTitle,
        taxonomy_level1: parameters.taxonomy_level1,
        taxonomy_level2: parameters.taxonomy_level2,
        taxonomy_level3: parameters.taxonomy_level3,
        taxonomy_level4: parameters.taxonomy_level4,
        taxonomy_level5: parameters.taxonomy_level5,
        content_id: parameters.content_id,
        logged_in_status: getLoggedInStatus(parameters.logged_in_status),
        dynamic: parameters.dynamic.toString(),
        first_published_at: getFirstPublishedAt(),
        updated_at: getUpdatedAt(),
        relying_party: getRelyingParty(),
      },
    };
    instance.trackOnPageLoad(parameters);
    expect(pushToDataLayer.pushToDataLayer).toBeCalledWith(dataLayerEvent);
  });
});

describe("pageViewTracker test disable ga4 tracking option", () => {
  jest.spyOn(PageViewTracker.prototype, "trackOnPageLoad");

  test("pushToDataLayer should not be called", () => {
    const instance = new PageViewTracker(
      getOptions({
        enableGa4Tracking: false,
      }),
    );
    instance.trackOnPageLoad(getParameters());
    expect(instance.trackOnPageLoad).toReturnWith();
  });
});

describe("Cookie Management", () => {
  jest.spyOn(PageViewTracker.prototype, "trackOnPageLoad");
  beforeEach(() => {
    window.DI.analyticsGa4.cookie.consent = true;
  });

  test("trackOnPageLoad should return false if visitor rejects cookie consent", () => {
    window.DI.analyticsGa4.cookie.consent = false;
    window.DI.analyticsGa4.cookie.hasCookie = true;
    const instance = new PageViewTracker(getOptions());
    instance.trackOnPageLoad(getParameters());
    expect(instance.trackOnPageLoad).toReturnWith();
  });
});

describe("Form Change Tracker Trigger", () => {
  test("FormChange tracker is not triggered", () => {
    const instance = new PageViewTracker(
      getOptions({
        enableGa4Tracking: false,
      }),
    );

    instance.trackOnPageLoad(getParameters());
    expect(pushToDataLayer.pushToDataLayer).not.toHaveBeenCalled();
  });
});

describe("Form Error Tracker Trigger", () => {
  let instance: PageViewTracker;

  beforeEach(() => {
    jest.clearAllMocks();
    window.DI.analyticsGa4.cookie.hasCookie = true;
    window.DI.analyticsGa4.cookie.consent = true;
    jest.spyOn(pushToDataLayer, "pushToDataLayer");
    jest.spyOn(FormErrorTracker, "trackFormError");
    instance = new PageViewTracker(getOptions());
  });

  test("trackOnPageLoad should called form error function and return false if form error message exists", () => {
    document.body.innerHTML =
      '<p id="organisationType-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Select one option</p>';
    instance.trackOnPageLoad(getParameters());
    expect(instance.trackOnPageLoad).toReturnWith();
  });

  test("FormError tracker is activated", () => {
    document.body.innerHTML =
      '<p id="organisationType-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Select one option</p>';

    instance.trackOnPageLoad(getParameters());
    expect(FormErrorTracker.trackFormError).toHaveBeenCalled();
  });
  test("FormError tracker is activated even if pageView is disabled", () => {
    document.body.innerHTML =
      '<p id="organisationType-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Select one option</p>';
    const newInstance = new PageViewTracker(
      getOptions({
        enablePageViewTracking: false,
      }),
    );

    newInstance.trackOnPageLoad(getParameters());
    expect(FormErrorTracker.trackFormError).toHaveBeenCalled();
  });

  test("FormError tracker is not triggered", () => {
    document.body.innerHTML = "";
    instance.trackOnPageLoad(getParameters());
    expect(FormErrorTracker.trackFormError).not.toBeCalled();
  });

  test("FormError tracker is deactivated", () => {
    document.body.innerHTML = `
      <main id="main-content">
        <form>
          <fieldset class="govuk-form-group--error">
            <input id="organisationType-error" class="govuk-error-message"></input>
          </fieldset>
        </form>
      </main>
    `;
    instance = new PageViewTracker(
      getOptions({
        enableFormErrorTracking: false,
      }),
    );
    instance.trackOnPageLoad(getParameters());
    expect(pushToDataLayer.pushToDataLayer).not.toHaveBeenCalled();
  });
});

describe("Persisting taxonomy level values", () => {
  beforeEach(() => {
    window.DI = {
      analyticsGa4: { cookie: { consent: true } },
    };
    document.body.innerHTML = "<p></p>";
    jest.clearAllMocks();
    jest.spyOn(pushToDataLayer, "pushToDataLayer");
  });

  test("Taxonomy levels are persisted from previous page", () => {
    const instance = new PageViewTracker(getOptions());
    instance.trackOnPageLoad(getParameters());
    instance.trackOnPageLoad(
      getParameters({
        taxonomy_level2: "persisted from previous page",
        taxonomy_level3: "persisted from previous page",
        taxonomy_level4: "persisted from previous page",
        taxonomy_level5: "persisted from previous page",
      }),
    );
    expect(pushToDataLayer.pushToDataLayer).toHaveBeenNthCalledWith(1, {
      event: "page_view_ga4",
      page_view: {
        content_id: "<e4a3603d-2d3c-4ff1-9b80-d72c1e6b7a58>",
        dynamic: "true",
        first_published_at: getFirstPublishedAt(),
        language: "undefined",
        location: "http://localhost/",
        logged_in_status: "logged in",
        organisations: "<OT1056>",
        primary_publishing_organisation:
          "government digital service - digital identity",
        referrer: "undefined",
        relying_party: "localhost",
        status_code: "200",
        taxonomy_level1: "taxo1",
        taxonomy_level2: "taxo2",
        taxonomy_level3: "taxo3",
        taxonomy_level4: "taxo4",
        taxonomy_level5: "taxo5",
        title: "home",
        updated_at: getUpdatedAt(),
      },
    });
    expect(pushToDataLayer.pushToDataLayer).toHaveBeenNthCalledWith(2, {
      event: "page_view_ga4",
      page_view: {
        content_id: "<e4a3603d-2d3c-4ff1-9b80-d72c1e6b7a58>",
        dynamic: "true",
        first_published_at: getFirstPublishedAt(),
        language: "undefined",
        location: "http://localhost/",
        logged_in_status: "logged in",
        organisations: "<OT1056>",
        primary_publishing_organisation:
          "government digital service - digital identity",
        referrer: "undefined",
        relying_party: "localhost",
        status_code: "200",
        taxonomy_level1: "taxo1",
        taxonomy_level2: "taxo2",
        taxonomy_level3: "taxo3",
        taxonomy_level4: "taxo4",
        taxonomy_level5: "taxo5",
        title: "home",
        updated_at: getUpdatedAt(),
      },
    });
  });

  test("Taxonomy levels are saved to localStorage", () => {
    const instance = new PageViewTracker(getOptions());
    instance.trackOnPageLoad(getParameters());
    expect(localStorage.getItem("taxonomy_level2")).toBe("taxo2");
    expect(localStorage.getItem("taxonomy_level3")).toBe("taxo3");
    expect(localStorage.getItem("taxonomy_level4")).toBe("taxo4");
    expect(localStorage.getItem("taxonomy_level5")).toBe("taxo5");
  });

  test("Taxonomy levels are not saved to localStorage if value === 'persisted from previous page'", () => {
    const instance = new PageViewTracker(getOptions());
    instance.trackOnPageLoad(
      getParameters({
        taxonomy_level2: "persisted from previous page",
        taxonomy_level3: "persisted from previous page",
        taxonomy_level4: "persisted from previous page",
        taxonomy_level5: "persisted from previous page",
      }),
    );
    expect(localStorage.getItem("taxonomy_level2")).not.toBe(
      "persisted from previous page",
    );
    expect(localStorage.getItem("taxonomy_level3")).not.toBe(
      "persisted from previous page",
    );
    expect(localStorage.getItem("taxonomy_level4")).not.toBe(
      "persisted from previous page",
    );
    expect(localStorage.getItem("taxonomy_level5")).not.toBe(
      "persisted from previous page",
    );
  });
});
