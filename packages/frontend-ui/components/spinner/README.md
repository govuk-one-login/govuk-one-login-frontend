# Spinner

This component:
- Displays an animated spinner graphic
- Repeatedly calls a supplied function
- Stops the spinner animation when the function returns success, failure, or doesn't return either after a certain amount of time
- Displays different HTML for the different phases of its lifecycle

It consists of code in `../../frontend-src/spinner/spinner.ts` and styling in `_index.scss`

## Requirements

For the spinner to perform correctly it requires the following:
- A container `div` to display within
- A polling function to call repeatedly until it returns success or failure
- An optional success function to call once if the polling function returns success
- An optional error function to call once if the polling function returns failure, or we reach the abort duration
- A div with id `no-js-content`. This should contain the HTML to display if the user has JS disabled
- An optional div with id `wait-content`. This should contain the default HTML to display under the spinner
- An optional div with id `long-wait-content`. This should contain the HTML to display under the spinner once it has been spinning for the specified long wait duration
- An optional div with id `success-content`. This should contain the HTML to display under the spinner once the polling function returns success
- An optional div with id `error-content`. This should contain the HTML to display under the spinner if the polling function returns failure, or doesn't return success before the abort duration is reached
- An optional data attribute `data-ms-before-informing-of-long-wait` to set the amount of time the spinner will spin before displaying the `long-wait-content`
- An optional data attribute `data-ms-before-abort` to set the amount of time the spinner will spin before displaying the `error-content` and calling the `errorFunction`
- An optional data attribute `data-ms-between-dom-update` to set the amount of time between updates to the spinner UI
- An optional data attribute `data-ms-between-requests` to set the amount of time between calls to the `pollingFunction`
- An optional data attribute `aria-alert-completion-text`. If supplied this text will be set as an aria alert if the spinner completes successfully

For example:

```html
<div id="spinner-container"
     data-ms-before-informing-of-long-wait="10000"
     data-ms-before-abort="30000"
     data-ms-between-dom-update="1000"
     data-ms-between-requests="2000"
     data-aria-alert-completion-text="Task completed successfully, you may now continue">
  <div id="no-js-content"><p class="centre govuk-body">JS is disabled</p></div>
  <div id="wait-content" style="display:none"><p class="centre govuk-body">Waiting</p></div>
  <div id="long-wait-content" style="display:none"><p class="centre govuk-body">Still waiting</p></div>
  <div id="success-content" style="display:none"><p class="centre govuk-body">Success!</p></div>
  <div id="error-content" style="display:none"><p class="centre govuk-body">Error :(</p></div>
</div>
```

Note that the content divs (except for the no-js div) have `style="display:none"` to hide them until they are needed.

```typescript
async function pollFunction(abortSignal): PollResult {
  // Check for success
}

function successFunction(): void {
  // Optionally do stuff, e.g. enable a button, redirect, etc
}

function errorFunction(): void {
  // Optionally do stuff, e.g. enable a button, redirect, etc
}

useSpinner("spinner-container", pollingFunction, successFunction, errorFunction);
```

## Lifecycle

The spinner starts in the waiting state and displays the `wait` content under the animated spinner graphic content.
If a call to the polling function returns `success` the spinner will stop animating, display the `success-content` content, and call the `successFunction` (if specified)
If a call to the polling function returns `failure` the spinner will stop animating, display the `error-content` content, and call the `errorFunction` (if specified)
If the spinner waits past the `long-wait` duration while the polling function keeps returning `pending` the spinner will display the `long-wait-content` content
If the spinner waits past the `abort` duration while the polling function keeps returning `pending` the spinner will stop animating, display the `error-content` content, and call the `errorFunction` (if specified)

### Page refreshes

When the spinner starts for the first time it stores the current time in session storage. If the page is refreshed the spinner will retrieve the initial start time from session storage and update itself appropriately. 

## Scripts

Within the frontend-ui package, this script is bundled within `frontend-src`, so that it can be used in the alpha-app.

Please note that in the `package.json` file of the frontend-ui repo the files needed for the spinner are exported as follows:

```json
 "exports": {
    ".": {
      "import": "./build/esm/index.js",
      "require": "./build/cjs/index.cjs"
    },
    "./frontend": {
      "import": "./build/esm/index-fe.js",
      "require": "./build/cjs/index-fe.cjs"
    }
  },
```

The default import is at the top and the one at the bottom ensures, the correct script files are ported when the package is built.

Configurations to the alpha-app have also been made to ensure these script files work accordingly however this should not affect any users wanting to use the spinner component from the frontend-ui package.

## Manual Testing

The nunjucks files in this folder are to allow automated accessibility testing, most users of the spinner component will only need the CSS and script files.

There is a `/spinner` page in the alpha-app that will display the spinner component.

An endpoint has been created in the alpha-app at `/api` that will return a pending result for a specified number of requests before returning a success response.

```js
let counter = 0;

app.get("/api", (req, res) => {
  counter++;
  const processingTime = req.query.processingTime || 1;
  console.log(
    `Elapsed processing seconds: ${counter}. Processing time limit is: ${processingTime}`,
  );
  if (counter >= processingTime) {
    res.json({ status: "Clear to proceed", counter: counter });
    counter = 0;
  } else {
    res.json({ status: "Still processing", counter: counter });
  }
});
```
