const { Given, Then } = require("@cucumber/cucumber");
const { expect } = require("chai");
const chai = require("chai");
const chaiSubset = require("chai-subset");
chai.use(chaiSubset);

const DATA_LAYER_PUSH_PREFIX = "window.dataLayer.push";

Given("I reject analytics cookies", async function () {
  const rejectButton = await this.page.locator("[name=cookiesReject]");
  await rejectButton.click();
});

Given("I accept analytics cookies", async function () {
  const acceptButton = await this.page.locator("[name=cookiesAccept]");
  await acceptButton.click();
});

Given("I refresh the page", async function () {
  await this.page.reload();
});

Given(
  "I have neither accepted nor rejected analytics cookies",
  async function () {
    this.context = await global.browser.newContext({});
    this.page = await this.context.newPage();
  },
);

Then("The dataLayer is empty", async function () {
  const dataLayer = await this.page.evaluate("window.dataLayer");
  expect(dataLayer).to.be.empty;
});

Then("The google tag manager script is not loaded", async function () {
  const gaScript = await this.page.evaluate("window.ga");
  expect(gaScript).to.be.undefined;
});

Then("The dataLayer includes the welcome page view event", async function () {
  const dataLayer = await this.page.evaluate("window.dataLayer");
  const url = new URL(this.page.url());
  const pageViewEvent = dataLayer.find(
    (eventItem) => eventItem.event === "page_view_ga4",
  ).page_view;
  expect(pageViewEvent).to.contain({
    language: "en",
    location: "http://localhost:3000/welcome",
    organisations: "<OT1056>",
    primary_publishing_organisation:
      "government digital service - digital identity",
    status_code: "200",
    title: "home ",
    referrer: "undefined",
    taxonomy_level1: "hometax1",
    taxonomy_level2: "hometax2",
    content_id: "&lt;e4a3603d-2d3c-4ff1-9b80-d72c1e6b7a58&gt;",
    dynamic: "false",
    first_published_at: "undefined",
    logged_in_status: "logged out",
    relying_party: url.hostname,
    updated_at: "undefined",
  });
});

Then(
  "The dataLayer includes the organisation type page view event",
  async function () {
    const dataLayer = await this.page.evaluate("window.dataLayer");
    const url = new URL(this.page.url());
    const pageViewEvent = dataLayer.find(
      (eventItem) => eventItem.event === "page_view_ga4",
    ).page_view;
    expect(pageViewEvent).to.contain({
      language: "en",
      location: "http://localhost:3000/organisation-type",
      organisations: "<OT1056>",
      primary_publishing_organisation:
        "government digital service - digital identity",
      status_code: "200",
      title: "organisation type ",
      referrer: "undefined",
      taxonomy_level1: "organisationtax1",
      taxonomy_level2: "organisationtax2",
      content_id: "&lt;e4a3603d-2d3c-4ff1-9b80-d72c1e6b7a68&gt;",
      dynamic: "false",
      first_published_at: "undefined",
      logged_in_status: "logged out",
      relying_party: url.hostname,
      updated_at: "undefined",
    });
  },
);

Then(
  "The dataLayer includes the help with hint page view event",
  async function () {
    const dataLayer = await this.page.evaluate("window.dataLayer");
    const url = new URL(this.page.url());
    const pageViewEvent = dataLayer.find(
      (eventItem) => eventItem.event === "page_view_ga4",
    ).page_view;
    expect(pageViewEvent).to.contain({
      language: "en",
      location: "http://localhost:3000/help-with-hint",
      organisations: "<OT1056>",
      primary_publishing_organisation:
        "government digital service - digital identity",
      status_code: "200",
      title: "help with hint",
      referrer: "undefined",
      taxonomy_level1: "helpwithhinttax1",
      taxonomy_level2: "helpwithhinttax2",
      content_id: "&lt;e4a3603d-2d3c-4ff1-9b80-d72c1e6b7a78&gt;",
      dynamic: "false",
      first_published_at: "undefined",
      logged_in_status: "logged out",
      relying_party: url.hostname,
      updated_at: "undefined",
    });
  },
);

