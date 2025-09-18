export async function useSpinner(containerId: string, pollingFunction: PollingFunction, successFunction: VoidFunction, errorFunction: VoidFunction) {
  const element = document.getElementById(containerId);

  if (element && element instanceof HTMLDivElement) {
    let spinner: Spinner;
    try {
      spinner = new Spinner(element, pollingFunction, successFunction, errorFunction);
    }
    catch (e) {
      const errorText = document.createElement("p");
      errorText.textContent = "Error configuring spinner: " + e;
      element.replaceChildren(errorText);
      return;
    }
    await spinner.init();
  } else {
    console.error(
      `Attempting to initiate a spinner on a page with no '#${containerId}' div element.`,
    );
  }
}

export type PollingFunction = (abortSignal: AbortSignal) => Promise<PollResult>;

export enum PollResult {
  Success,
  Failure,
  Pending,
}

enum SpinnerState {
  Waiting,
  LongWaiting,
  Error,
  Complete,
}

type SpinnerConfig = {
  msBeforeInformingOfLongWait: number;
  msBeforeAbort: number;
  msBetweenRequests: number;
  msBetweenDomUpdate: number;
};

export class Spinner {
  container: HTMLDivElement;
  noJsContent: HTMLElement;
  waitContent?: HTMLElement;
  longWaitContent?: HTMLElement;
  successContent?: HTMLElement;
  errorContent?: HTMLElement;

  visibleElementsContainer: HTMLDivElement;

  state: SpinnerState = SpinnerState.Waiting;
  displayState?: SpinnerState;
  updateDomTimer?: NodeJS.Timeout;
  abortController: AbortController;
  config: SpinnerConfig;

  pollingFunction: PollingFunction;
  onSuccess: VoidFunction;
  onError: VoidFunction;


  constructor(domContainer: HTMLDivElement, pollingFunction: PollingFunction, onSuccess: VoidFunction, onError: VoidFunction) {
    this.container = domContainer;

    this.pollingFunction = pollingFunction;
    if (!pollingFunction) {
      throw new Error("Polling function must be provided");
    }

    this.onSuccess = onSuccess;
    this.onError = onError;

    this.noJsContent = this.getElementOrThrow("no-js-content");
    this.noJsContent.style.display = "none";

    this.waitContent = this.container.querySelector("#wait-content") || undefined;
    this.longWaitContent = this.container.querySelector("#long-wait-content") || undefined;
    this.successContent = this.container.querySelector("#success-content") || undefined;
    this.errorContent = this.container.querySelector("#error-content") || undefined;

    if (!this.successContent && !onSuccess) {
      throw new Error("One of success-content or successFunction must be provided");
    }
    if (!this.errorContent && !onError) {
      throw new Error("One of error-content or errorFunction must be provided");
    }

    this.config = this.getConfig(this.container);

    this.visibleElementsContainer = document.createElement("div");
    this.container.appendChild(this.visibleElementsContainer);

    this.abortController = this.createAbortController();
  }

  getElementOrThrow(elementId: string): HTMLElement {
    const element = this.container.querySelector(`#${elementId}`);
    if (element === null || !(element instanceof HTMLElement)) {
      throw new Error(`HTML Element with id ${elementId} must be provided`);
    }
    return element;
  }

  getConfig(element: HTMLDivElement): SpinnerConfig {
    return {
      msBeforeInformingOfLongWait: element.dataset.msBeforeInformingOfLongWait
        ? parseInt(element.dataset.msBeforeInformingOfLongWait)
        : 5000,
      msBeforeAbort: element.dataset.msBeforeAbort
        ? parseInt(element.dataset.msBeforeAbort)
        : 30000,
      msBetweenRequests: element.dataset.msBetweenRequests
        ? parseInt(element.dataset.msBetweenRequests)
        : 2000,
      msBetweenDomUpdate: element.dataset.msBetweenDomUpdate
        ? parseInt(element.dataset.msBetweenDomUpdate)
        : 1000,
    };
  }

  createAbortController(): AbortController {
    const abortController = new AbortController();
    window.removeEventListener("beforeunload", this.handleAbort);
    window.addEventListener("beforeunload", this.handleAbort);
    return abortController;
  };

  handleAbort = () => {
    this.abortController.abort();
  };

  async init() {
    const initTime = this.getInitTime();

    this.updateStateAccordingToTimeElapsed(initTime);

    this.updateDom();
    this.initTimer(initTime);
    await this.callPollingFunction(initTime);
  }

