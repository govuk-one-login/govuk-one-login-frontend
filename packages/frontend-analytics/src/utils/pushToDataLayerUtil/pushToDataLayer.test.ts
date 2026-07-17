import { PageViewEventInterface } from "../../analytics/pageViewTracker/pageViewTracker.interface";
import * as pushToDataLayer from "./pushToDataLayer";

describe("should push to dataLayer", () => {
  test("Push preserves system-controlled fields", () => {
    const pageViewTrackerDataLayerEvent: PageViewEventInterface = {
      event: "page_view_ga4",
      page_view: {
        language: "en",
        location: "http://localhost:3000/",
        organisations: "<OT1056>",
        primary_publishing_organisation:
          "government digital service - digital identity",
        referrer: "http://localhost:4000/",
        status_code: "200",
        title: "Home",
        taxonomy_level1: "taxo1",
        taxonomy_level2: "taxo2",
        content_id: "<e4a3603d-2d3c-4ff1-9b80-d72c1e6b7a58>",
        logged_in_status: "logged in",
        dynamic: "true",
        first_published_at: "2022-09-01T00:00:00.000Z",
        updated_at: "2022-09-01T00:00:00.000Z",
        relying_party: "home.account.gov.uk",
      },
    };
    pushToDataLayer.pushToDataLayer(pageViewTrackerDataLayerEvent);

    const pushed = window.dataLayer[0];
    // System fields are preserved unchanged
    expect(pushed.event).toBe("page_view_ga4");
    expect(pushed.page_view.language).toBe("en");
    expect(pushed.page_view.organisations).toBe("<OT1056>");
    expect(pushed.page_view.content_id).toBe(
      "<e4a3603d-2d3c-4ff1-9b80-d72c1e6b7a58>",
    );
    expect(pushed.page_view.first_published_at).toBe(
      "2022-09-01T00:00:00.000Z",
    );
    expect(pushed.page_view.updated_at).toBe("2022-09-01T00:00:00.000Z");
    expect(pushed.page_view.logged_in_status).toBe("logged in");
    expect(pushed.page_view.dynamic).toBe("true");
    expect(pushed.page_view.status_code).toBe("200");
    expect(pushed.page_view.relying_party).toBe("home.account.gov.uk");
    // User-facing fields still processed (no PII here so unchanged)
    expect(pushed.page_view.location).toBe("http://localhost:3000/");
    expect(pushed.page_view.title).toBe("Home");
  });

  test("Push strips PII from user-facing fields", () => {
    const eventWithPII = {
      event: "page_view_ga4",
      page_view: {
        language: "en",
        location: "http://example.com/verify?email=user@example.com",
        title: "Welcome john.smith@gov.uk",
        status_code: "200",
        content_id: "<e4a3603d-2d3c-4ff1-9b80-d72c1e6b7a58>",
        first_published_at: "2022-09-01T00:00:00.000Z",
      },
    } as unknown as PageViewEventInterface;

    pushToDataLayer.pushToDataLayer(eventWithPII);
    const pushed = window.dataLayer[window.dataLayer.length - 1];
    // User-facing fields have PII stripped
    expect(pushed.page_view.location).toContain("[email]");
    expect(pushed.page_view.location).not.toContain("user@example.com");
    expect(pushed.page_view.title).toContain("[email]");
    expect(pushed.page_view.title).not.toContain("john.smith@gov.uk");
    // System fields preserved even though they contain date/UUID patterns
    expect(pushed.page_view.content_id).toBe(
      "<e4a3603d-2d3c-4ff1-9b80-d72c1e6b7a58>",
    );
    expect(pushed.page_view.first_published_at).toBe(
      "2022-09-01T00:00:00.000Z",
    );
  });

  test("Push strips PII from form event fields", () => {
    const event = {
      event: "form_response",
      event_data: {
        event_name: "form_response",
        text: "Call 07911 123456 for help",
        section: "Contact AB 12 34 56 C",
        url: "http://example.com/form",
        external: "false",
      },
    } as unknown as PageViewEventInterface;

    pushToDataLayer.pushToDataLayer(event);
    const pushed = window.dataLayer[window.dataLayer.length - 1];
    // User-facing fields stripped
    expect(pushed.event_data.text).toContain("[phonenumber]");
    expect(pushed.event_data.section).toContain("[nationalInsuranceNumber]");
    // System fields preserved
    expect(pushed.event_data.event_name).toBe("form_response");
    expect(pushed.event_data.external).toBe("false");
  });
});