Then(
  "The dataLayer includes the service description page view event",
  async function () {
    const dataLayer = await this.page.evaluate("window.dataLayer");
    const url = new URL(this.page.url());
    const pageViewEvent = dataLayer.find(
      (eventItem) => eventItem.event === "page_view_ga4",
    ).page_view;
    expect(pageViewEvent).to.contain({
      language: "en",
      location: "http://localhost:3000/service-description",
      organisations: "<OT1056>",
      primary_publishing_organisation:
        "government digital service - digital identity",
      status_code: "200",
      title: "service description ",
      referrer: "undefined",
      taxonomy_level1: "servicetax1",
      taxonomy_level2: "servicetax2",
      content_id: "&lt;e4a3603d-2d3c-4ff1-9b80-d72c1e6b7a59&gt;",
      dynamic: "false",
      first_published_at: "undefined",
      logged_in_status: "logged out",
      relying_party: url.hostname,
      updated_at: "undefined",
    });
  },
);

Then(
  "The dataLayer includes the choose location page view event",
  async function () {
    const dataLayer = await this.page.evaluate("window.dataLayer");
    const url = new URL(this.page.url());
    const pageViewEvent = dataLayer.find(
      (eventItem) => eventItem.event === "page_view_ga4",
    ).page_view;
    expect(pageViewEvent).to.contain({
      language: "en",
      location: "http://localhost:3000/choose-location",
      organisations: "<OT1056>",
      primary_publishing_organisation:
        "government digital service - digital identity",
      status_code: "200",
      title: "choose location",
      referrer: "undefined",
      taxonomy_level1: "chooseloctax1",
      taxonomy_level2: "chooseloctax2",
      content_id: "&lt;e4a3603d-2d3c-4ff1-9b80-d72c1e6b7a69&gt;",
      dynamic: "false",
      first_published_at: "undefined",
      logged_in_status: "logged out",
      relying_party: url.hostname,
      updated_at: "undefined",
    });
  },
);

Then(
  "The dataLayer includes the choose enter email page view event",
  async function () {
    const dataLayer = await this.page.evaluate("window.dataLayer");
    const url = new URL(this.page.url());
    const pageViewEvent = dataLayer.find(
      (eventItem) => eventItem.event === "page_view_ga4",
    ).page_view;
    expect(pageViewEvent).to.contain({
      language: "en",
      location: "http://localhost:3000/enter-email",
      organisations: "<OT1056>",
      primary_publishing_organisation:
        "government digital service - digital identity",
      status_code: "200",
      title: "enter email",
      referrer: "undefined",
      taxonomy_level1: "enteremailtax1",
      taxonomy_level2: "enteremailtax2",
      content_id: "&lt;e4a3603d-2d3c-4ff1-9b80-d72c1e6b7a79&gt;",
      dynamic: "false",
      first_published_at: "undefined",
      logged_in_status: "logged out",
      relying_party: url.hostname,
      updated_at: "undefined",
    });
  },
);

Then("The dataLayer includes the summary page view event", async function () {
  const dataLayer = await this.page.evaluate("window.dataLayer");
  const url = new URL(this.page.url());
  const pageViewEvent = dataLayer.find(
    (eventItem) => eventItem.event === "page_view_ga4",
  ).page_view;
  expect(pageViewEvent).to.contain({
    language: "en",
    location: "http://localhost:3000/summary-page",
    organisations: "<OT1056>",
    primary_publishing_organisation:
      "government digital service - digital identity",
    status_code: "200",
    title: "summary page",
    referrer: "undefined",
    taxonomy_level1: "summarypagetax1",
    taxonomy_level2: "summarypagetax2",
    content_id: "&lt;e4a3603d-2d3c-4ff1-9b80-d72c1e6b7a88&gt;",
    dynamic: "false",
    first_published_at: "undefined",
    logged_in_status: "logged out",
    relying_party: url.hostname,
    updated_at: "undefined",
  });
});

