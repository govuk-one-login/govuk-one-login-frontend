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

You will also need to add the following in order to ensure that the assets all load properly across the basefiles
```
"cp -R ../../node_modules/@govuk-one-login/frontend-ui/build/frontendUiAssets [OneLevelAboveWhereYouStoreStyleSheets/SameFolderAsStyleSheets]/"
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