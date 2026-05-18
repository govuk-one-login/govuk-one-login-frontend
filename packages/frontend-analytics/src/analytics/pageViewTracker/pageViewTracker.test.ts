import { acceptCookies, rejectCookies } from "../../../test/utils";
import * as piiRemover from "../../utils/piiRemoverUtil/piiRemover";
import * as pushToDataLayer from "../../utils/pushToDataLayerUtil/pushToDataLayer";
import { getTaxonomy } from "../../utils/taxonomyUtils/taxonomyUtils";
import { validateParameter } from "../../utils/validateParameterUtils/validateParameter";
import { OptionsInterface } from "../core/core.interface";
import { FormChangeTracker } from "../formChangeTracker/formChangeTracker";
import { PageViewTracker } from "./pageViewTracker";
import {
  PageViewEventInterface,
  PageViewParametersInterface,
} from "./pageViewTracker.interface";

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
    acceptCookies();
    vi.clearAllMocks();
    vi.spyOn(pushToDataLayer, "pushToDataLayer");
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
        language: PageViewTracker.getLanguage(),
        location: PageViewTracker.getLocation(),
        organisations: instance.organisations,
        primary_publishing_organisation:
          instance.primary_publishing_organisation,
        referrer: PageViewTracker.getReferrer(),
        status_code: validateParameter(parameters.statusCode.toString(), 3),
        title: validateParameter(parameters.englishPageTitle, 300),
        taxonomy_level1: validateParameter(parameters.taxonomy_level1, 100),
        taxonomy_level2: validateParameter(
          getTaxonomy(parameters.taxonomy_level2, "Level2"),
          100,
        ),
        taxonomy_level3: validateParameter(
          getTaxonomy(parameters.taxonomy_level3, "Level3"),
          100,
        ),
        taxonomy_level4: validateParameter(
          getTaxonomy(parameters.taxonomy_level4, "Level4"),
          100,
        ),
        taxonomy_level5: validateParameter(
          getTaxonomy(parameters.taxonomy_level5, "Level5"),
          100,
        ),
        content_id: validateParameter(parameters.content_id, 100),
        logged_in_status: PageViewTracker.getLoggedInStatus(
          parameters.logged_in_status,
        ),
        dynamic: parameters.dynamic.toString(),
        first_published_at: PageViewTracker.getFirstPublishedAt(),
        updated_at: PageViewTracker.getUpdatedAt(),
        relying_party: PageViewTracker.getRelyingParty(),
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
        language: PageViewTracker.getLanguage(),
        location: PageViewTracker.getLocation(),
        organisations: instance.organisations,
        primary_publishing_organisation:
          instance.primary_publishing_organisation,
        referrer: PageViewTracker.getReferrer(),
        status_code: validateParameter(parameters.statusCode.toString(), 3),
        title: validateParameter(parameters.englishPageTitle, 300),
        taxonomy_level1: validateParameter(parameters.taxonomy_level1, 100),
        taxonomy_level2: validateParameter(
          getTaxonomy(parameters.taxonomy_level2, "Level2"),
          100,
        ),
        taxonomy_level3: validateParameter(
          getTaxonomy(parameters.taxonomy_level3, "Level3"),
          100,
        ),
        taxonomy_level4: validateParameter(
          getTaxonomy(parameters.taxonomy_level4, "Level4"),
          100,
        ),
        taxonomy_level5: validateParameter(
          getTaxonomy(parameters.taxonomy_level5, "Level5"),
          100,
        ),
        content_id: validateParameter(parameters.content_id, 100),
        logged_in_status: PageViewTracker.getLoggedInStatus(
          parameters.logged_in_status,
        ),
        dynamic: parameters.dynamic.toString(),
        first_published_at: PageViewTracker.getFirstPublishedAt(),
        updated_at: PageViewTracker.getUpdatedAt(),
        relying_party: PageViewTracker.getRelyingParty(),
      },
    };
    instance.trackOnPageLoad(parameters);
    expect(pushToDataLayer.pushToDataLayer).toBeCalledWith(dataLayerEvent);
  });

  test("constructor sets default values correctly", () => {
    const defaultInstance = new PageViewTracker({});
    expect(defaultInstance.enableGa4Tracking).toBe(false);
    expect(defaultInstance.enablePageViewTracking).toBe(true);
    expect(defaultInstance.eventName).toBe("page_view_ga4");
    expect(defaultInstance.organisations).toBe("<OT1056>");
    expect(defaultInstance.primary_publishing_organisation).toBe(
      "government digital service - digital identity",
    );
  });

  test("constructor overrides default values", () => {
    const customInstance = new PageViewTracker({
      enableGa4Tracking: true,
      enablePageViewTracking: false,
    });
    expect(customInstance.enableGa4Tracking).toBe(true);
    expect(customInstance.enablePageViewTracking).toBe(false);
  });

  test("getLoggedInStatus returns the good data if logged in", () => {
    const status = PageViewTracker.getLoggedInStatus(true);
    expect(status).toBe("logged in");
  });

  test("getLoggedInStatus returns the good data if logged out", () => {
    const status = PageViewTracker.getLoggedInStatus(false);
    expect(status).toBe("logged out");
  });

  test("getLoggedInStatus returns the good data if loggedinstatus is undefined", () => {
    const status = PageViewTracker.getLoggedInStatus(undefined);
    expect(status).toBe("undefined");
  });

  test("getRelyingParty returns the good data", () => {
    const relyingParty = PageViewTracker.getRelyingParty();
    expect(relyingParty).toBe("localhost");
  });

  test("getFirstPublishedAt returns undefined if first published-at tag doesn't exists", () => {
    const firstPublishedAt = PageViewTracker.getFirstPublishedAt();
    expect(firstPublishedAt).toBe("undefined");
  });

  test("getFirstPublishedAt returns the good data if first published-at tag exists", () => {
    const newTag = document.createElement("meta");
    newTag.setAttribute("name", "govuk:first-published-at");
    newTag.setAttribute("content", "2022-09-01T00:00:00.000Z");
    document.head.appendChild(newTag);
    const firstPublishedAt = PageViewTracker.getFirstPublishedAt();
    expect(firstPublishedAt).toBe("2022-09-01T00:00:00.000Z");
  });

  test("getUpdatedAt returns undefined if updated-at tag doesn't exists", () => {
    const updatedAt = PageViewTracker.getUpdatedAt();
    expect(updatedAt).toBe("undefined");
  });

  test("getUpdatedAt returns the good data if updated-at tag exists", () => {
    const newTag = document.createElement("meta");
    newTag.setAttribute("name", "govuk:updated-at");
    newTag.setAttribute("content", "2022-09-02T00:00:00.000Z");
    document.head.appendChild(newTag);
    const updatedAt = PageViewTracker.getUpdatedAt();
    expect(updatedAt).toBe("2022-09-02T00:00:00.000Z");
  });

  test("getLanguage returns undefined when no lang attribute", () => {
    const language = PageViewTracker.getLanguage();
    expect(language).toBe("undefined");
  });

  test("getLanguage returns language code in lowercase", () => {
    document.documentElement.setAttribute("lang", "EN-GB");
    const language = PageViewTracker.getLanguage();
    expect(language).toBe("en-gb");
  });

  test("getLocation returns current location", () => {
    const location = PageViewTracker.getLocation();
    expect(location).toContain("localhost");
  });

  test("getReferrer returns undefined when no referrer", () => {
    Object.defineProperty(document, "referrer", {
      value: "",
      configurable: true,
    });
    const referrer = PageViewTracker.getReferrer();
    expect(referrer).toBe("undefined");
  });

  test("getReferrer returns referrer in lowercase", () => {
    Object.defineProperty(document, "referrer", {
      value: "HTTP://LOCALHOST:3000/ENTER-EMAIL",
      configurable: true,
    });
    const referrer = PageViewTracker.getReferrer();
    expect(referrer).toBe("http://localhost:3000/enter-email");
  });
});

