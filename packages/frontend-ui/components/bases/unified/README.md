# Unified Base Template

`base.njk` is the shared base template for all GOV.UK One Login frontend team templates.

## What's in the base

- `MAY_2025_REBRAND_ENABLED` → `govukRebrand` flag
- Extends `govuk/template.njk`
- Imports for all five `frontend-ui` macros (cookie-banner, phase-banner, header, footer, language-select)
- `pageTitle` block with error prefix and service name
- `cookieBanner` in `bodyStart`
- `header` with `homepageUrl: "https://www.gov.uk"`
- `govuk-width-container` wrapper with phase banner, language toggle (`showLanguageToggle`), back link block, and `govuk-main-wrapper`
- `footer` with `translations.translation.footer`
- `bodyEnd` with a `scripts` block

## Team templates that extend this base

| Template | Variable mappings applied |
|---|---|
| `auth/auth-base.njk` | `languageToggleEnabled` → `showLanguageToggle` |
| `home/home-base.njk` | none needed |
| `ipv-core/ipv-core-base.njk` | `currentLanguage` → `mainLang` / `htmlLang` / `pageTitleLang` |
| `mobile/mobile-base.njk` | none needed |

## Not yet consolidated — identity templates

`identity/identity-base-form.njk` and `identity/identity-base-page.njk` extend `form-template.njk` and
`hmpo-template.njk` respectively (third-party HMPO templates), so they cannot extend `base.njk` without
a breaking change to the identity team's setup.

