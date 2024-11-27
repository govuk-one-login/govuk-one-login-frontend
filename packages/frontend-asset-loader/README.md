<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  
<h3 align="center">GOV UK One Login Cached Asset Loader</h3>
  <p align="center">
    This package enables GOV UK LOGIN frontend Node.js applications to add a cached asset loader.
    <br />
    <a href=""><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/govuk-one-login/di-fec-ga4-demo">View Demo</a>
    ·
    <a href="https://github.com/govuk-one-login/di-fec-ga4-demo/issues">Report Bug</a>
    ·
    <a href="https://github.com/govuk-one-login/di-fec-ga4-demo/issues">Request Feature</a>
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
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

The GDS One Login Cached Asset Loader node package is a shared package created to make it as easy as possible for the various pods that make up the One Login journey to configure and add a cached asset loader into their repositories.

The package is owned by the DI Frontend Capability team, part of the development of this tool involves ongoing discovery with the pods responsible for maintaining the frontend repositories that make up the One Login journey. A stable release of the package is now deployed in production.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Installation

#### 1. Install NPM package
   ```sh
   npm install @govuk-one-login/frontend-asset-loader
   ```
#### 2. Import the loadAssets function into your node application's startup file (example: app.js or index.js)

   ```js
   const { loadAssets } = require("@govuk-one-login/frontend-asset-loader");
   ```
#### 3. Initialising the `loadAssets` Function

The `loadAssets` function initialises and maps static assets to your Express application. To use it, provide the following arguments:

- **`app`**: Your Express app instance.
- **`assetPath`**: The base path for your assets (e.g., `public/**/*` or `dist/public/**/*`). This path should contain the hashed asset filenames.
- **`hashBetween` (optional)**: An object specifying the hash delimiters for hashed filenames. For instance, if your hashed filenames look like `main/5a12bc.js`, you'd use `{ start: "/", end: "." }`. The default is `{ start: "-", end: "." }`.
- **`customLogger` (optional)**: A custom logger instance if you prefer to handle logs differently.

The function automatically discovers assets within the specified `assetPath`, checks for potential duplicate filename conflicts (using the hash delimiters to identify unique files), and maps them to accessible routes within your Express application. 

Examples of initalisation:

To load assets using the default hash delimiters
```js
loadAssets(app, "public/**/*");
```

If assets use different delimiters, you can specify them as follows:
```js
loadAssets(app, "public/**/*", { hashStart: "/", hashEnd: "." });
```

Examples of Valid Hash Delimiters:
- Default (hyphen and period): `"application-123abc.css"`
- Custom (forward slash and full stop): `"application/123abc.css"`
Ensure the chosen hashStart and hashEnd options align with your asset filenames for correct hash validation and loading.

4. Configure Base Files to Use Conditional Statements for Assets

To ensure the correct hashed files are used, add a conditional statement in your base files. This checks whether the hashed asset is available in the assets object, and if so, it loads the hashed file. Otherwise, it defaults to the un-hashed version.

Here’s an example:

```html
<script type="text/javascript" 
  {% if assets and assets['all.js'] %} 
    src="/public/javascripts/{{ assets['all.js'] }}" 
  {% else %} 
    src="/public/javascripts/all.js" 
  {% endif %}>
</script>
```
This conditional setup helps prevent issues if the hashed file is missing or not generated yet, ensuring a fallback to the default file path.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

