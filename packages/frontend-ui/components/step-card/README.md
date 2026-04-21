# Step Card

This component displays a numbered list of steps, each with an image, title, and description or bullet list. It is intended to guide users through a process in a clear, structured format.

## Usage

```njk
{% from "frontend-ui/build/components/step-card/macro.njk" import frontendUiStepCard %}

{{ frontendUiStepCard({
  translations: translations.translation.stepCard,
  steps: [
    {
      data: { title: "Create an account", description: "Sign up using your email address." },
      image: "/assets/images/step1.svg"
    },
    {
      data: { title: "Verify your identity", bulletList: ["Provide your passport", "Answer security questions"] },
      image: "/assets/images/step2.svg"
    }
  ]
}) }}
```

## Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `translations` | object | Yes | Translations object for the component (e.g. `translations.translation.stepCard`). The template uses `translations.header` for the section heading. |
| `steps` | array | Yes | Array of step objects, each with a `data` object and optional `image`. |
| `unlimitedSteps` | boolean | No | If true, skips the default 4 step limit and renders all steps provided. |

### Step object

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `data.title` | string | Yes | The step title. |
| `data.description` | string | No | A short description. Either this or `data.bulletList` is required. |
| `data.bulletList` | string[] | No | A list of bullet points. Either this or `data.description` is required. |
| `image` | string | No | Path to the step image. Falls back to an inline SVG placeholder if omitted. |

## Styles

Styles for this component are defined in `_index.scss`. The component uses GOV.UK Frontend base styles and responsive breakpoints.

## Accessibility

- Step images are marked with `aria-hidden="true"` as they are decorative
- Steps are rendered as an ordered list (`<ol>`) to convey sequence to assistive technologies
