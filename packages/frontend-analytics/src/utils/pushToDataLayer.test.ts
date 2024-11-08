import { PageViewEventInterface } from "../analytics/pageViewTracker/pageViewTracker.interface";
import * as pushToDataLayer from "./pushToDataLayer";

describe("should push to dataLayer", () => {
  test("Push", () => {
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
        relying_party: "Relying Party",
      },
    };
    pushToDataLayer.pushToDataLayer(pageViewTrackerDataLayerEvent);
    expect(pageViewTrackerDataLayerEvent).toEqual(window.dataLayer[0]);
  });
});