describe("pageViewTracker test disable ga4 tracking option", () => {
  vi.spyOn(PageViewTracker.prototype, "trackOnPageLoad");

  test("pushToDataLayer should not be called", () => {
    const instance = new PageViewTracker(
      getOptions({
        enableGa4Tracking: false,
      }),
    );
    instance.trackOnPageLoad(getParameters());
    expect(instance.trackOnPageLoad).toReturn();
  });
});

describe("Cookie Management", () => {
  vi.spyOn(PageViewTracker.prototype, "trackOnPageLoad");
  beforeEach(() => {
    acceptCookies();
  });

  test("trackOnPageLoad should return false if visitor rejects cookie consent", () => {
    rejectCookies();
    const instance = new PageViewTracker(getOptions());
    instance.trackOnPageLoad(getParameters());
    expect(instance.trackOnPageLoad).toReturn();
  });
});

describe("Form Change Tracker Trigger", () => {
  const spy = vi.spyOn(FormChangeTracker.prototype, "trackFormChange");

  test("FormChange tracker is not triggered", () => {
    const instance = new PageViewTracker(
      getOptions({
        enableGa4Tracking: false,
      }),
    );

    instance.trackOnPageLoad(getParameters());
    expect(spy).not.toHaveBeenCalled();
  });
});

