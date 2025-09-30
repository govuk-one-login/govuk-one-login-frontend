export function initialiseProgressButtons(){
  const progressButtons = document.querySelectorAll<HTMLElement>('[data-frontendui="di-progress-button"]');

  progressButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const waitingText = button.getAttribute('data-waiting-text');
      const longWaitingText = button.getAttribute('data-long-waiting-text');
      const errorPage = button.getAttribute('data-error-page');
      const isInput = button.tagName.toLowerCase() === 'input';
      if (!waitingText || !longWaitingText || !errorPage) {
        console.error('Progress button is missing required data attributes.');
        return;
      }
      handleProgressButtonClick(button, waitingText, longWaitingText, errorPage, isInput);
    });
  });
}

const handleProgressButtonClick = (
  
  element: HTMLElement,
  waitingText: string,
  longWaitingText: string,
  errorPage: string,
  isInput: boolean = false
) => {
  element.blur();
  element.setAttribute('data-prevent-double-click', 'true');
  element.classList.add('govuk-button--progress-loading');
  
  if (isInput && element instanceof HTMLInputElement) {
    element.value = waitingText;
  } else {
    element.innerText = waitingText;
  }
  element.setAttribute('aria-label', waitingText);

  setTimeout(() => {
    if (isInput && element instanceof HTMLInputElement) {
      element.value = longWaitingText;
    } else {
      element.innerText = longWaitingText;
    }
    element.setAttribute('aria-label', longWaitingText);
  }, 5000);

  setTimeout(() => {
    window.location.href = errorPage;
  }, 10000);


  
};