Then("The dataLayer includes the navigation button event", async function () {
  const dataLayer = this.context.dataLayer;
  const eventData = dataLayer.find(
    (eventItem) => eventItem.event === "event_data",
  ).event_data;
  expect(eventData).to.deep.equal({
    event_name: "navigation",
    type: "generic button",
    text: "start now",
    section: "undefined",
    action: "undefined",
    url: "http://localhost:3000/organisation-type",
    external: "false",
    link_domain: "http://localhost:3000",
    "link_path_parts.1": "/organisation-type",
    "link_path_parts.2": "undefined",
    "link_path_parts.3": "undefined",
    "link_path_parts.4": "undefined",
    "link_path_parts.5": "undefined",
  });
});

Then(
  "The dataLayer includes the navigation inbound link event",
  async function () {
    const dataLayer = this.context.dataLayer;
    const eventData = dataLayer.find(
      (eventItem) => eventItem.event === "event_data",
    ).event_data;
    expect(eventData).to.deep.equal({
      event_name: "navigation",
      type: "generic link",
      text: "test inbound link",
      section: "undefined",
      action: "undefined",
      url: "http://localhost:3000/service-description",
      external: "false",
      link_domain: "http://localhost:3000",
      "link_path_parts.1": "/service-description",
      "link_path_parts.2": "undefined",
      "link_path_parts.3": "undefined",
      "link_path_parts.4": "undefined",
      "link_path_parts.5": "undefined",
    });
  },
);

Then(
  "The dataLayer includes the navigation outbound link event",
  async function () {
    const dataLayer = this.context.dataLayer;
    const eventData = dataLayer.find(
      (eventItem) => eventItem.event === "event_data",
    ).event_data;
    expect(eventData).to.contain({
      event_name: "navigation",
      type: "generic link",
      text: "test outbound link",
      section: "undefined",
      action: "undefined",
      url: "https://apps.apple.com/gb/app/gov-uk-id-check/id1629050566",
      external: "true",
      link_domain: "https://apps.apple.com",
      "link_path_parts.1": "/gb/app/gov-uk-id-check/id1629050566",
      "link_path_parts.2": "undefined",
      "link_path_parts.3": "undefined",
      "link_path_parts.4": "undefined",
      "link_path_parts.5": "undefined",
    });
  },
);

Then(
  "The dataLayer includes the navigation back link event",
  async function () {
    const dataLayer = this.context.dataLayer;
    const eventData = dataLayer.find(
      (eventItem) => eventItem.event === "event_data",
    ).event_data;
    expect(eventData).to.contain({
      event_name: "navigation",
      type: "back button",
      text: "back",
      section: "undefined",
      action: "undefined",
      url: "http://localhost:3000/welcome",
      external: "false",
      link_domain: "http://localhost:3000",
      "link_path_parts.1": "/welcome",
      "link_path_parts.2": "undefined",
      "link_path_parts.3": "undefined",
      "link_path_parts.4": "undefined",
      "link_path_parts.5": "undefined",
    });
  },
);

Then("The dataLayer includes the navigation logo event", async function () {
  const dataLayer = this.context.dataLayer;
  const eventData = dataLayer.find(
    (eventItem) => eventItem.event === "event_data",
  ).event_data;
  expect(eventData).to.contain({
    event_name: "navigation",
    type: "header menu bar",
    text: "gov.uk",
    section: "logo",
    action: "undefined",
    url: "https://www.gov.uk/",
    external: "true",
    link_domain: "https://www.gov.uk",
    "link_path_parts.1": "/",
    "link_path_parts.2": "undefined",
    "link_path_parts.3": "undefined",
    "link_path_parts.4": "undefined",
    "link_path_parts.5": "undefined",
  });
});

