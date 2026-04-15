# Step Card

This component displays a numbered list of steps, each with an image, title, and description or bullet list. It is intended to guide users through a process in a clear, structured format.

- Renders up to 4 steps
- Each step's content comes from your translation files, referenced by a dot-notation key
- A step is only rendered if it is valid (has a `title` and either a `description` or `bulletList`) in **all** configured languages
- Steps that are invalid in any language are silently omitted

## How it works

Step content lives entirely in your translation files. The component uses `buildSteps` — a Nunjucks global provided by `@govuk-one-login/frontend-ui` — to resolve each step's content across all languages and filter out any steps that are incomplete in any language before passing them to the macro.

`buildSteps` is called in the outer template scope (where Nunjucks globals are available), inline within the macro call. The macro itself just renders the pre-resolved steps.

`allTranslations` and `currentLanguage` are set automatically on `res.locals` by `frontendUiMiddleware` and are available in all templates without any extra setup.

## Setup

Register `buildSteps` as a Nunjucks global in your app's Nunjucks configuration:

```js
const frontendUi = require("@govuk-one-login/frontend-ui");

nunjucksEnv.addGlobal("buildSteps", frontendUi.buildSteps);
```

Or if you are already calling `addFrontendUiGlobals`, this is included automatically:

```js
frontendUi.addFrontendUiGlobals(nunjucksEnv);
```

Ensure `frontendUiMiddleware` is registered in your Express app:

```js
const { frontendUiMiddleware } = require("@govuk-one-login/frontend-ui");
app.use(frontendUiMiddleware);
```

## Translation file structure

Each step must have a `title` and either a `description` or a `bulletList`. The `key` you pass is the full dot-notation path from the root of the language object in your translation data.

```json
{
  "pages": {
    "myPage": {
      "steps": [
        {
          "title": "Create an account",
          "description": "Sign up using your email address."
        },
        {
          "title": "Verify your identity",
          "bulletList": ["Provide your passport", "Answer security questions"]
        }
      ]
    }
  }
}
```

This structure must exist in **every** language's translation file. Any step missing `title` and `description`/`bulletList` in any language will be omitted from all languages.

## Usage

```njk
{% from "frontend-ui/build/components/step-card/macro.njk" import frontendUiStepCard %}

{{ frontendUiStepCard({
  translations: translations.translation.stepCard,
  steps: buildSteps(allTranslations, currentLanguage, [
    { key: "translation.pages.myPage.steps.0", image: "/assets/images/step1.svg" },
    { key: "translation.pages.myPage.steps.1", image: "/assets/images/step2.svg" },
    { key: "translation.pages.myPage.steps.2", image: null }
  ])
}) }}
```

## Parameters

### `frontendUiStepCard`

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `translations` | object | Yes | Translations object for the component (e.g. `translations.translation.stepCard`). The template uses `translations.header` for the section heading. |
| `steps` | array | Yes | Array of resolved step objects returned by `buildSteps`. |

### `buildSteps(allTranslations, currentLanguage, steps)`

| Argument | Type | Description |
|----------|------|-------------|
| `allTranslations` | object | All language translation data, available in templates as `allTranslations` via `frontendUiMiddleware`. |
| `currentLanguage` | string | The active language key (e.g. `"en"`), available in templates as `currentLanguage` via `frontendUiMiddleware`. |
| `steps` | array | Array of step definitions, each with a `key` and optional `image`. |

### Step definition

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `key` | string | Yes | Full dot-notation path to the step from the root of the language object (e.g. `translation.pages.myPage.steps.0`). |
| `image` | string | No | Path to the step image. Falls back to an inline SVG placeholder if `null` or omitted. |

## Styles

Styles for this component are defined in `_index.scss`. The component uses GOV.UK Frontend base styles and responsive breakpoints.

## Accessibility

- Step images are marked with `aria-hidden="true"` as they are decorative
- Steps are rendered as an ordered list (`<ol>`) to convey sequence to assistive technologies
