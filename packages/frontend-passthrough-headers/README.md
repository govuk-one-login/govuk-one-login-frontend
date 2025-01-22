[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=govuk-one-login_frontend-passthrough-headers&metric=coverage)](https://sonarcloud.io/summary/overall?id=govuk-one-login_frontend-passthrough-headers)


# @govuk-one-login/frontend-passthrough-headers

## Purpose

@govuk-one-login/frontend-passthrough-headers is a set of functions to extract pass-through headers that should be passed through our frontends to our backends.

## Table of Contents

1. [Installation](#installation)
2. [How to use](#how-to-use)
3. [Issues](#issues)

## Installation

Add to your project using `npm i @govuk-one-login/frontend-passthrough-headers`

## How to use

### createPersonalDataHeaders

> [!WARNING]
> This function extracts headers that contain Personal Data. It must not be passed through to API calls to external services.

#### Optional: Logger Configuration

The frontend-passthrough-headers library allows you to set a custom logger or use the default pino logger.

Setting a Custom Logger

Use the setCustomLogger function to configure a custom logger. The custom logger must implement the following interface:

```
export type CustomLogger = {
  trace: (message: string) => void;
  warn: (message: string) => void;
};

```

Example:

```

import { setCustomLogger } from "@govuk-one-login/frontend-passthrough-headers";

const customLogger = {
  trace: (message: string) => console.log(`TRACE: ${message}`),
  warn: (message: string) => console.warn(`WARN: ${message}`),
};

setCustomLogger(customLogger);

```

Default Logger

If no custom logger is set, a pino logger is used with:
	•	Name: @govuk-one-login/frontend-passthrough-headers
	•	Log Level: process.env.LOG_LEVEL or process.env.LOGS_LEVEL (defaults to warn).


By default, the logger is initialised only once, and calling setCustomLogger again will log a warning.

## Issues

Please raise any issues on the [GitHub repo](https://github.com/govuk-one-login/frontend-passthrough-headers).
