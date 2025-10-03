# Progress Button Component

A progressively enhanced button component that provides visual feedback during form submissions or asynchronous actions. The component is designed to work across all browsers and prevents multiple submissions.

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