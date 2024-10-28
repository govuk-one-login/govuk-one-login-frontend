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

#### Optional: Custom Logger

You can pass a custom logger to the createPersonalDataHeaders function if needed. This is useful if your repo uses custom log levels which our built-in logger doesn't support.
The custom logger must have trace and warn methods that accepts a string.

```javascript
import { createPersonalDataHeaders } from "@govuk-one-login/frontend-passthrough-headers";
import { customLogger } from "./customLogger"; // Optional: Import your own logger

async function routeHandler(req, res, next) {
  const url = "https://internal-service.com/do-something";

  const headers = {
    ...createPersonalDataHeaders(url, req, customLogger),
  };

  const res = await axios.get(url, {
    headers,
  });

  return res.data;
}
```

## Issues

Please raise any issues on the [GitHub repo](https://github.com/govuk-one-login/frontend-passthrough-headers).
