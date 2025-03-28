<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<!-- [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=govuk-one-login_di-fec-ga4&metric=coverage)](https://sonarcloud.io/summary/overall?id=govuk-one-login_di-fec-ga4) -->

<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  
<h3 align="center">GOV.UK Frontend Device Intelligence</h3>
  <p align="center">
    This package enables GOV UK LOGIN frontend Node.js applications to use fingerprinting for analysis.
    <br />
    <a href="TBC"><strong>Explore the docs »</strong></a>
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
        <li><a href="#installation"> Prerequisites and Installation</a></li>
      </ul>
    </li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

The GDS One Login Device Intelligence node package is a shared, reusable nunjuck component created to facilitate the integration of fingerprinting for analysis.

The purpose of this package is to make it as easy as possible for the various pods that make up the One Login journey to collect data in identifying a unique visitor correctly.

The package is owned by the DI Frontend Capability team, part of the development of this package involves ongoing discovery with the pods responsible for maintaining the frontend repositories that make up the One Login journey. As more information is collated, the package and documentation will be updated. As such, it is considered a WIP and the pods will be notified when a stable release is ready.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites and Installation

Top level of the monorepo:
```
npm install
npm run build
```

Or Add to your project using `npm i @govuk-one-login/frontend-device-intelligence`

### Testing

To test the Device Intelligence package in the One Login Frontend monorepo, follow these steps:

  <ol>
    <li> Complete the prerequisites and installation steps. </li> 
    </br>
    <li> Add the /fingerprint path to the app.js so that the application utilises the device intelligence package from the govuk-one-login node modules. </li>
    <br/>
    <li> Add the usage of the fingerprint into the web page by adding in the script into the base nunjucks file. Declare alongside the rest of the scripts in nunjucks context block. </li>
  
  ```
    <script src="/fingerprint/index.js"></script>
    <script>
      console.log(window.ThumbmarkJS.getFingerprint())
      console.log(window.ThumbmarkJS.getFingerprintData())
      console.log(window.ThumbmarkJS.setFingerprintCookie())
    </script>
  ```
  <li> Update the rollup.config.js file to support 'iife' format for browsers. </li>

  ```
    {
      file: "build/iife/index.js",
      format: "iife",
      name: "ThumbmarkJS"
    }
  ```

  <li> Run npm start in the alpha app directory and application should be available at http://localhost:3000. Once loaded, inspect the console to view the result of printing out the fingerprint ID. </li>
  </ol>

## Developing the package

See monorepo instructions for building, testing, and publishing packages.

<p align="right">(<a href="#readme-top">back to top</a>)</p>