  getInitTime() {
    const storedSpinnerInitTime = sessionStorage.getItem("spinnerInitTime");
    let spinnerInitTime: number;
    if (storedSpinnerInitTime === null) {
      spinnerInitTime = Date.now();
      sessionStorage.setItem("spinnerInitTime", spinnerInitTime.toString());
    } else {
      spinnerInitTime = parseInt(storedSpinnerInitTime, 10);
    }
    return spinnerInitTime;
  }

  initTimer = (initTime: number) => {
    this.updateDomTimer = setInterval(() => {
      this.updateStateAccordingToTimeElapsed(initTime);
      this.updateDom();
    }, this.config.msBetweenDomUpdate);
  };

  hasCompleted(): boolean {
    return this.state === SpinnerState.Error || this.state === SpinnerState.Complete;
  }

  reflectSuccess = () => {
    this.state = SpinnerState.Complete;
    sessionStorage.removeItem("spinnerInitTime");
  };

  reflectError = () => {
    this.state = SpinnerState.Error;
    sessionStorage.removeItem("spinnerInitTime");
    this.abortController.abort();
  };

  reflectLongWait() {
    if (!this.hasCompleted()) {
      this.state = SpinnerState.LongWaiting;
    }
  }

  updateStateAccordingToTimeElapsed = (initTime: number) => {
    const elapsedMilliseconds = Date.now() - initTime;
    if (this.hasCompleted()) {
      // If we've already finished waiting then there's no need to update again.
      return;
    }
    if (elapsedMilliseconds >= this.config.msBeforeAbort) {
      this.reflectError();
    } else if (elapsedMilliseconds >= this.config.msBeforeInformingOfLongWait) {
      this.reflectLongWait();
    }
  };

  createSpinnerElement(spinnerStateClass: string): HTMLDivElement {
    const spinner = document.createElement("div");
    spinner.id = "spinner";
    spinner.classList.add("spinner", "centre");
    if (spinnerStateClass) {
      spinner.classList.add(spinnerStateClass);
    }
    return spinner;
  }

  updateDom = () => {

    if (this.hasCompleted()) {
      // We've reached an end state so stop updating the DOM after this
      clearInterval(this.updateDomTimer);
    }

    if (this.displayState === this.state) {
      // No need to update anything
      return;
    }
    this.displayState = this.state;

    const newElementsToDisplay: HTMLElement[] = [];

    switch (this.displayState) {
      case SpinnerState.Waiting:
        newElementsToDisplay.push(this.createSpinnerElement(""));
        this.cloneAndAddIfExists(newElementsToDisplay, this.waitContent);
        break;
      case SpinnerState.LongWaiting:
        newElementsToDisplay.push(this.createSpinnerElement(""));
        this.cloneAndAddIfExists(newElementsToDisplay, this.longWaitContent);
        break;
      case SpinnerState.Complete:
        newElementsToDisplay.push(this.createSpinnerElement("spinner__finished"));
        this.cloneAndAddIfExists(newElementsToDisplay, this.successContent);
        break;
      case SpinnerState.Error:
        newElementsToDisplay.push(this.createSpinnerElement("spinner__finished"));
        this.cloneAndAddIfExists(newElementsToDisplay, this.errorContent);
        break;
    }

    this.visibleElementsContainer.replaceChildren(...newElementsToDisplay);

    if (this.displayState === SpinnerState.Complete && !!this.onSuccess) {
      this.onSuccess();
    }
    if (this.displayState === SpinnerState.Error && !!this.onError) {
      this.onError();
    }
  };

  cloneAndAddIfExists(list: HTMLElement[], element: HTMLElement | undefined) {
    if (element) {
      const cloned = element.cloneNode(true) as HTMLElement;
      cloned.style.display = "";
      cloned.removeAttribute("id");
      list.push(cloned);
    }
  }

  async callPollingFunction(initTime: number) {
    if (Date.now() - initTime >= this.config.msBeforeAbort) {
      return;
    }
    await this.pollingFunction(this.abortController.signal)
      .then((response) => {
        if (response === PollResult.Success) {
          this.reflectSuccess();
        } else if (response === PollResult.Failure) {
          this.reflectError();
        } else if (!this.hasCompleted()) {
          setTimeout(async () => {
            if (Date.now() - initTime >= this.config.msBeforeAbort) {
              return;
            }
            await this.callPollingFunction(initTime);
          }, this.config.msBetweenRequests);
        }
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Error in polling function: ", error);
          this.reflectError();
        }
      })
      .finally(() => {
        this.updateDom();
      });
  }
}
