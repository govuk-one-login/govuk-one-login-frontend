# Precompiled validators — deliverable for `@govuk-one-login/event-catalogue-schemas`

This directory contains a generator (`generate-validators.mjs`) that is intended
to run as part of the **private `@govuk-one-login/event-catalogue-schemas`**
package build. `event-catalogue-utils` consumes its output at runtime for a fast,
precompiled validation path (see this package's README).

> The schemas package lives in a separate private repository
> (`github.com/govuk-one-login/event-catalogue`, published to GitHub Packages).
> The files here are a drop-in deliverable for that repo — they are not wired
> into it automatically.

## What the generator produces

Running the generator emits, into an output directory (default `./dist/validators`):

- `validators/<EVENT_NAME>.mjs` — one fully self-contained ESM module per event.
  Each default-exports an AJV validation function. The AJV runtime is inlined by
  esbuild, so these modules have **no dependency on AJV** at consume time. This
  removes any risk of an AJV version clash between the schemas package and
  `event-catalogue-utils`.
- `validators/manifest.json` — a sorted array of the event names for which a
  precompiled validator exists.

Schemas that cannot be compiled under the strict runtime config (e.g. schemas
using `format` keywords such as `date-time`, which strict AJV rejects without
`ajv-formats`) are **skipped** and listed in the build log. This is intentional:
the runtime fallback in `event-catalogue-utils` uses the identical AJV config, so
those events behave the same whether or not a precompiled validator is present —
they simply take the fallback path.

## Steps to wire into the schemas package

1. Copy `generate-validators.mjs` into the schemas repo (e.g. `tools/`).

2. Add `esbuild` and `ajv` as `devDependencies` of the schemas package (the
   generator needs them at build time only; they are **not** runtime deps):

   ```jsonc
   {
     "devDependencies": {
       "ajv": "^8.18.0",
       "esbuild": "^0.23.0"
     }
   }
   ```

3. Wire the generator into the package `build` script so validators are always
   regenerated (and therefore always match the published schema version):

   ```jsonc
   {
     "scripts": {
       "build": "tsc && node tools/generate-validators.mjs --schemas ./src/schemas --out ./dist/validators"
     }
   }
   ```

4. Add subpath `exports` so consumers can import a single validator by event
   name, plus the manifest. Keep the existing `main`/root export intact:

   ```jsonc
   {
     "exports": {
       ".": "./dist/index.js",
       "./validators/manifest.json": "./dist/validators/manifest.json",
       "./validators/*.mjs": "./dist/validators/*.mjs"
     }
   }
   ```

   > Note: the `"./validators/*.mjs"` pattern maps
   > `@govuk-one-login/event-catalogue-schemas/validators/AUTH_LOG_IN_SUCCESS.mjs`
   > to `./dist/validators/AUTH_LOG_IN_SUCCESS.mjs`. `event-catalogue-utils`
   > imports using the event name plus the `.mjs` suffix (the suffix is kept in
   > the static part of the dynamic import so bundlers such as Vite/esbuild can
   > analyse it).

5. Ensure the generated artifacts are included in the published tarball:

   ```jsonc
   {
     "files": [
       "dist/"
     ]
   }
   ```

   (If the package uses a narrower `files` list, add `dist/validators/`.)

## Verifying locally

From the schemas repo root, after `npm run build`:

```bash
node --input-type=module -e '
import validate from "./dist/validators/AUTH_LOG_IN_SUCCESS.mjs";
console.log(typeof validate); // "function"
'
npm pack --dry-run   # confirm dist/validators/*.mjs + manifest.json are listed
```
