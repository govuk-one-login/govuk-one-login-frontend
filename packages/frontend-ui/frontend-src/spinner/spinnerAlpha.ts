/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import {
  apiRoute,
  content,
  error,
  initialState,
  node,
  spinnerInitial,
  state,
  timers,
} from "../utils/types";

export const WaitInteractions = (() => {
  const content: content = {
    initial: {
      spinnerState: "pending",
    },
    complete: { spinnerState: "completed" },
  };

  const state: state = {
    spinnerState: content?.initial?.spinnerState as string,
    done: false,
    virtualDom: [],
    abortController: null,
  };

  const timers: timers = {};

  let {
    container,
    ariaLiveContainer,
    domRequirementsMet,
    initTime,
    updateDomTimer,
    abortController,
    config,
  }: spinnerInitial = {
    apiUrl: "/api",
    msBeforeInformingOfLongWait: 5000,
    msBeforeAbort: 25000,
    msBetweenRequests: 1000,
    msBetweenDomUpdate: 2000,
  };
  const handleAbort = () => {
    abortController?.abort();
  };

  const initialiseAbortController = () => {
    abortController = new AbortController();
    window.removeEventListener("beforeunload", handleAbort);
    window.addEventListener("beforeunload", handleAbort);
  };

  const updateAccordingToTimeElapsed = () => {
    const now = Date.now();
    const elapsedMilliseconds = now - initTime!;
    if (elapsedMilliseconds >= config!.msBeforeAbort) {
      reflectError();
    } else if (
      (elapsedMilliseconds >=
        config!.msBeforeInformingOfLongWait) as unknown as number
    ) {
      reflectLongWait();
    }
  };

  const createVirtualDom = () => {
    const initialState: initialState = [
      {
        nodeName: "h1",
        text: state.heading,
        classes: ["govuk-heading-l"],
      },
      {
        nodeName: "div",
        id: "spinner",
        classes: ["spinner", "spinner__pending", "centre", state.spinnerState],
      },
      {
        nodeName: "p",
        text: state.spinnerStateText,
        classes: ["centre", "spinner-state-text", "govuk-body"],
      },
      {
        nodeName: "button",
        text: content?.continueButton?.text,
        buttonDisabled: state.buttonDisabled as unknown as state,
        classes: ["govuk-button", "govuk-!-margin-top-4"],
      },
    ];

    const domErrorState = [
      {
        nodeName: "h1",
        text: state.heading,
        classes: ["govuk-heading-l"],
      },
      {
        nodeName: "p",
        text: state.messageText,
        classes: ["govuk-body"],
      },
      {
        nodeName: "h2",
        text: content?.error?.whatYouCanDo.heading,
        classes: ["govuk-heading-m"],
      },
      {
        nodeName: "p",
        innerHTML: `${content?.error?.whatYouCanDo.message.text1}<a href="${content?.error?.whatYouCanDo.message.link.href}">${content?.error?.whatYouCanDo.message.link.text}</a>${content?.error?.whatYouCanDo.message.text2}`,
        classes: ["govuk-body"],
      },
    ];

    return state.error ? domErrorState : initialState;
  };

  const vDomHasChanged = (currentVDom: undefined, nextVDom: undefined) => {
    return JSON.stringify(currentVDom) !== JSON.stringify(nextVDom);
  };

  const updateDom = () => {
    const vDomChanged = vDomHasChanged(
      state.virtualDom as undefined,
      createVirtualDom() as unknown as undefined,
    );
    const container = document.getElementById("spinner-container");

    if (vDomChanged) {
      document.title = state.heading as string;
      state.virtualDom = createVirtualDom();
      const elements = state?.virtualDom?.map(
        convert as (value: unknown, index: number, array: unknown[]) => unknown,
      );
      container?.replaceChildren(...(elements as unknown as string));
    }

    if (state.error as error) {
      container?.classList.add("spinner-container__error");
    }

    if (state.done) {
      clearInterval(timers.updateDomTimer as number);
    }

    if (state.ariaButtonEnabledMessage !== "") {
      updateAriaAlert(config?.ariaButtonEnabledMessage);
    }
  };

  const reflectCompletion = () => {
    state.spinnerState = "spinner__ready";
    state.spinnerStateText = content?.complete?.spinnerState;
    state.buttonDisabled = false;
    state.ariaButtonEnabledMessage =
      content?.complete?.ariaButtonEnabledMessage;
    state.done = true;
    sessionStorage.removeItem("spinnerInitTime");
  };

  const reflectError = () => {
    state.heading = content?.error?.heading;
    state.messageText = content?.error?.messageText;
    state.spinnerState = "spinner__failed";
    state.done = true;
    state.error = true;
    sessionStorage.removeItem("spinnerInitTime");
    state?.abortController?.abort();
  };

  const reflectLongWait = () => {
    if (state.spinnerState !== "ready") {
      state.spinnerStateText = content?.longWait?.spinnerStateText;
    }
  };

  const convert = (node: node) => {
    const el = document.createElement(node.nodeName);
    if (node.text) (el.textContent as unknown as object) = node.text;
    if (node.innerHTML)
      (el.innerHTML as unknown as HTMLElement) = node.innerHTML;
    if (node.id) el.id = node.id;
    if (node.classes) el.classList.add(...node.classes);
    if (node.buttonDisabled)
      el.setAttribute("disabled", node.buttonDisabled as string);
    return el;
  };

  const updateAriaAlert = (messageText: unknown) => {
    while (ariaLiveContainer?.firstChild) {
      ariaLiveContainer.removeChild(ariaLiveContainer.firstChild);
    }

    /* Create new message and append it to the live region */
    const messageNode = document.createTextNode(messageText as string);
    ariaLiveContainer?.appendChild(messageNode);
  };

  const notInErrorOrDoneState = () => {
    return !(state.done || state.error);
  };

  const requestIDProcessingStatus = async () => {
    const signal = abortController.signal;
    const apiRoute =
      document?.getElementById("spinner-container")?.dataset.apiRoute;
    try {
      const response = await fetch(apiRoute as apiRoute, { signal });

      if (response.status !== 200) {
        throw new Error(`Status code ${response.status} received`);
      }

      const data = await response.json();

      if (
        data.status === ("COMPLETED" as string) ||
        data.status === ("INTERVENTION" as string)
      ) {
        reflectCompletion();
      } else if (data.status === ("ERROR" as string)) {
        reflectError();
      } else if (notInErrorOrDoneState()) {
        setTimeout(async () => {
          if (Date.now() - initTime! >= config!.msBeforeAbort) {
            return;
          }
          await requestIDProcessingStatus();
        }, config!.msBetweenRequests!);
      }

      if (data.status === "Clear to proceed") {
        reflectCompletion();
      } else if (notInErrorOrDoneState()) {
        setTimeout(async () => {
          await requestIDProcessingStatus();
        }, 1000);
      }
    } catch (e: any) {
      console.log(e);
      reflectError();
      if (e.name !== ("AbortError" as unknown as error)) {
        console.error("Error in requestIdProcessingStatus:", e);
        reflectError();
      }
    }
  };
  const initTimer = () => {
    let spinnerInitTime: string | null | number =
      sessionStorage.getItem("spinnerInitTime");
    if (spinnerInitTime === null) {
      spinnerInitTime = Date.now();
      sessionStorage.setItem("spinnerInitTime", spinnerInitTime.toString());
    } else {
      spinnerInitTime = parseInt(spinnerInitTime, 10);
    }
    initTime = spinnerInitTime;
    updateAccordingToTimeElapsed();

    updateDomTimer = setInterval(() => {
      updateAccordingToTimeElapsed();
      updateDom();
    }, config?.msBetweenDomUpdate);
  };

  const initialiseContainers = () => {
    const spinnerContainer = document.createElement("div");
    const ariaLiveContainer = document.createElement("div");
    ariaLiveContainer.setAttribute("aria-live", "assertive");
    ariaLiveContainer.classList.add("govuk-visually-hidden");
    ariaLiveContainer.appendChild(document.createTextNode(""));
    container?.replaceChildren(spinnerContainer, ariaLiveContainer);
  };

  return {
    state: state,
    init: () => {
      timers.updateDomTimer = setInterval(updateDom, 2000);

      timers.abortUnresponsiveRequest = setTimeout(() => {
        reflectError();
      }, 15000);

      updateDom();

      requestIDProcessingStatus().then(() => {
        updateDom();
      });

      if (domRequirementsMet) {
        initTimer();
        initialiseContainers();
        initialiseAbortController();
        updateDom();
        requestIDProcessingStatus();
      }
    },
  };
})();