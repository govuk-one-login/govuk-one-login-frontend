// Import the validateEvent function from the event-catalogue-utils package
import { validateEvent } from "@govuk-one-login/event-catalogue-utils";

/**
 * Validates event structure using the official event catalogue validation
 * @param {Object} event - The event object to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateEventWrapper(event) {
  try {
    return validateEvent(event);
  } catch (error) {
    console.error(`Event validation error: ${error.message}`);
    return false;
  }
}

export { validateEventWrapper as validateEvent };