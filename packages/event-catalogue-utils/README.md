[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=govuk-one-login_event-catalogue-utils&metric=coverage)](https://sonarcloud.io/summary/overall?id=govuk-one-login_event-catalogue-utils)

# @govuk-one-login/event-catalogue-utils

Utilities for creating, validating, and sending audit events to TxMA via SQS, in a way that is consistent with the [GOV.UK One Login Event Catalogue](https://github.com/govuk-one-login/event-catalogue).

## Background

GOV.UK One Login fires audit events throughout the user journey. These get sent to TxMA and some are shared with other pods or relying parties via Shared Signals. Without a consistent format, these events can't be shared reliably. This package wraps the Event Catalogue to make sure events are always valid and consistently structured before they're sent.

## Installation

```bash
npm install @govuk-one-login/event-catalogue-utils
```

This package has peer dependencies on the Event Catalogue packages, which are distributed via GitHub Packages. Follow [the instructions in the team manual](https://team-manual.account.gov.uk/development-standards-processes/coding-practices-and-processes/configure-node-package-managers/#configuring-node-package-managers) to authenticate with GitHub Packages before installing.

```bash
npm install @govuk-one-login/event-catalogue @govuk-one-login/event-catalogue-schemas
```

## API

### `createEvent(type, entity)`

Provides static type-checking that an event matches the Event Catalogue definition for the given event name. Returns the event unchanged.

```ts
import { createEvent } from "@govuk-one-login/event-catalogue-utils";

const event = createEvent("AUTH_AUTH_CODE_ISSUED", {
  event_name: "AUTH_AUTH_CODE_ISSUED",
  // ...
});
```

Use this when you want compile-time safety that your event shape is correct, without sending it anywhere yet.

### `validateEvent(event)`

Validates an event at runtime against its JSON schema from the Event Catalogue. Returns a `Promise<boolean>` that resolves to `true` if valid, `false` otherwise. Logs errors if validation fails.

```ts
import { validateEvent } from "@govuk-one-login/event-catalogue-utils";

if (await validateEvent(event)) {
  // event is valid
}
```

Use this when you receive an event from an external source and need to verify it before processing.

> **Async:** `validateEvent` is asynchronous because it may lazily load a precompiled validator for the specific event (see [Validation performance](#validation-performance)). Remember to `await` it.

### `sendEventToSQS(event, queueUrl, options?)`

Sends an event to an SQS queue. Creates a default SQS client (eu-west-2) if one is not provided.

```ts
import { sendEventToSQS } from "@govuk-one-login/event-catalogue-utils";

await sendEventToSQS(event, process.env.TXMA_QUEUE_URL);
```

### `sendToTXMA(type, entity, queueUrl, options?)`

The primary function for most use cases. Combines `createEvent`, `validateEvent`, and `sendEventToSQS` into a single call. Returns a `Promise` that resolves once the event has been sent.

```ts
import { sendToTXMA } from "@govuk-one-login/event-catalogue-utils";

await sendToTXMA("AUTH_AUTH_CODE_ISSUED", event, process.env.TXMA_QUEUE_URL);
```

### `customSendToTXMA(queueUrl, options)`

Curries the `sendToTXMA` function with a queue URL and (optional) `logParams` to provide a reusable simple send-to-TXMA function, which does not need to be passed config every time. The returned function is asynchronous and returns the `sendToTXMA` promise.

```ts
import { customSendToTXMA } from "@govuk-one-login/event-catalogue-utils";

const sendEvent = customSendToTXMA(process.env.TXMA_QUEUE_URL, {
  sqsClient: myClient,
  logParams: ["user_id"],
});

await sendEvent("AUTH_AUTH_CODE_ISSUED", event);
```

## Options

| Option | Type | Description |
|--------|------|-------------|
| `sqsClient` | `SQSClient` | A custom AWS SQS client. Defaults to a memoized client in `eu-west-2`. |
| `logParams` | `string[]` | Keys to extract from the event and include in the success log message. |

## Validation performance

`validateEvent` (and therefore `sendToTXMA`) supports two validation modes. It picks the fastest one available automatically — you do not need to configure anything.

### Fast path — precompiled validators (recommended)

If the installed version of `@govuk-one-login/event-catalogue-schemas` ships **precompiled validators**, `validateEvent` lazily imports the single validator for the incoming event and runs it directly. This means:

- **No AJV schema compilation at runtime** — the cost of compilation is paid at the schemas package's build time, not in your service. This is especially valuable for Lambda cold starts.
- **Only the validator you need is loaded** — each event has its own self-contained validator module, so bundlers load just the one(s) your service actually validates rather than the whole catalogue.
- **No AJV dependency for validation** — the AJV runtime is inlined into each precompiled validator, so there is no risk of an AJV version clash.

This path is fully automatic. There is **no `postinstall` step** and no build step required in your service — it works as long as the installed schemas package includes the precompiled validators.

### Fallback path — runtime compilation

If the installed schemas package does **not** ship a precompiled validator for an event (for example, an older schemas version, or a schema that could not be precompiled), `validateEvent` falls back to compiling the JSON schema at runtime with AJV. Behaviour is identical to the fast path; only the first validation of each event pays the one-off compilation cost (AJV caches the compiled validator per schema for the lifetime of the process).

No action is required to use the fallback — it is the default when precompiled validators are absent, so the package works with any supported version of the schemas package.

> Maintainers: the precompiled validators are produced by a generator that runs as part of the private `@govuk-one-login/event-catalogue-schemas` build. See [`tools/README.md`](./tools/README.md) for how to wire it in.