Then(
  "The dataLayer includes the navigation banner link event",
  async function () {
    const dataLayer = this.context.dataLayer;
    const eventData = dataLayer.find(
      (eventItem) => eventItem.event === "event_data",
    ).event_data;
    expect(eventData).to.contain({
      event_name: "navigation",
      type: "header menu bar",
      text: "restart",
      section: "phase banner",
      action: "undefined",
      url: "http://localhost:3000/welcome",
      external: "false",
      link_domain: "http://localhost:3000",
      "link_path_parts.1": "/welcome",
      "link_path_parts.2": "undefined",
      "link_path_parts.3": "undefined",
      "link_path_parts.4": "undefined",
      "link_path_parts.5": "undefined",
    });
  },
);

Then(
  "The dataLayer includes the navigation footer link event",
  async function () {
    const dataLayer = this.context.dataLayer;
    const eventData = dataLayer.find(
      (eventItem) => eventItem.event === "event_data",
    ).event_data;
    expect(eventData).to.contain({
      event_name: "navigation",
      type: "footer",
      text: "contact",
      section: "support links",
      action: "undefined",
      url: "http://localhost:3000/undefined",
      external: "false",
      link_domain: "http://localhost:3000",
      "link_path_parts.1": "/undefined",
      "link_path_parts.2": "undefined",
      "link_path_parts.3": "undefined",
      "link_path_parts.4": "undefined",
      "link_path_parts.5": "undefined",
    });
  },
);

Then(
  "The dataLayer includes the navigation footer licence link event",
  async function () {
    const dataLayer = this.context.dataLayer;
    const eventData = dataLayer.find(
      (eventItem) => eventItem.event === "event_data",
    ).event_data;
    expect(eventData).to.contain({
      event_name: "navigation",
      type: "footer",
      text: "open government licence v3.0",
      section: "licence",
      action: "undefined",
      url: "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/",
      external: "true",
      link_domain: "https://www.nationalarchives.gov.uk",
      "link_path_parts.1": "/doc/open-government-licence/version/3/",
      "link_path_parts.2": "undefined",
      "link_path_parts.3": "undefined",
      "link_path_parts.4": "undefined",
      "link_path_parts.5": "undefined",
    });
  },
);

Then(
  "The dataLayer includes the navigation footer copyright link event",
  async function () {
    const dataLayer = this.context.dataLayer;
    const eventData = dataLayer.find(
      (eventItem) => eventItem.event === "event_data",
    ).event_data;
    expect(eventData).to.deep.equal({
      event_name: "navigation",
      type: "footer",
      text: "© crown copyright",
      section: "copyright",
      action: "undefined",
      url: "https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/",
      external: "true",
      link_domain: "https://www.nationalarchives.gov.uk",
      "link_path_parts.1":
        "/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/",
      "link_path_parts.2": "undefined",
      "link_path_parts.3": "undefined",
      "link_path_parts.4": "undefined",
      "link_path_parts.5": "undefined",
    });
  },
);

Then(
  "The dataLayer includes the navigation menu link event",
  async function () {
    const dataLayer = this.context.dataLayer;
    const eventData = dataLayer.find(
      (eventItem) => eventItem.event === "event_data",
    ).event_data;
    expect(eventData).to.contain({
      event_name: "navigation",
      type: "header menu bar",
      text: "menu link 1",
      section: "undefined",
      action: "undefined",
      url: "http://localhost:3000/organisation-type",
      external: "false",
      link_domain: "http://localhost:3000",
      "link_path_parts.1": "/organisation-type",
      "link_path_parts.2": "undefined",
      "link_path_parts.3": "undefined",
      "link_path_parts.4": "undefined",
      "link_path_parts.5": "undefined",
    });
  },
);

