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
    path.resolve('node_modules/@govuk-one-login/frontend-ui'),
  ]),
);
```

**Warning:** Ensure the path to your `node_modules` folder is correct.

### 3. Load Translations and Configure Middleware

In your `app.js`, import necessary functions and load translations after initializing i18next:

```javascript
const {
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
      // Load Frontend UI translations after i18next initialization and pass current instance of i18next
      setFrontendUiTranslations(i18next); 

      if (err) {
        console.error('i18next init failed:', err);
      }
    },
  );

// Apply the middleware
app.use(frontendUiMiddleware);
```

### 4. Import Macro

Import the desired component macro into your base Nunjucks template. For example, to use the Cookie Banner component:

```html
{% from "frontend-ui/build/components/cookie-banner/macro.njk" import frontendUiCookieBanner %}
```

### 5. Import all.css
Import the css into your service in the `package.json` via the `build-sass` script
```
sass --no-source-map node_modules/@govuk-one-login/frontend-ui/build/all.css *destination*/frontend-ui.css --style compressed"
```

include a link to this in your template file
```html
{% block head %}
     '''
    <link href="/stylesheets/frontend-ui.css" rel="stylesheet">
{% endblock %}
```


### 6. Add Component to Template

Render the component in your template, passing any required data. For the Cookie Banner:

```html
{{ frontendUiCookieBanner({
  cookieBanner: translations 
}) }}
```

This setup ensures that translations are loaded correctly and the middleware can set necessary local variables for the components to function properly.
