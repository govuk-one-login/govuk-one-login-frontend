# Progress Button Component

A progressively enhanced button component that provides visual feedback during form submissions or asynchronous actions. The component is designed to work across all browsers and prevents multiple submissions.

## Implementation Guide

### Using the Progress Button in Your Application

To use the Progress Button component in your application, follow these steps:

1. **Include the Macro**:
   Import the `frontendUiProgressButton` macro from the `frontend-ui` package in your Nunjucks template:

   ```nunjucks
   {% from "frontend-ui/build/components/progress-button/macro.njk" import frontendUiProgressButton %}
   ```

2. **Add the Progress Button to a Form**:
   Use the macro within a form element to create a progress button that prevents multiple submissions:

   ```html
   <form method="post" id="myForm" action="/api/test-submit-button" novalidate>
       <input type="text" style="margin-bottom: 10px;">
       {{ frontendUiProgressButton({
           translations: translations.translation.progressButton,
           errorPage: "/error",
           customDevErrorTimeout: 10000
       }) }}
   </form>
   ```

3. **Add a Standalone Progress Button**:
   You can also use the progress button outside of a form for other actions:

   ```html
   {{ frontendUiProgressButton({
       translations: translations.progressButton,
       href: "#",
       errorPage: "/error"
   }) }}
   ```

4. **Configure Translations**:
   Ensure that the `translations.progressButton` object is defined in your application to provide the necessary text for the button states.

5. **Error Handling**:
   - The `errorPage` property specifies the URL to redirect to in case of an error.
   - The `customDevErrorTimeout` property allows you to customize the timeout duration for development environments.

### (OPTIONAL) Custom Error Timeout Configuration

The Progress Button component allows you to configure a custom error timeout in two ways:

1. **Via the Macro Configuration**:
   You can set the `customDevErrorTimeout` property directly in the macro when defining the button in your Nunjucks template:

   ```nunjucks
   {{ frontendUiProgressButton({
       translations: translations.translation.progressButton,
       errorPage: "/error",
       customDevErrorTimeout: 10000
   }) }}
   ```

2. **Via JavaScript Initialization**:
   You can also set the custom error timeout globally during the initialization of the Progress Button component in your JavaScript setup file:

   ```javascript
   initialiseProgressButtons({
       customDevErrorTimeout: 15000 // Timeout in milliseconds
   });
   ```

### Precedence of Custom Error Timeout

If both methods are used to set the `customDevErrorTimeout`, the value specified in the **macro configuration** takes precedence over the value set during JavaScript initialization. This allows you to override the global setting for specific buttons as needed.

### Adding the Initialization Script

To ensure the Progress Button component works correctly, you need to include the initialization script in your application. This script sets up the event listeners and manages the button's behavior.

1. **Import the Script**:
   Include the `initialiseProgressButtons` function in your application's setup file.

   ```javascript
   import { initialiseProgressButtons } from "@govuk-one-login/frontend-ui/frontend";
   ```

2. **Call the Initialization Function**:
   Call the `initialiseProgressButtons` function to set up all progress buttons on the page:

   ```javascript
   initialiseProgressButtons();
   ```

3. **Ensure Proper Attribute Usage**:
   Make sure all buttons you want to enhance with this functionality have the `data-frontendui="di-progress-button"` attribute. This attribute is used by the initialization script to identify and configure the buttons.

By following these steps, you can ensure that the Progress Button component is fully functional in your application.

### Example Test Page

The `alpha-app` package includes a test page demonstrating the Progress Button component. You can find it in the following file:

`src/views/test-progress-button.njk`

This page includes examples of:
- A progress button within a form
- A standalone progress button

Refer to this file for additional implementation details.

## JavaScript Functions

### `initialiseProgressButtons()`

The main initialization function that sets up all progress buttons on the page. It:

1. Finds all elements with the `data-frontendui="di-progress-button"` attribute
2. Sets up click and form submission handlers for each button
3. Manages submission state to prevent double submissions
4. Handles both standalone buttons and buttons within forms

### `findClosestForm(element: HTMLElement)`

A utility function that:
- Finds the nearest parent form element
- Used instead of the modern `closest()` method for IE11 compatibility
- Returns null if the button is not within a form

### `handleProgressButtonClick(element, waitingText, longWaitingText, errorPage, isInput)`

The core button handling function that:

1. Stores the original button text
2. Applies loading styles
3. Updates button text and ARIA labels
4. Sets up timeouts for:
   - Long wait message (5 seconds)
   - Error page redirect (10 seconds)
5. Returns a reset function that can restore the button to its original state

## State Management

The component manages several states:

1. **Initial State**: Original button text and styling
2. **Loading State**: 
   - Adds `govuk-button--progress-loading` class
   - Shows waiting text
   - Prevents further clicks/submissions
3. **Long Wait State** (after 5 seconds):
   - Updates to long waiting text
4. **Error State** (after 10 seconds):
   - Redirects to error page
5. **Reset State**: 
   - Returns to initial state
   - Clears all timeouts
   - Removes loading styles