Then(
  "The dataLayer includes the very long navigation menu link event",
  async function () {
    const dataLayer = this.context.dataLayer;
    const eventData = dataLayer.find(
      (eventItem) => eventItem.event === "event_data",
    ).event_data;
    expect(eventData).to.contain({
      event_name: "navigation",
      type: "header menu bar",
      text: "menu link 3",
      section: "undefined",
      action: "undefined",
      url: "http://localhost:3000/xdncnmqhevoqoeotnvmwunsubywwkwwapuzawrybnzgrdocobszfqmpwaxqrphmuehztfzgjjufjotwyqbdhqbtpepxmopvenghdxyz",
      external: "false",
      link_domain: "http://localhost:3000",
      "link_path_parts.1":
        "/xDncNmqheVoQoeOTnVmwUnsuByWwKwwAPUZAWRYBnzgrDOCObSzFqMpwAxQRpHMUehzTfzGJjuFJOtWyQBdHQbtpEpxmopVEnghdxyz",
      "link_path_parts.2": "undefined",
      "link_path_parts.3": "undefined",
      "link_path_parts.4": "undefined",
      "link_path_parts.5": "undefined",
    });
  },
);

Then("The dataLayer includes the form change event", async function () {
  const dataLayer = this.context.dataLayer;
  const eventData = dataLayer.find(
    (eventItem) => eventItem.event === "event_data",
  ).event_data;
  expect(eventData).to.contain({
    event_name: "form_change_response",
    type: "undefined",
    url: "http://localhost:3000/organisation-type?edit=true",
    text: "change",
    section: "what is your organisation type?",
    action: "change response",
    external: "false",
    link_domain: "http://localhost:3000",
    "link_path_parts.1": "/organisation-type",
    "link_path_parts.2": "undefined",
    "link_path_parts.3": "undefined",
    "link_path_parts.4": "undefined",
    "link_path_parts.5": "undefined",
  });
});

Then(
  "The dataLayer includes the form error event into organisation type error page",
  async function () {
    const dataLayer = await this.page.evaluate("window.dataLayer");
    const eventData = dataLayer.find(
      (eventItem) => eventItem.event === "event_data",
    ).event_data;
    expect(eventData).to.contain({
      event_name: "form_error",
      type: "radio buttons",
      url: "http://localhost:3000/validate-organisation-type",
      text: "error: select one option",
      section: "what is your organisation type?",
      action: "error",
      external: "false",
      link_domain: "http://localhost:3000",
      "link_path_parts.1": "/validate-organisation-type",
      "link_path_parts.2": "undefined",
      "link_path_parts.3": "undefined",
      "link_path_parts.4": "undefined",
      "link_path_parts.5": "undefined",
    });
  },
);

Then(
  "The dataLayer includes the form error event into help with hint error page",
  async function () {
    const dataLayer = await this.page.evaluate("window.dataLayer");
    const eventData = dataLayer.find(
      (eventItem) => eventItem.event === "event_data",
    ).event_data;
    expect(eventData).to.contain({
      event_name: "form_error",
      type: "checkbox",
      url: "http://localhost:3000/validate-help-with-hint",
      text: "error: select one or more options",
      section: "what would you like help with?",
      action: "error",
      external: "false",
      link_domain: "http://localhost:3000",
      "link_path_parts.1": "/validate-help-with-hint",
      "link_path_parts.2": "undefined",
      "link_path_parts.3": "undefined",
      "link_path_parts.4": "undefined",
      "link_path_parts.5": "undefined",
    });
  },
);

Then(
  "The dataLayer includes the form error event into service description error page",
  async function () {
    const dataLayer = await this.page.evaluate("window.dataLayer");
    const eventData = dataLayer.find(
      (eventItem) => eventItem.event === "event_data",
    ).event_data;
    expect(eventData).to.contain({
      event_name: "form_error",
      type: "free text field",
      url: "http://localhost:3000/validate-service-description",
      text: "error: enter a short description of your service",
      section: "describe your service",
      action: "error",
      external: "false",
      link_domain: "http://localhost:3000",
      "link_path_parts.1": "/validate-service-description",
      "link_path_parts.2": "undefined",
      "link_path_parts.3": "undefined",
      "link_path_parts.4": "undefined",
      "link_path_parts.5": "undefined",
    });
  },
);

