# GOV.UK Frontend v6 Upgrade — Audit & Writeup

## Overview

This document covers the upgrade of the `govuk-one-login-frontend` monorepo from `govuk-frontend` v5 to v6. The upgrade affects two packages directly: `alpha-app` (demo app) and `@govuk-one-login/frontend-ui` (shared UI components).

**Previous version:** `govuk-frontend@5.14.0`  
**New version:** `govuk-frontend@6.4.0`

---

## What's New in GOV.UK Frontend v6

### Breaking Changes

| Change | Impact |
|--------|--------|
| **New type scale** | Text on small screens is larger for improved legibility and accessibility. The smallest size is now 16 (size 14 removed). |
| **Updated GOV.UK brand colours** | Green, red, purple, brown updated. `pink` → `magenta`, `turquoise` → `teal`. Several colours removed (`light-blue`, `dark-blue`, `dark-grey`, `mid-grey`, `light-grey`). |
| **Blue branding is now the default** | The `govukRebrand` feature flag and `.govuk-template--rebranded` class are removed. Blue GOV.UK branding is the only option. |
| **CSS custom properties for functional colours** | Link colours, text colours, border colours etc. are now delivered via CSS custom properties (e.g. `--govuk-link-colour`). |
| **Nunjucks block restructuring** | `header` block now wraps `<header>` element; `govukHeader` block replaces the component. `footer` → same pattern. `main` block scoped to `<main>` only; `container` block wraps the width container. |
| **Removed `.govuk-header__link` styles** | Header link colours now rely on scoped `--govuk-text-colour` custom property rather than explicit `.govuk-header__link:link` rules. |
| **Removed `.govuk-header__navigation-list` reset** | The header no longer ships `list-style: none` for navigation lists (navigation moved to Service Navigation component). |
| **Requires Dart Sass v1.79.0+** | Ruby Sass and LibSass no longer supported. |
| **Removed `govuk-body-xs` and `govuk-!-font-size-14`** | Size 14 no longer exists in the type scale. |
| **Removed `govuk-tint` and `govuk-shade` functions** | Use palette tints/shades directly. |

### New Features

- **CSS custom properties** for all functional colours (brand, text, link, error, success, etc.)
- **`govuk-functional-colour()` Sass function** replaces deprecated Sass variables
- **`govuk-colour()` with `$variant` option** for accessing tints and shades
- **Surface colours** for visually distinct content areas (cookie banner, footer, service nav)
- **Service Navigation component** for service-level navigation
- **Generic Header component** for non-GOV.UK services
- **Interruption Panel** component

---

## Changes Made

### `packages/alpha-app/` (Demo App)

| File | Change |
|------|--------|
| `package.json` | `govuk-frontend`: `^5.14.0` → `^6.0.0` |
| `.env` | Removed `MAY_2025_REBRAND_ENABLED=true` |
| `src/config/nunjucks.ts` | Removed `MAY_2025_REBRAND_ENABLED` Nunjucks global |
| `src/views/common/base.njk` | Removed `govukRebrand` flag; changed `{% block main %}` → `{% block container %}` |

### `packages/frontend-ui/` (Shared UI Components)

#### Package configuration

| File | Change |
|------|--------|
| `package.json` | peerDependency: `"^4.10.1 \|\| ^5.0.0"` → `"^6.0.0"` |

#### SCSS (Styles)

| File | Change |
|------|--------|
| `components/header/_index.scss` | Added explicit `.govuk-header__link` colour styles (white on black); added `align-items: center` to flex container; added `list-style: none` reset for `.govuk-header__navigation-list`; removed all `.govuk-template--rebranded` conditional rules; made rebrand styles the default |
| `components/footer/_index.scss` | Removed `.govuk-template--rebranded` conditionals; made blue border-top and light-blue background the default |

#### Nunjucks Templates

| File | Change |
|------|--------|
| `components/header/template.njk` | Removed `MAY_2025_REBRAND_ENABLED` conditional; removed `_rebrand` variable; removed `rebrand` param from logo macro; always uses `frontendUi_header_signOut-item--rebrand` class |
| `components/footer/template.njk` | Removed `rebrand: MAY_2025_REBRAND_ENABLED` from `govukFooter` macro call |
| `components/macros/logo.njk` | Removed `rebrand` parameter; always uses Tudor Crown and dot logotype |

