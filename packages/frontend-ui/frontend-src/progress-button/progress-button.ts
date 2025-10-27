export function initialiseProgressButtons(document: Document = window.document) {
  // Create a single live region for button status announcements
  const statusRegion = document.createElement('div');
  statusRegion.setAttribute('aria-live', 'assertive');
  statusRegion.setAttribute('role', 'status');
  statusRegion.className = 'govuk-visually-hidden';
  document.body.appendChild(statusRegion);

  const progressButtons = Array.prototype.slice.call(
    document.querySelectorAll('[data-frontendui="di-progress-button"]')
  );

  function findClosestForm(element: HTMLElement): HTMLFormElement | null {
    let el: HTMLElement | null = element;
    while (el && el.nodeName !== 'FORM') {
      el = el.parentElement;
    }
    return el as HTMLFormElement;
  }

  progressButtons.forEach(function(button: HTMLElement) {
    const form = findClosestForm(button);
    let isSubmitting = false;

    // Handle spacebar press for anchor tags
    if (button.tagName.toLowerCase() === 'a') {
      button.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
          event.preventDefault();
          button.click();
        }
      });
    }

    button.addEventListener('click', function(event) {
      if (isSubmitting) {
        event.preventDefault();
        return;
      }

      const waitingText = button.getAttribute('data-waiting-text');
      const longWaitingText = button.getAttribute('data-long-waiting-text');
      const errorPage = button.getAttribute('data-error-page');
      const isInput = button.tagName.toLowerCase() === 'input';
      
      if (!waitingText || !longWaitingText || !errorPage) {
        console.error('Progress button is missing required data attributes.');
        return;
      }

      isSubmitting = true;
      
      // Always handle the button click, regardless of form presence
      handleProgressButtonClick(button, waitingText, longWaitingText, errorPage, isInput);

      // If no form, we're done. If there is a form, the form submit handler will take over
      if (!form) {
        return;
      }
      
      // For form buttons, let the click propagate to trigger form submission
    });

    if (form) {
      form.addEventListener('submit', function(event) {
        // The button click handler has already set isSubmitting and handled the button state
        if (isSubmitting) {
          // Allow the first submission, prevent subsequent ones
          if (event.target === form && event.submitter === button) {
            return; // Allow the first submission to proceed
          }
          event.preventDefault ? event.preventDefault() : (event.returnValue = false);
          return;
        }

        // If the form is submitted through another method (not our button),
        // prevent double submission but don't show progress state
        isSubmitting = true;
      });
    }
  });
}

function handleProgressButtonClick(
  element: HTMLElement,
  waitingText: string,
  longWaitingText: string,
  errorPage: string,
  isInput: boolean
): () => void {
  var originalText = isInput && element instanceof HTMLInputElement ? element.value : element.innerText;
  const statusRegion = document.querySelector('.govuk-visually-hidden[role="status"]');
  
  if (typeof element.blur === 'function') {
    element.blur();
  }
  element.setAttribute('data-prevent-double-click', 'true');
  
  var classes = element.className.split(' ');
  if (classes.indexOf('govuk-button--progress-loading') === -1) {
    classes.push('govuk-button--progress-loading');
    element.className = classes.join(' ');
  }
  
  if (isInput && element instanceof HTMLInputElement) {
    element.value = waitingText;
  } else {
    element.innerText = waitingText;
  }

  // Announce the initial waiting state
  if (statusRegion) {
    statusRegion.textContent = waitingText;
  }

  var longWaitTimeout = window.setTimeout(function() {
    if (isInput && element instanceof HTMLInputElement) {
      element.value = longWaitingText;
    } else {
      element.innerText = longWaitingText;
    }
    
    // Announce the long wait state
    if (statusRegion) {
      statusRegion.textContent = longWaitingText;
    }
  }, 5000);

  var errorTimeout = window.setTimeout(function() {
    window.location.href = errorPage;
  }, 10000);

  function resetButton() {
    var classes = element.className.split(' ');
    var loadingIndex = classes.indexOf('govuk-button--progress-loading');
    if (loadingIndex !== -1) {
      classes.splice(loadingIndex, 1);
      element.className = classes.join(' ');
    }
    
    element.setAttribute('data-prevent-double-click', 'false');
    
    if (isInput && element instanceof HTMLInputElement) {
      element.value = originalText;
    } else {
      element.innerText = originalText;
    }
    
    // Clear status region without announcement
    const statusRegion = document.querySelector('.govuk-visually-hidden[role="status"]');
    if (statusRegion) {
      statusRegion.textContent = '';
    }
    
    window.clearTimeout(errorTimeout);
    window.clearTimeout(longWaitTimeout);
  }

  (element as any).resetProgressButton = resetButton;

  return resetButton;
}