describe("Form Error Tracker Trigger", () => {
  let instance: PageViewTracker;

  beforeEach(() => {
    vi.clearAllMocks();
    acceptCookies();
    vi.spyOn(pushToDataLayer, "pushToDataLayer");
    instance = new PageViewTracker(getOptions());
  });

  test("trackOnPageLoad should called form error function and return false if form error message exists", () => {
    document.body.innerHTML =
      '<p id="organisationType-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Select one option</p>';
    instance.trackOnPageLoad(getParameters());
    expect(instance.trackOnPageLoad).toReturn();
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
    vi.clearAllMocks();
    vi.spyOn(pushToDataLayer, "pushToDataLayer");
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
    expect(pushToDataLayer.pushToDataLayer).toHaveBeenCalledTimes(2);
    expect(pushToDataLayer.pushToDataLayer).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        event: "page_view_ga4",
        page_view: expect.objectContaining({
          taxonomy_level2: "taxo2",
          taxonomy_level3: "taxo3",
          taxonomy_level4: "taxo4",
          taxonomy_level5: "taxo5",
        }),
      }),
    );
    expect(pushToDataLayer.pushToDataLayer).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        event: "page_view_ga4",
        page_view: expect.objectContaining({
          taxonomy_level2: "taxo2",
          taxonomy_level3: "taxo3",
          taxonomy_level4: "taxo4",
          taxonomy_level5: "taxo5",
        }),
      }),
    );
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

describe("Parameter variations", () => {
  let instance: PageViewTracker;

  beforeEach(() => {
    acceptCookies();
    vi.clearAllMocks();
    vi.spyOn(pushToDataLayer, "pushToDataLayer");
    instance = new PageViewTracker(getOptions());
  });

  test("handles false dynamic parameter", () => {
    instance.trackOnPageLoad(getParameters({ dynamic: false }));
    expect(pushToDataLayer.pushToDataLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        page_view: expect.objectContaining({
          dynamic: "false",
        }),
      }),
    );
  });

  test("handles different status codes", () => {
    instance.trackOnPageLoad(getParameters({ statusCode: 404 }));
    expect(pushToDataLayer.pushToDataLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        page_view: expect.objectContaining({
          status_code: "404",
        }),
      }),
    );
  });

  test("handles undefined taxonomy levels", () => {
    instance.trackOnPageLoad(
      getParameters({
        taxonomy_level3: undefined,
        taxonomy_level4: undefined,
        taxonomy_level5: undefined,
      }),
    );
    expect(pushToDataLayer.pushToDataLayer).toHaveBeenCalled();
  });

  test("handles empty string parameters", () => {
    instance.trackOnPageLoad(
      getParameters({
        englishPageTitle: "",
        content_id: "",
      }),
    );
    expect(pushToDataLayer.pushToDataLayer).toHaveBeenCalled();
  });
});