#### Base Templates (7 files)

| File | Change |
|------|--------|
| `bases/auth/auth-base.njk` | Removed `govukRebrand` flag |
| `bases/home/home-base.njk` | Removed `govukRebrand` flag |
| `bases/mobile/mobile-base.njk` | Removed `govukRebrand` flag |
| `bases/ipv-core/ipv-core-base.njk` | Removed `govukRebrand` flag |
| `bases/identity/identity-base-form.njk` | Removed `govukRebrand` flag and `assetPath = "/public/rebrand"` |
| `bases/identity/identity-base-page.njk` | Removed `govukRebrand` flag and `assetPath = "/public/rebrand"` |
| `bases/identity/v2/identity-base.njk` | Removed `govukRebrand` flag and `assetPath = "/public/rebrand"` |

#### Tests & Documentation

| File | Change |
|------|--------|
| `src/__tests__/footer.test.ts` | Wrapped footer HTML in `<footer>` element for axe landmark check (v6 moved `<footer>` to template) |
| `src/test/jestHelper.ts` | Removed `MAY_2025_REBRAND_ENABLED` Nunjucks global from test setup |
| `README.md` | Removed `MAY_2025_REBRAND_ENABLED` from setup documentation |

---

## Key Decisions & Rationale

### Why `{% block header %}` instead of `{% block govukHeader %}`

The v6 template introduces `{% block govukHeader %}` nested inside `{% block header %}`. The outer block wraps everything in a `<header class="govuk-template__header">` element.

The One Login header (`frontendUiHeader`) renders its own complete `<header class="govuk-header">` element. Using `{% block header %}` replaces the entire section, preventing v6's template from adding a wrapping `<header>` that would interfere with our component's styles.

### Why `{% block container %}` instead of `{% block main %}`

In v6, `{% block main %}` now only wraps the `<main>` element. The alpha-app provides its own `<div class="govuk-width-container">` with phase banner, language select, and main content inside. `{% block container %}` replaces the full width-container section which matches the alpha-app's layout.

### Why explicit `.govuk-header__link` styles are needed

v6 removed `.govuk-header__link:link { color: #fff }` rules. Instead, it sets `--govuk-text-colour` on `.govuk-header` and links inherit via custom properties. However, the global `--govuk-link-colour` (blue) and `--govuk-link-visited-colour` (purple) have higher specificity on `:link` and `:visited` pseudo-classes. The One Login header needs explicit overrides to keep links white on the black background.

### Why `list-style: none` is needed on `.govuk-header__navigation-list`

v6 removed the header's built-in navigation (moved to Service Navigation component). The list reset that was part of the old header CSS is gone. `frontendUiHeader` still uses `.govuk-header__navigation-list` for the sign-out link, so we provide the reset ourselves.

---

## Downstream Impact for Consuming Services

Services using `@govuk-one-login/frontend-ui` will need to:

1. **Update `govuk-frontend` to `^6.0.0`** in their own `package.json`
2. **Remove `MAY_2025_REBRAND_ENABLED`** from their `.env` files and Nunjucks configuration
3. **Remove `govukRebrand` flag** from their base templates
4. **Update Sass** if using any removed classes (`govuk-body-xs`, `govuk-!-font-size-14`) or removed colours
5. **Update Nunjucks blocks** if overriding `main` (now use `container` for width-container replacement)
6. **Test visually** — the new type scale increases text size on small screens, which may affect layout

Services do **not** need to worry about header/footer link colours — the `frontend-ui` package now handles this internally.

---

## Verification

- ✅ `npm install` — v6.4.0 hoisted to root `node_modules`
- ✅ `nx build frontend-ui` — compiles successfully
- ✅ `nx build alpha-app` — Sass and Rollup compile successfully
- ✅ `nx run-many --target=test` — all 12 projects pass
- ✅ App renders with v6 blue branding, correct type scale, black header with white links

---

## Files Changed Summary

```
21 files changed, 70 insertions(+), 139 deletions(-)
```

Net reduction of 69 lines — the upgrade simplifies the codebase by removing conditional rebrand logic that is no longer needed.
