<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  
<h3 align="center">GOV.UK Frontend Vitals Signs</h3>
  <p align="center">
  This package enables GOV UK LOGIN frontend Node.js applications to add frontend vital signs monitoring
    <br />
    <a href=""><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/govuk-one-login/govuk-one-login-frontend/issues">Report Bug</a>
    ·
    <a href="https://github.com/govuk-one-login/govuk-one-login-frontend/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
     <li><a href="#frontendvitalsinitserver-options">`frontendVitalsInit(server, options)`</a></li>
  </ol>
</details>

## About The Project

The GDS Frontend Vitals Signs node package exposes custom metrics (vital-signs) about the health of our Node applications.

The purpose of this package is to make it easy for our FE services to scale in response to demand.

The package is owned by the DI Frontend Capability team, part of the development of this tool involves ongoing discovery with the pods responsible for maintaining the frontend repositories that make up the One Login journey. 

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Installation

1. Install NPM package

   ```sh
   npm install @govuk-one-login/frontend-vitals-signs
   ```
2. Import the package in your Node.js application's startup file (example: app.js or index.js):

   ```js
   const { frontendVitalsInit } = require("@govuk-one-login/frontend-vital-signs");
   ```

  If using TypeScript:

   ```ts
   import frontendVitalsInit from "@govuk-one-login/frontend-vital-signs";
   ```

 

3. In your .env file, add the LOG_LEVEL variable and set it to the desired log level. The   available log levels are:

   - fatal: Logs critical errors that may cause the application to crash.
   - error: Logs error messages indicating something went wrong.
   - warn: Logs warnings about potential issues that are not errors but might need attention.
   - info: Logs informational messages about the application's operation.
   - debug: Logs debug information useful for development.
   - trace: Logs detailed information for debugging purposes.
   - silent: Suppresses all logging output.

  Example:

  Setting the log level to info will log informational messages and errors. To view the logs of our metric object, set it as follows:

  ```dotenv
  LOG_LEVEL=info

  Example Log:

   ```json
  {
    "level": 30,
    "time": 1722420636051,
    "pid": 25367,
    "hostname": "GDS12516",
    "name": "@govuk-one-login/frontend-vitals-signs",
    "version": "0.0.1",
    "requestsPerSecond": {
      "dynamic": 1,
      "static": 0.6
    },
    "avgStaticResponseTime": 1.5,
    "avgDynamicResponseTime": 14.5
  }

   ```

4. Configure the server to use the frontendVitalsInit function. This function initialises the frontend vitals monitoring.

  Example:

   ```js

  const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
  
  frontendVitalsInit(server, {
    interval: 10000, 
    metrics: ["requestsPerSecond", "avgResponseTime"],
    staticPaths: [/^\/assets\/.*/, "/ga4-assets", "/javascript", "/stylesheets"], 
  });

   ```

 
## `frontendVitalsInit(server, options)`

### Parameters

- **`server`** (required): 
  The HTTP or HTTPS server instance that you want to monitor.

- **`options`** (optional): 
  An object containing the following properties:
  
  - **`interval`** (optional, number): 
    The interval in milliseconds for logging metrics. The default value is `10000` (10 seconds).

  - **`metrics`** (optional, array): 
    An array of strings specifying which metrics to log. Possible values include:
    - `"requestsPerSecond"`: Logs the number of requests per second.
    - `"avgResponseTime"`: Logs the average response time.
    - `"maxConcurrentConnections"`: Logs the maximum number of concurrent connections.
    - `"eventLoopDelay"`: Logs lag building up due to Node's event loop getting overloaded by asynchronous operations.
    - `"eventLoopUtilization"`: Logs the time the event loop spends in active and idle states.

  - **`staticPaths`** (optional, array): 
    An array of strings or regular expressions representing paths to your static files. These paths are used to differentiate between static and dynamic requests.
    
    - Strings provided are converted to regular expressions with the format ^{string_value}, meaning the path is treated as the starting part of the URL. For example, the string '/static' is treated as '^/static' and will match any URL that starts with /static.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