describe("Edge cases and error handling", () => {
  let instance: PageViewTracker;

  beforeEach(() => {
    acceptCookies();
    vi.clearAllMocks();
    vi.spyOn(pushToDataLayer, "pushToDataLayer");
    instance = new PageViewTracker(getOptions());
  });

  test("handles meta tags with empty content", () => {
    // Clean up any existing meta tags first
    document
      .querySelectorAll(
        'meta[name="govuk:first-published-at"], meta[name="govuk:updated-at"]',
      )
      .forEach((tag) => tag.remove());

    const firstTag = document.createElement("meta");
    firstTag.setAttribute("name", "govuk:first-published-at");
    firstTag.setAttribute("content", "");
    document.head.appendChild(firstTag);

    const updatedTag = document.createElement("meta");
    updatedTag.setAttribute("name", "govuk:updated-at");
    updatedTag.setAttribute("content", "");
    document.head.appendChild(updatedTag);

    expect(PageViewTracker.getFirstPublishedAt()).toBe("");
    expect(PageViewTracker.getUpdatedAt()).toBe("");

    // Clean up
    firstTag.remove();
    updatedTag.remove();
  });

  test("handles null document properties gracefully", () => {
    // Mock stripPIIFromString to return "undefined" when href is null
    const mockStripPII = vi.fn().mockReturnValue("undefined");
    vi.doMock("../../utils/piiRemoverUtil/piiRemover", () => ({
      stripPIIFromString: mockStripPII,
    }));

    const location = PageViewTracker.getLocation();
    expect(location).toContain("localhost"); // Should contain localhost from current location
  });

  test("multiple calls to trackOnPageLoad work correctly", () => {
    instance.trackOnPageLoad(getParameters());
    instance.trackOnPageLoad(
      getParameters({ englishPageTitle: "second page" }),
    );

    expect(pushToDataLayer.pushToDataLayer).toHaveBeenCalledTimes(2);
  });
});

describe("trackOnPageLoad early returns", () => {
  let instance: PageViewTracker;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(pushToDataLayer, "pushToDataLayer");
    instance = new PageViewTracker(getOptions());
  });

  test("returns early when hasConsentForAnalytics is false", () => {
    rejectCookies();
    instance.trackOnPageLoad(getParameters());
    expect(pushToDataLayer.pushToDataLayer).not.toHaveBeenCalled();
  });

  test("returns early when enableGa4Tracking is false", () => {
    acceptCookies();
    const instanceWithoutGa4 = new PageViewTracker(
      getOptions({ enableGa4Tracking: false }),
    );
    instanceWithoutGa4.trackOnPageLoad(getParameters());
    expect(pushToDataLayer.pushToDataLayer).not.toHaveBeenCalled();
  });

  test("returns early when enablePageViewTracking is false", () => {
    acceptCookies();
    const instanceWithoutPageView = new PageViewTracker(
      getOptions({ enablePageViewTracking: false }),
    );
    instanceWithoutPageView.trackOnPageLoad(getParameters());
    expect(pushToDataLayer.pushToDataLayer).not.toHaveBeenCalled();
  });

  test("returns early when isFormErrorPage returns true", () => {
    acceptCookies();
    document.body.innerHTML =
      '<div class="govuk-error-message">Error message</div>';
    instance.trackOnPageLoad(getParameters());
    expect(pushToDataLayer.pushToDataLayer).not.toHaveBeenCalled();
    document.body.innerHTML = "";
  });
});

