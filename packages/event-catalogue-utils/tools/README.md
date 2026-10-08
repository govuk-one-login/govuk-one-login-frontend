# Precompiled validators

The precompiled validators consumed by `event-catalogue-utils` are published as a
standalone package, **`@govuk-one-login/event-catalogue-typescript-validators`**,
built and released from the private event catalogue repository
(`github.com/govuk-one-login/event-catalogue`, published to GitHub Packages).

> This directory previously held a generator (`generate-validators.mjs`) that was
> a drop-in deliverable for the schemas package build. That approach shipped the
> validators *inside* `@govuk-one-login/event-catalogue-schemas`. It has been
> superseded: the validators now live in their own package, so the generator no
> longer lives here. This file is kept as a pointer for maintainers.

## What the validators package provides

The `@govuk-one-login/event-catalogue-typescript-validators` package contains:

- `<EVENT_NAME>.mjs` — one fully self-contained ESM module per event, at the
  package root. Each default-exports an AJV validation function. The AJV runtime
  is inlined, so these modules have **no dependency on AJV** at consume time. This
  removes any risk of an AJV version clash between the validators package and
  `event-catalogue-utils`.
- `manifest.json` — a sorted array of the event names for which a precompiled
  validator exists.

`event-catalogue-utils` imports a single validator by event name plus the `.mjs`
suffix (the suffix is kept in the static part of the dynamic import so bundlers
such as Vite/esbuild can analyse it):

```ts
await import(
  `@govuk-one-login/event-catalogue-typescript-validators/${eventName}.mjs`
);
```

## Schemas that are skipped

Schemas that cannot be precompiled under the generator's config are **skipped**
and are therefore absent from the package (and from `manifest.json`). For those
events, `event-catalogue-utils` takes the runtime fallback path: it compiles the
JSON schema with AJV, registering `ajv-formats` so `format` keywords (e.g. `uri`,
`date-time`) are supported rather than throwing under strict AJV. See the
package [README](../README.md#validation-performance) for the fast-path /
fallback behaviour.

## Verifying a published validator locally

After authenticating with GitHub Packages and installing the package:

```bash
node --input-type=module -e '
import validate from "@govuk-one-login/event-catalogue-typescript-validators/AUTH_LOG_IN_SUCCESS.mjs";
console.log(typeof validate); // "function"
'
```