Then(
  "The dataLayer includes the form error event into choose location error page",
  async function () {
    const dataLayer = await this.page.evaluate("window.dataLayer");
    const eventData = dataLayer.find(
      (eventItem) => eventItem.event === "event_data",
    ).event_data;
    expect(eventData).to.contain({
      event_name: "form_error",
      type: "drop-down list",
      url: "http://localhost:3000/validate-choose-location",
      text: "error: select a location",
      section: "choose your location",
      action: "error",
      external: "false",
      link_domain: "http://localhost:3000",
      "link_path_parts.1": "/validate-choose-location",
      "link_path_parts.2": "undefined",
      "link_path_parts.3": "undefined",
      "link_path_parts.4": "undefined",
      "link_path_parts.5": "undefined",
    });
  },
);

Then(
  "The dataLayer includes the form error event into enter email error page",
  async function () {
    const dataLayer = await this.page.evaluate("window.dataLayer");
    const eventData = dataLayer.find(
      (eventItem) => eventItem.event === "event_data",
    ).event_data;
    expect(eventData).to.contain({
      event_name: "form_error",
      type: "free text field",
      url: "http://localhost:3000/validate-enter-email",
      text: "error: enter your email address",
      section: "enter your email address",
      action: "error",
      external: "false",
      link_domain: "http://localhost:3000",
      "link_path_parts.1": "/validate-enter-email",
      "link_path_parts.2": "undefined",
      "link_path_parts.3": "undefined",
      "link_path_parts.4": "undefined",
      "link_path_parts.5": "undefined",
    });
  },
);

Then(
  "The dataLayer includes the organisation type form response event",
  async function () {
    const dataLayer = this.context.dataLayer;
    const eventData = dataLayer.find(
      (eventItem) => eventItem.event === "event_data",
    ).event_data;
    expect(eventData).to.contain({
      event_name: "form_response",
      type: "radio buttons",
      text: "other",
      section: "what is your organisation type?",
      action: "continue",
      url: "http://localhost:3000/validate-organisation-type",
      external: "false",
      link_domain: "http://localhost:3000",
      "link_path_parts.1": "/validate-organisation-type",
      "link_path_parts.2": "undefined",
      "link_path_parts.3": "undefined",
      "link_path_parts.4": "undefined",
      "link_path_parts.5": "undefined",
    });
  },
);

Then(
  "The dataLayer includes the help with hint form response event",
  async function () {
    const dataLayer = this.context.dataLayer;
    const eventData = dataLayer.find(
      (eventItem) => eventItem.event === "event_data",
    ).event_data;
    expect(eventData).to.contain({
      event_name: "form_response",
      type: "checkbox",
      text: "other",
      section: "what would you like help with?",
      action: "continue",
      url: "http://localhost:3000/validate-help-with-hint",
      external: "false",
      link_domain: "http://localhost:3000",
      "link_path_parts.1": "/validate-help-with-hint",
      "link_path_parts.2": "undefined",
      "link_path_parts.3": "undefined",
      "link_path_parts.4": "undefined",
      "link_path_parts.5": "undefined",
    });
  },
);

Then(
  "The dataLayer includes the service description form response event",
  async function () {
    const dataLayer = this.context.dataLayer;
    const eventData = dataLayer.find(
      (eventItem) => eventItem.event === "event_data",
    ).event_data;
    expect(eventData).to.contain({
      event_name: "form_response",
      type: "free text field",
      text: "undefined",
      section: "describe your service",
      action: "continue",
      url: "http://localhost:3000/validate-service-description",
      external: "false",
      link_domain: "http://localhost:3000",
      "link_path_parts.1": "/validate-service-description",
      "link_path_parts.2": "undefined",
      "link_path_parts.3": "undefined",
      "link_path_parts.4": "undefined",
      "link_path_parts.5": "undefined",
    });
  },
);