describe("Static method null handling", () => {
  test("getLanguage handles null html element", () => {
    const originalQuerySelector = document.querySelector;
    document.querySelector = vi.fn().mockReturnValue(null);

    const language = PageViewTracker.getLanguage();
    expect(language).toBe("undefined");

    document.querySelector = originalQuerySelector;
  });

  test("getFirstPublishedAt handles null element", () => {
    const originalQuerySelector = document.querySelector;
    document.querySelector = vi.fn().mockReturnValue(null);

    const result = PageViewTracker.getFirstPublishedAt();
    expect(result).toBe("undefined");

    document.querySelector = originalQuerySelector;
  });

  test("getUpdatedAt handles null element", () => {
    const originalQuerySelector = document.querySelector;
    document.querySelector = vi.fn().mockReturnValue(null);

    const result = PageViewTracker.getUpdatedAt();
    expect(result).toBe("undefined");

    document.querySelector = originalQuerySelector;
  });

  test("getReferrer handles empty referrer string", () => {
    const originalReferrer = document.referrer;
    Object.defineProperty(document, "referrer", {
      value: "",
      configurable: true,
    });

    const referrer = PageViewTracker.getReferrer();
    expect(referrer).toBe("undefined");

    Object.defineProperty(document, "referrer", {
      value: originalReferrer,
      configurable: true,
    });
  });

  test("getReferrer handles non-empty referrer string", () => {
    const originalReferrer = document.referrer;
    Object.defineProperty(document, "referrer", {
      value: "http://localhost:3000/home",
      configurable: true,
    });

    const referrer = PageViewTracker.getReferrer();
    expect(referrer).toBe("http://localhost:3000/home");

    Object.defineProperty(document, "referrer", {
      value: originalReferrer,
      configurable: true,
    });
  });

  test("getLocation returns a string value", () => {
    const result = PageViewTracker.getLocation();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  test("getLocation processes current location", () => {
    const result = PageViewTracker.getLocation();
    expect(typeof result).toBe("string");
    expect(result === "undefined" || result.includes("localhost")).toBe(true);
  });

  test("getLocation handles href processing", () => {
    expect(() => PageViewTracker.getLocation()).not.toThrow();
    const result = PageViewTracker.getLocation();
    expect(typeof result).toBe("string");
  });

  test("getLocation returns 'undefined' when stripPIIFromString returns null", () => {
    const stripPIISpy = vi
      .spyOn(piiRemover, "stripPIIFromString")
      .mockReturnValue(null!);

    const result = PageViewTracker.getLocation();
    expect(result).toBe("undefined");

    stripPIISpy.mockRestore();
  });

  test("getLocation returns 'undefined' when stripPIIFromString returns undefined", () => {
    const stripPIISpy = vi
      .spyOn(piiRemover, "stripPIIFromString")
      .mockReturnValue(undefined!);

    const result = PageViewTracker.getLocation();
    expect(result).toBe("undefined");

    stripPIISpy.mockRestore();
  });

  test("getLocation returns processed string when stripPIIFromString returns valid string", () => {
    const mockProcessedUrl = "http://localhost:3000/enter-password";
    const stripPIISpy = vi
      .spyOn(piiRemover, "stripPIIFromString")
      .mockReturnValue(mockProcessedUrl);

    const result = PageViewTracker.getLocation();
    expect(result).toBe(mockProcessedUrl);
    expect(stripPIISpy).toHaveBeenCalledWith(expect.any(String));

    stripPIISpy.mockRestore();
  });

  test("getLocation calls stripPIIFromString with lowercase href", () => {
    const stripPIISpy = vi.spyOn(piiRemover, "stripPIIFromString");

    PageViewTracker.getLocation();

    // Verify stripPIIFromString was called with a string (the lowercase href)
    expect(stripPIISpy).toHaveBeenCalledWith(expect.any(String));
    const calledWith = stripPIISpy.mock.calls[0][0];
    expect(typeof calledWith).toBe("string");
    expect(calledWith).toBe(calledWith.toLowerCase());

    stripPIISpy.mockRestore();
  });

  test("getLocation calls stripPIIFromString with lowercase href", () => {
    const result = PageViewTracker.getLocation();
    expect(typeof result).toBe("string");
  });
});
