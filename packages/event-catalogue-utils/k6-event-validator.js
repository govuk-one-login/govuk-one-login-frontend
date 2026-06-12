// Mock validateEvent function for k6 testing demonstration
// This simulates the event-catalogue-utils validateEvent function

/**
 * Mock validation function that demonstrates k6 testing with event validation
 * In a real scenario, this would import from @govuk-one-login/event-catalogue-utils
 * @param {Object} event - The event object to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateEventWrapper(event) {
  try {
    console.log('Using mock validateEvent function (real package has dependency issues)');
    
    // Basic validation that mimics real validation behavior
    if (!event || typeof event !== 'object') {
      return false;
    }

    // Check required fields
    const requiredFields = ['component_id', 'event_name', 'event_timestamp_ms', 'timestamp'];
    for (const field of requiredFields) {
      if (!event[field]) {
        console.log(`Missing required field: ${field}`);
        return false;
      }
    }

    // Mock known event validation
    const knownEvents = [
      'AUTH_ACCOUNT_CREATION_REQUEST_SENT',
      'AUTH_ACCOUNT_USER_LOGIN_START', 
      'AUTH_ACCOUNT_USER_LOGIN_SUCCESS',
    ];

    if (!knownEvents.includes(event.event_name)) {
      console.log(`Unknown event type: ${event.event_name}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Event validation error: ${error.message}`);
    return false;
  }
}

export { validateEventWrapper as validateEvent };