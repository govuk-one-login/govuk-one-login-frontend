<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=govuk-one-login_di-fec-ga4&metric=coverage)](https://sonarcloud.io/summary/overall?id=govuk-one-login_di-fec-ga4)

<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  
<h3 align="center">GOV.UK Frontend Analytics Implementation</h3>
  <p align="center">
    This package enables GOV UK LOGIN frontend Node.js applications to use Google Tag Manager and Google Analytics 4.
    <br />
    <a href="https://govukverify.atlassian.net/wiki/spaces/DIFC/pages/4641358026/Frontend+Analytics"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/govuk-one-login/govuk-one-login-frontend/issues">Report Bug</a>
    ·
    <a href="https://github.com/govuk-one-login/govuk-one-login-frontend/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#updating-to-v4">Updating to V4</a>
    </li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

The GDS Frontend Analytics (Google Analytics 4) node package is a shared, reusable solution created to facilitate the upgrade from GAU to GA4 across the GOV.UK One Login programme as GAU is being retired mid 2024.

The purpose of this package is to make it as easy as possible for the various pods that make up the GOV.UK One Login journey to upgrade their analytics while having as minimal an impact as possible on the dev teams time and effort.

The package is owned by the DI Frontend Capability team, part of the development of this tool involves ongoing discovery with the pods responsible for maintaining the frontend repositories that make up the GOV.UK One Login journey. As more information is collated, the package and documentation will be updated. As such, it is considered a WIP and the pods will be notified when a stable release is ready.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Installation

1. Install NPM package
   ```sh
   npm install @govuk-one-login/frontend-analytics
   ```

2. Configure your node application's startup file (example: app.js or index.js) and add a new virtual directory:

   ```js
   app.use(
     "/ga4-assets",
     express.static(
       path.join(
         __dirname,
         "../node_modules/@govuk-one-login/frontend-analytics/lib",
       ),
     ),
   );
   ```

   ‼️ Check if the path to your node module folder is the correct one. ‼️

3. Set up your environment variables. Two are required for the package to work, others provide a more granular level of control (while not required, it's highly advised to implement these to minimise the impact of bugs and regressions):

| Variable                | Example            | Required  | Notes   |
| ----------------------- | ------------------ | --------  | ------- |
| Ga4ContainerId          | `'GTM-XXXXXXX'`    | Yes       | Provided by the Analytics Team |
| isGa4Enabled            | `true`             | Yes       |Global flag for the package |
| cookieDomain            | `'account.gov.uk'` | No       | Set this to the environment domain eg. `'account.gov.uk'` or `'build.account.gov.uk'` |
| isDataSensitive         | `true`             | No       |If turned on, will redact all form data from analytics, can be set at page level (See Redacting PII) |
| ga4PageViewEnabled      | `true`             | No       | |
| ga4NavigationEnabled    | `true`             | No       | |
| ga4FormResponseEnabled  | `true`             | No       | |
| ga4FormErrorEnabled     | `true`             | No       | |
| ga4FormChangeEnabled    | `true`             | No       | |
| ga4SelectContentEnabled | `true`             | No       | |

These will need to be accessible via your base nunjucks template (example: src/views/common/layout/base.njk).

ℹ Different methods exist if you want to set this variable. Some projects use a middleware, some will prefer to use another method. ℹ

4. Add this block of code into your base nunjucks template:

   ```js
    <script src="/ga4-assets/analytics.js"></script>
    <script>
    window.DI.appInit({ga4ContainerId: "{{ga4ContainerId}}"})
    </script>
   ```

   window.DI.appInit can take another parameter: an object of settings. That can be used if you want to disable some options. This is the property of this settings object:

   - isDataSensitive (boolean): specify if form response tracker can be collect form inputs for tracking purposes (default set to true, this will redact PII)
   - enableGa4Tracking (boolean): enable/disable GA4 trackers
   - cookieDomain (string): specify the domain the analytics consent cookie should be raised against (default is "account.gov.uk")

Example of call:

```js
window.DI.appInit(
  {
    ga4ContainerId: "{{ga4ContainerId}}",
  },
  {
    enableGa4Tracking:{{ga4Enabled}},
    enablePageViewTracking:{{ga4PageViewEnabled}},
    enableFormErrorTracking:{{ga4FormErrorEnabled}},
    enableFormChangeTracking:{{ga4FormChangeEnabled}},
    enableFormResponseTracking:{{ga4FormResponseEnabled}},
    enableNavigationTracking:{{ga4NavigationEnabled}},
    enableSelectContentTracking:{{ga4SelectContentEnabled}},
    cookieDomain:"{{analyticsCookieDomain}}",
    isDataSensitive:{{analyticsDataSensitive}}
  },
);
```

#### Redacting PII

Redacting personally identifiable information can be configured—at a global level and/or page level—by the use of two flags.

The flags `isDataSensitive` and `isPageDataSensitve` both default to true, and when either is true then data is redacted.

The intention is that `isPageDataSensitive` is used as a page-by-page flag, and `isDataSensitive` is used as a global override to force redaction across the whole service.

##### Global Configuration 

In your base Nunjucks template, configure the `isDataSensitive` flag to be `true` if you want to redact all data in your service, or false if you want to control it on a page-by-page basis.

##### Page-Specific Configuration

> ‼️ This option is only available if the global `isDataSensitive` override is set to false.

In your view templates where you need to collect data (use with caution):
- Use Nunjucks templating to set the variable (e.g., isPageDataSensitive) to "false".
- Pass the variable to appInit: Include this variable in your window.DI.appInit call.

Page Level:
```js
{% set isPageDataSensitive = false %}
```

Base Page/Form:
```js
window.DI.appInit(
  {
    ga4ContainerId: "{{ga4ContainerId}}",
  },
  {
    isDataSensitive: false,
    isPageDataSensitive: {{ isPageDataSensitive }},
    enableGa4Tracking: true,
    cookieDomain: "{{ cookieDomain }}",
  },
);
```

ℹ window.DI.appInit is a function loaded from analytics.js. That will create a new instance of our analytics library and store into window.DI.analyticsGa4 ℹ

### Analytics Cookie Consent

The Cookie class is responsible for managing cookies consent about analytics. It provides methods and fields to handle cookie-related operations:

- Set the cookie when the visitor decides to accept or reject any analytics tracking
- Hide the cookie banner that displays a message when the visitor has decided if he rejects or accepts the analytics tracking
- Show the element that displays a message when consent is not given
- Show the element that displays a message when consent is given
- Hide the cookie banner when the visitor wants to hide the accepted or rejected message

ℹ
Tips:
1/ You can get analytics cookie consent status (true or false) by calling the function hasConsentForAnalytics:

```js
window.DI.analyticsGa4.cookie.hasConsentForAnalytics();
```

2/ You can revoke analytics cookie consent by calling the function setBannerCookieConsent:

```js
window.DI.analyticsGa4.cookie.setBannerCookieConsent(
  false,
  youranalyticsdomain,
);
```

ℹ

### Page View Tracker

Page view tracking allows us to see which pages are most visited, where your visitors are coming from, etc.
It can be called by using the method trackOnPageLoad of the object pageViewTracker stored into the analytics library (analyticsGa4)

It takes as a unique parameter an object define by :

- statusCode (number): Status code of the page.
- englishPageTitle (string): English version of the page title.
- taxonomy_level1 (string): Taxonomies are hierarchical tool that allows us to filter data for reporting and insights purposes.
- taxonomy_level2 (string): Taxonomies are hierarchical tool that allows us to filter data for reporting and insights purposes.
- taxonomy_level3 (string): Taxonomies are hierarchical tool that allows us to filter data for reporting and insights purposes.
- taxonomy_level4 (string): Taxonomies are hierarchical tool that allows us to filter data for reporting and insights purposes.
- taxonomy_level5 (string): Taxonomies are hierarchical tool that allows us to filter data for reporting and insights purposes.
- content_id (string): Content ID is a unique ID for each front end display on a given page.
- logged_in_status (boolean): Whether a user is logged in or logged out.
- dynamic (boolean): This parameter indicates whether the page has multiple versions and uses the same URL.

Example:

```js
window.DI.analyticsGa4.pageViewTracker.trackOnPageLoad({
  statusCode: 200,
  englishPageTitle: "english version of the page title",
  taxonomy_level1: "test tax1",
  taxonomy_level2: "test tax2",
  taxonomy_level3: "test tax3",
  taxonomy_level4: "test tax4",
  taxonomy_level5: "test tax5",
  content_id: "<e4a3603d-2d3c-4ff1-9b80-d72c1e6b7a58>",
  logged_in_status: true,
  dynamic: true,
});
```

A Nunjuck component can be used for a reusable solution. The ga4-opl component, available in the "components" folder, lets you add Page view tracking code with just one line of code.
Steps:

1. Add the components folder of this package into your path views array.
2. Import the component into your base files.
3. Add ga4OnPageLoad function at the end of your views.

Example:

```js
{
  {
    ga4OnPageLoad({
      nonce: scriptNonce,
      statusCode: "200",
      englishPageTitle: pageTitleName,
      taxonomyLevel1: "authentication",
      taxonomyLevel2: "feedback",
      taxonomyLevel3: "",
      taxonomyLevel4: "",
      taxonomyLevel5: "",
      contentId: "e08d04e6-b24f-4bad-9955-1eb860771747",
      loggedInStatus: false,
      dynamic: false,
    });
  }
}
```

### Navigation Tracker

Navigation tracking allows us to see exactly how often each navigation link is used. It's triggered by a listener on the click event.

We are tracking different types of link:

- Generic Inbound Links: When a user clicks on a link and it is an inbound link which is defined as any links that point to a domain that does match the domain of the current page
- Generic Inbound Button: When a user clicks on a button and it is an inbound link which is defined as any links that point to a domain that does match the domain of the current page
- Generic Outbound Links: When a user clicks on a link and it is an outbound link, which is defined as any links that point to a domain that does not match the domain of the current page.
- Header Menu Bar: When a user clicks on a link in the header menu
- Footer links: When a user clicks on a link within the footer

ℹ All links are automatically tracked. But if you need to track a button, your element needs to have a specific attributes "data-nav" and "data-link"(e.g: <button data-nav=true data-link="/next-page-url">Next</button>) ℹ

### Form Response Tracker

Trigger by the submission of any form, this tracker will send to GA4 some data about the form details:

- Type of field
- Label of the field
- Submit Button text
- Value of the field

### Checkbox or Radio Fields Without a Legend

If a checkbox or radio field has been implemented without a legend, please follow these steps to ensure the tracker can retrieve the correct section value:

1. Add a `rel` attribute to the tag used to hold the section title.
2. Set the `rel` attribute value to match the `id` of the field.

**Example:**

```js
<h2 rel="consentCheckbox">Section Title</h2>
<div class="govuk-form-group">
  <div class="govuk-checkboxes" data-module="govuk-checkboxes">
    <div class="govuk-checkboxes__item">
      <input id="consentCheckbox" name="consentCheckbox" type="checkbox" />
      <label id="consentCheckbox-label" for="consentCheckbox">
        Checkbox Label
      </label>
    </div>
  </div>
</div>
```

### Form Change Tracker

Form Change Tracker is triggered when a user clicks on a link that allows them to change a previous form they had completed and loads the form page correctly. The URL needs to contain an edit parameter equal to true (example: /my-form-page?edit=true).
We are tracking the label of the field and the submit button text.

### Form Error Tracker

Form Error Tracker is triggered when a page loads and when the page displays any form errors.
We are tracking the label of the field and the error message.

### Checkbox or Radio Fields Without a Legend

If a checkbox or radio field has been implemented without a legend, please follow these steps to ensure the tracker can retrieve the correct section value:

1. Add a `rel` attribute to the tag used to hold the section title.
2. Set the `rel` attribute value to match the `id` of the field.

**Example:**

```js
<h2 rel="consentCheckbox">Section Title</h2>
<div class="govuk-form-group">
  <div class="govuk-checkboxes" data-module="govuk-checkboxes">
    <div class="govuk-checkboxes__item">
      <input id="consentCheckbox" name="consentCheckbox" type="checkbox" />
      <label id="consentCheckbox-label" for="consentCheckbox">
        Checkbox Label
      </label>
    </div>
  </div>
</div>
```

## Upgrading to V4

> ‼️ Before upgrading to V4 please reach out to the Data & Analytics team to understand how the two data sensitivty flags should be set for your service.

The breaking change in V4 is the addition of a page-level flag (`isPageDataSensitive`) to mark data as sensitive, on top of the existing service level flag (`isDataSensitive`).

Another way of explaining this is that setting `isPageDataSensitive` on a page-by-page basis is the best-practice way to determine page sensitivity going forwards. `isDataSensitive` is now to be used as an override to force redact all data in the service if required.

The new behaviour can be best described as:

| isDataSensitive | isPageDataSensitive | Result |
| --- | --- | --- |
| true / undefined | true / false / undefined | Data is redacted |
| false | true | Data is redacted |
| false | false | Data is not redacted |
| false | undefined | **Data is redacted—this is the breaking change you will experience if you upgrade to V4 without making any other changes.** |

To maintain existing behaviour of V3 you'd have to set `isPageDataSensitive` to `false` on every page. This way sensitivity would be entirely determined by `isDataSensitive` as it is in V3.

## Developing the package

See monorepo instructions for building, testing, and publishing packages.
