[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=govuk-one-login_overload-protection&metric=coverage)](https://sonarcloud.io/summary/overall?id=govuk-one-login_overload-protection)

# GOV.UK One Login Overload Protection

Express load shedding middleware for GOV.UK One Login frontends. When the Node.js event loop is lagging beyond a threshold, the middleware responds with a `503` instead of passing the request on, which helps a struggling instance recover.

It replaces [overload-protection](https://github.com/davidmarkclements/overload-protection) (MIT, unmaintained) with the approach recommended in the GOV.UK One Login team manual, using Node core `perf_hooks.monitorEventLoopDelay`. It has no runtime dependencies.

## Installation

```bash
npm install @govuk-one-login/overload-protection
```

Requires Node.js 18 or later.

## Usage

```js
const express = require("express");
const overloadProtection = require("@govuk-one-login/overload-protection");

const app = express();

app.get("/healthcheck", (req, res) => res.send("ok"));

app.use(overloadProtection({ maxEventLoopDelay: 200 }));

// your routes
```

Register the middleware below your `/healthcheck` endpoint and static assets, so the healthcheck and assets are never rejected, and above your business routes, so requests are shed before any expensive work happens.

## `overloadProtection(options)`

Returns an Express middleware function.

| Option              | Type     | Default | Description                                                                         |
| ------------------- | -------- | ------- | ----------------------------------------------------------------------------------- |
| `maxEventLoopDelay` | `number` | `200`   | The maximum event loop delay in milliseconds, over the last second, above which requests are shed. |

Tune the threshold using your vital-signs `eventLoopDelay` metrics from a performance test. The healthy baseline is around 20ms, the sampling resolution.

### Behaviour

- The event loop delay is sampled every 20ms, and the histogram is reset every second, so the maximum reflects recent lag rather than all-time lag. This is the same statistic vital-signs reports as `eventLoopDelay`, so you can set the threshold just above the peaks you see in your logs.
- On each request, if the maximum delay is greater than `maxEventLoopDelay`, the middleware responds with status `503` and the JSON body `{"message":"Service unavailable"}`. `next()` is not called.
- Otherwise the request continues as normal.
- Once the event loop recovers, requests stop being shed within about a second.

## TypeScript

Type definitions are included. Express types are expected from `@types/express`.

```ts
import overloadProtection = require("@govuk-one-login/overload-protection");

app.use(overloadProtection({ maxEventLoopDelay: 200 }));
```

## Migrating from `overload-protection`

If your service uses the original [overload-protection](https://github.com/davidmarkclements/overload-protection) package, follow these steps. This is not a drop-in replacement: the call signature, options and response are different.

### 1. Swap the dependency

```bash
npm uninstall overload-protection @types/overload-protection
npm install @govuk-one-login/overload-protection
```

Types are included, so `@types/overload-protection` is no longer needed.

### 2. Update the code

Before:

```ts
import overloadProtection from "overload-protection";

app.use(
  overloadProtection("express", {
    production: process.env.NODE_ENV === "production",
    clientRetrySecs: 3,
    sampleInterval: 10,
    maxEventLoopDelay: 700,
    maxHeapUsedBytes: 0,
    maxRssBytes: 0,
    errorPropagationMode: false,
    logging: "warn",
    logStatsOnReq: false,
  }),
);
```

After:

```ts
import overloadProtection from "@govuk-one-login/overload-protection";

app.use(overloadProtection({ maxEventLoopDelay: 700 }));
```

- Remove the `"express"` first argument.
- Pass only `maxEventLoopDelay`. In TypeScript, any other option is a compile error.
- A default import needs `esModuleInterop` in your `tsconfig.json`. Without it, use `import overloadProtection = require("@govuk-one-login/overload-protection");`.
- In CommonJS, use `const overloadProtection = require("@govuk-one-login/overload-protection");`.
- Call it once at startup. Each call starts its own event loop monitor.

### 3. Remove options that no longer exist

| Old option | What happens now |
| ---------- | ---------------- |
| `production` | Not needed. The 503 body is always `{"message":"Service unavailable"}` and never exposes details. |
| `clientRetrySecs` | No `Retry-After` header is sent. |
| `sampleInterval` | Fixed. The event loop is sampled every 20ms. |
| `logging`, `logStatsOnReq` | Not supported. Shed requests are not logged by this package. |
| `errorPropagationMode` | Not supported. The middleware always responds directly with a JSON 503 and never calls `next(err)`, so your error handler and error page are not used for shed requests. |
| `maxHeapUsedBytes`, `maxRssBytes` | Not supported. Only event loop delay is checked. |

### 4. Update types

`HttpProtectionInstance` and `ProtectionConfig` no longer exist. Use Express's `RequestHandler`:

```ts
import type { RequestHandler } from "express";
import overloadProtection from "@govuk-one-login/overload-protection";

export const applyOverloadProtection = (): RequestHandler =>
  overloadProtection({ maxEventLoopDelay: 700 });
```

### 5. Check where the middleware sits

Register it below your `/healthcheck` endpoint and static assets, and above your business routes. A healthcheck that returns 503 under load can cause the load balancer to stop healthy-but-busy tasks.

### 6. Re-tune the threshold

The original package measured how late a 5–10ms timer fired. This package uses the maximum event loop delay over the last second. The same number does not mean the same thing, so don't copy your old `maxEventLoopDelay` across without checking it.

Use the vital-signs `eventLoopDelay` metric, which reports the same statistic, from a performance test or your CloudWatch logs. Set the threshold just above the peaks you see under normal load.

### 7. Update your tests

Unit tests that mock `overload-protection`, or assert on its options, need rewriting against the new call.

### What changes for your users

- The 503 response body is JSON: `{"message":"Service unavailable"}`. The original sent plain text.
- There is no `Retry-After` header.
- Shed requests are not logged.

## Licence

MIT. See [LICENSE](./LICENSE).
