import nunjucks from "nunjucks";
import { JSDOM } from "jsdom";
import "../index";
import * as pushToDataLayer from "../utils/pushToDataLayerUtil/pushToDataLayer";
import { acceptCookies, unsetCookies } from "../../test/utils";

async function renderTemplate() {
  const nunjucksEnv = nunjucks.configure(["./src/components"], {
    autoescape: true,
    noCache: true,
  });

  const macroString = `
    {% from "ga4-opl/macro.njk" import ga4OnPageLoad %}

    {{
      ga4OnPageLoad({
        nonce: scriptNonce,
        statusCode:"200",
        englishPageTitle:"general.biometricChip.pageTitle",
        taxonomyLevel1: "document checking application",
        taxonomyLevel2:taxonomy_level2,
        contentId:"002",loggedInStatus:true,dynamic:false
      })
    }}
  `;

  const output = nunjucksEnv.renderString(macroString, {});
  const dom = new JSDOM(output, { runScripts: "dangerously" });
  dom.window.DI = window.DI;
  dom.window.DI.appInit(
    {},
    { enableGa4Tracking: true, isDataSensitive: false },
  );
  await new Promise(process.nextTick);
  return dom;
}

describe("E2E", () => {
  beforeEach(() => {
    unsetCookies();
    jest.spyOn(pushToDataLayer, "pushToDataLayer");
  });

  it("sends the onPageLoad event if cookies are already accepted before the page loads", async () => {
    acceptCookies();

    await renderTemplate();

    const eventsInDataLayer = (
      pushToDataLayer.pushToDataLayer as jest.Mock
    ).mock.calls.map((call) => call[0].event);

    const pageViewEventsInDataLayer = eventsInDataLayer.filter(
      (event) => event === "page_view_ga4",
    );

    expect(pageViewEventsInDataLayer.length).toBe(1);
  });

  it("doesn't send the onPageLoad event if cookies are unset before the page loads", async () => {
    await renderTemplate();

    (pushToDataLayer.pushToDataLayer as jest.Mock).mock.calls.forEach(
      (call) => {
        // Ensure none of the calls have the property `event` set to "page_view_ga4"
        expect(call[0]).not.toHaveProperty("event", "page_view_ga4");
      },
    );
  });

  it("sends the onPageLoad event if cookies are accepted after the page loads", async () => {
    const dom = await renderTemplate();

    acceptCookies();

    dom.window.dispatchEvent(new dom.window.Event("cookie-consent"));

    const eventsInDataLayer = (
      pushToDataLayer.pushToDataLayer as jest.Mock
    ).mock.calls.map((call) => call[0].event);

    const pageViewEventsInDataLayer = eventsInDataLayer.filter(
      (event) => event === "page_view_ga4",
    );

    expect(pageViewEventsInDataLayer.length).toBe(1);
  });
});