Then(
  "The dataLayer includes the enter email form response event",
  async function () {
    const dataLayer = this.context.dataLayer;
    const eventData = dataLayer.find(
      (eventItem) => eventItem.event === "event_data",
    ).event_data;
    expect(eventData).to.contain({
      event_name: "form_response",
      type: "free text field",
      text: "undefined",
      section: "enter your email address",
      action: "continue",
      url: "http://localhost:3000/validate-enter-email",
      external: "false",
      link_domain: "http://localhost:3000",
      "link_path_parts.1": "/validate-enter-email",
      "link_path_parts.2": "undefined",
      "link_path_parts.3": "undefined",
      "link_path_parts.4": "undefined",
      "link_path_parts.5": "undefined",
    });
  },
);

Then(
  "The dataLayer includes the choose location form response event",
  async function () {
    const dataLayer = this.context.dataLayer;
    const eventData = dataLayer.find(
      (eventItem) => eventItem.event === "event_data",
    ).event_data;
    expect(eventData).to.contain({
      event_name: "form_response",
      type: "drop-down list",
      text: "london",
      section: "choose your location",
      action: "continue",
      url: "http://localhost:3000/validate-choose-location",
      external: "false",
      link_domain: "http://localhost:3000",
      "link_path_parts.1": "/validate-choose-location",
      "link_path_parts.2": "undefined",
      "link_path_parts.3": "undefined",
      "link_path_parts.4": "undefined",
      "link_path_parts.5": "undefined",
    });
  },
);

Given("I set up a listener for the data layer push", async function () {
  this.page.on("console", (message) => {
    // Given a stringified GA4 event, return the original event before it was stringified, by parsing the
    //  object and adding keys in the undefinedValues array to the event_data object, each with a value of
    //  undefined
    const rebuildOriginalEvent = (stringifiedEvent) => {
      // Given an array of strings, create an object whose properties are exactly these strings and each with
      //  a value of undefined
      function createObjectWithKeys(keys) {
        return keys.reduce((accumulator, value) => {
          return { ...accumulator, [value]: undefined };
        }, {});
      }

      const deconstructedEvent = JSON.parse(stringifiedEvent);
      const undefinedValuesObject = createObjectWithKeys(
        deconstructedEvent.undefinedValues ?? [],
      );

      return {
        event: deconstructedEvent.parsedObject.event,
        event_data: {
          ...(deconstructedEvent.parsedObject.event_data ?? {}),
          ...undefinedValuesObject,
        },
      };
    };

    const text = message.text();

    // Listen for any messages logged to the console which begin with DATA_LAYER_PUSH_PREFIX and add the
    //  GA4 events logged in these messages to the context's dataLayer
    if (text.startsWith(DATA_LAYER_PUSH_PREFIX)) {
      const stringifiedEvent = text.substring(DATA_LAYER_PUSH_PREFIX.length);
      const event = rebuildOriginalEvent(stringifiedEvent);

      this.context.dataLayer = this.context.dataLayer || [];
      this.context.dataLayer.push(event);
    }
  });

  // Extend the push function on window.dataLayer so that we can track events sent to window.dataLayer, even
  //  when the current page changes
  await this.page.evaluate((dataLayerPushPrefix) => {
    window.dataLayer = window.dataLayer || [];
    const originalPush = window.dataLayer.push;
    window.dataLayer.push = (...args) => {
      originalPush.apply(window.dataLayer, args);

      // Given an object, returns the keys of that object which have a value of undefined
      const getUndefinedValues = (obj) => {
        if (typeof obj !== "object") return [];
        return Object.entries(obj)
          .filter(([, v]) => v === undefined)
          .map(([k]) => k);
      };

      // For every item pushed to the dataLayer, log this to the browser console which is being listened for
      args.forEach((arg) => {
        const deconstructedEvent = {
          parsedObject: JSON.parse(JSON.stringify(arg)),
        };
        deconstructedEvent.undefinedValues = getUndefinedValues(arg.event_data);
        /* eslint-disable-next-line no-console */
        console.log(dataLayerPushPrefix, JSON.stringify(deconstructedEvent));
      });
    };
  }, DATA_LAYER_PUSH_PREFIX);
});
