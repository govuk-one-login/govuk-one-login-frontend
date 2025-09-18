[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=govuk-one-login_frontend-ui&metric=coverage)](https://sonarcloud.io/summary/overall?id=govuk-one-login_frontend-ui)

# @govuk-one-login/frontend-ui

## Frontend UI Component Integration Guide

This guide outlines the steps to integrate Frontend UI components into your Node.js application using Nunjucks templating.

### 1. Installation

Install the NPM package:

```bash
npm install @govuk-one-login/frontend-ui
```

### 2. Configure View Path

Add the component's path to your Nunjucks view paths in your application's startup file (e.g., `app.js` or `index.js`):

```javascript
const path = require('path');

// ... other configurations ...

app.set(
 'view engine',
 configureNunjucks(app, [
    // ... other view paths ...
    path.resolve('node_modules/@govuk-one-login/frontend-ui')
  ]),
);
```

**Warning:** Ensure the path to your `node_modules` folder is correct.

### 3. Configure Nunjucks to use exported functions

In your `config/nunjucks` file import and set the following to use the language toggle, phase banner etc..

Javascript:
```javascript
const frontendUi = require("@govuk-one-login/frontend-ui");

nunjucksEnv.addGlobal("addLanguageParam", frontendUi.addLanguageParam);
nunjucksEnv.addGlobal("contactUsUrl", frontendUi.contactUsUrl);
nunjucksEnv.addGlobal("MAY_2025_REBRAND_ENABLED", process.env.MAY_2025_REBRAND_ENABLED == "true");
```
Typescript:
```typescript
import {contactUsUrl, addLanguageParam } from "@govuk-one-login/frontend-ui";
nunjucksEnv.addGlobal("addLanguageParam", addLanguageParam);
nunjucksEnv.addGlobal("contactUsUrl", contactUsUrl);
nunjucksEnv.addGlobal("MAY_2025_REBRAND_ENABLED", process.env.MAY_2025_REBRAND_ENABLED == "true");
```

In order to use the `MAY_2025_REBRAND_ENABLED` variable you will need to create or add to your `.env` file the following `MAY_2025_REBRAND_ENABLED=`[true/false]

### 4. Load Translations and Configure Middleware

In your `app.js`, import necessary functions and load translations after initializing i18next (Identity teams may need to use the bypass function as their i18n setup is different):

```javascript
const {
setBaseTranslations
 setFrontendUiTranslations,
 frontendUiMiddleware,
} = require('@govuk-one-login/frontend-ui');

// ... other configurations ...

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init(
    {
      ...i18nextConfigurationOptions(
        path.join(__dirname, 'locales/{{lng}}/{{ns}}.json'),
      ),
    },
    (err) => {

      if (err) {
        console.error('i18next init failed:', err);
      }
    },
  );

// Apply the middleware
setBaseTranslations(i18next);
setFrontendUiTranslations(i18next); 
app.use(i18nextMiddleware.handle(i18next));
app.use(frontendUiMiddleware);

// For Identity teams a language setting bypass may be required, first import the bypass function and then configure router to use the new function at the top of your router.use functions

const {
 frontendUiMiddlewareIdentityBypass,
} = require('@govuk-one-login/frontend-ui');
....

router.use(frontendUiMiddlewareIdentityBypass);

```

### 5. Import Macro

Import the desired component macro into your base Nunjucks template. For example, to use the Cookie Banner component:

```html
{% from "frontend-ui/build/components/cookie-banner/macro.njk" import frontendUiCookieBanner %}
```

To replace your basefile you need to change the appropriate extension at the top of your view file:
```html
{% extends "frontend-ui/build/components/bases/identity/identity-base-form.njk" %}

or 

{% extends "frontend-ui/build/components/bases/identity/identity-base-page.njk" %}

```

### 6. Import all.css

The way is to import the frontend-ui all.css directly into the bottom of your existing css file
```
@import "../../../node_modules/@govuk-one-login/frontend-ui/build/all";
```

### 7. Add Component to Template

Render the component in your template, passing any required data. For the Cookie Banner:

```html
{{ frontendUiCookieBanner({
  translations: translations.translate.cookieBanner 
}) }}
```

This setup ensures that translations are loaded correctly and the middleware can set necessary local variables for the components to function properly.

### Identity Teams Only

Identity teams will also need to install the optional dependency `hmpo-components` and the basefiles

To replace your basefile you need to change the appropriate extension at the top of your view file:
```html
{% extends "frontend-ui/build/components/bases/identity/identity-base-form.njk" %}

or 

{% extends "frontend-ui/build/components/bases/identity/identity-base-page.njk" %}

```

### 8. Import frontend JS

If you need to use a component that incorporates frontend (ie. in-browser) code then you will also need to include the frontend javascript bundle by either importing it in to you existing frontend bundling solution if you use one, or copying and exposing the esm version (`@govuk-one-login/frontend-ui/build/esm/frontend/index.js`) in your public folder. Then add the script tag on to any page where you use it.

```html
  <script nonce='{{ cspNonce }}' defer type="module" src="/public/javascripts/frontend-ui.js"></script>
  <script nonce='{{ cspNonce }}' defer type="module">
    import { useSpinner } from "/public/javascripts/frontend-ui.js";
    useSpinner();
  </script>
```

# Upgrading to V2

## On Page Load has now been added to basefiles
When upgrading to major version 2, GA4 on page load will be within the idenity and core basefiles, this will be a breaking change and implement some duplication on pages if GA4OPL is already being used on them


# Implementation Guide - Progress Button

# When to use the Progress Button

The progress button has veen designed for implementation in use cases such as when the user has clicked to submit a form and the request is in progress.

The aim is to prevent multiple submissions of forms and provide a visual cue whilst the page is loading.

It should be used when there is more than a 2 second delay and less than a 10 second delay between the user clicking the button and seeing the result.

It is best suited to actions which trigger submission of information to an external API or performing short Back End processes.

# When not to use the Progress Button

This should not be used when a user needs to take further action for example when checking their email, opening another app, or retrieving a security code.

The Progress button should not be used when there is less than a 2 second delay between clicking the button and seeing the outcome.

Similarly the button should not be used when there is a delay of more than 10 seconds. 

when is it applicable and when is it not?

# How to implement the progress button.
 
 ### 1. Render component in the progress button template and pass in the necessary data

Provided the above integration steps have been followed (Frontend UI Component Integration Guide) it should be possible to utilise the progress button by adding to the template as below.

 ```html
  {{ frontendUiProgressButton({
    translations: translations.translation.progressButton,
    href: "#",
    errorPage: '/404'
  }) }}
  ```
