import {
  apiRoute,
  content,
  error,
  initialState,
  node,
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
    spinnerState: content.initial.spinnerState as string,
    done: false,
    virtualDom: [],
    abortController: null,
  };

  const timers: timers = {};

  const updateAccordingToTimeElapsed = () => {
    const elapsedMilliseconds = Date.now - initTime;
    if (elapsedMilliseconds >= config.msBeforeAbort) {
      reflectError();
    } else if (elapsedMilliseconds >= config.msBeforeInformingOfLongWait) {
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
        text: content.continueButton.text,
        buttonDisabled: state.buttonDisabled,
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
        text: content.error.whatYouCanDo.heading,
        classes: ["govuk-heading-m"],
      },
      {
        nodeName: "p",
        innerHTML: `${content.error.whatYouCanDo.message.text1}<a href="${content.error.whatYouCanDo.message.link.href}">${this.content.error.whatYouCanDo.message.link.text}</a>${this.content.error.whatYouCanDo.message.text2}`,
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
      document.title = state.heading;
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
      updateAriaAlert(config.ariaButtonEnabledMessage);
    }
  };

  const reflectCompletion = () => {
    state.spinnerState = "spinner__ready";
    state.spinnerStateText = content.complete.spinnerState;
    state.buttonDisabled = false;
    state.ariaButtonEnabledMessage = content.complete.ariaButtonEnabledMessage;
    state.done = true;
    sessionStorage.removeItem("spinnerInitTime");
  };

  const reflectError = () => {
    state.heading = content.error.heading;
    state.messageText = content.error.messageText;
    state.spinnerState = "spinner__failed";
    state.done = true;
    state.error = true;
    sessionStorage.removeItem("spinnerInitTime");
    state.abortController.abort();
  };

  const reflectLongWait = () => {
    if (state.spinnerState !== "ready") {
      state.spinnerStateText = content.longWait.spinnerStateText;
    }
  };

  const convert = (node: node) => {
    const el = document.createElement(node.nodeName);
    if (node.text) (el.textContent as unknown as object) = node.text;
    if (node.innerHTML)
      (el.innerHTML as unknown as HTMLElement) = node.innerHTML;
    if (node.id) el.id = node.id;
    if (node.classes) el.classList.add(...node.classes);
    if (node.buttonDisabled) el.setAttribute("disabled", node.buttonDisabled);
    return el;
  };

  // to do: add a variable to initialise ariaLiveContainer
  const updateAriaAlert = (messageText: unknown) => {
    while (ariaLiveContainer.firstChild) {
      ariaLiveContainer.removeChild(ariaLiveContainer.firstChild);
    }

    /* Create new message and append it to the live region */
    const messageNode = document.createTextNode(messageText);
    ariaLiveContainer.appendChild(messageNode);
  };

  const notInErrorOrDoneState = () => {
    return !(state.done || state.error);
  };

  const requestIDProcessingStatus = async () => {
    const signal = abortController.signal;
    const apiRoute =
      document?.getElementById("spinner-container")?.dataset.apiRoute;
    try {
      const response = await fetch(apiRoute as apiRoute);

      if (response.status !== 200) {
        throw new Error(`Status code ${response.status} received`);
      }

      const data = await response.json();

      if (data.status === "Clear to proceed") {
        reflectCompletion();
      } else if (notInErrorOrDoneState()) {
        setTimeout(async () => {
          await requestIDProcessingStatus();
        }, 1000);
      }
    } catch (e) {
      console.log(e);
      reflectError();
    }
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
    },
  };
})();
// export class Spinner {
//   container;
//   spinnerContainer: HTMLDivElement | undefined;
//   ariaLiveContainer: HTMLDivElement | undefined;
//   content:
//     | {
//         complete: unknown;
//         error: unknown;
//         longWait: unknown;
//         initial: unknown;
//         continueButton: unknown;
//       }
//     | undefined;
//   domRequirementsMet: boolean | undefined;
//   state:
//     | {
//         done: unknown;
//         error: unknown;
//         spinnerState: string;
//         spinnerStateText: unknown;
//         buttonDisabled: unknown;
//         ariaButtonEnabledMessage: unknown;
//         heading: unknown;
//         messageText?: unknown;
//         virtualDom: unknown;
//       }
//     | undefined;
//   initTime: string | number | null | undefined;
//   updateDomTimer: string | number | NodeJS.Timeout | undefined;
//   abortController: AbortController | undefined;
//   config = {
//     apiUrl: "/api",
//     msBeforeInformingOfLongWait: 5000,
//     msBeforeAbort: 25000,
//     msBetweenRequests: 1000,
//     msBetweenDomUpdate: 2000,
//   };

//   notInErrorOrDoneState = () => {
//     return !(this.state?.done || this.state?.error);
//   };

//   reflectCompletion = () => {
//     this!.state!.spinnerState = "spinner__ready";
//     this!.state!.spinnerStateText = this.content.complete
//       .spinnerState as unknown as string;
//     this!.state!.buttonDisabled = false;
//     this!.state!.ariaButtonEnabledMessage =
//       this.content.complete.ariaButtonEnabledMessage;
//     this!.state!.done = true;
//     sessionStorage.removeItem("spinnerInitTime");
//   };

//   reflectError = () => {
//     this!.state!.heading = this.content.error.heading;
//     this!.state!.messageText = this.content.error.messageText;
//     this!.state!.spinnerState = "spinner__failed";
//     this!.state!.done = true;
//     this!.state!.error = true;
//     sessionStorage.removeItem("spinnerInitTime");
//     this!.abortController!.abort();
//   };

//   reflectLongWait() {
//     if (this!.state!.spinnerState !== "ready") {
//       this!.state!.spinnerStateText = this.content.longWait.spinnerStateText;
//     }
//   }

//   updateAccordingToTimeElapsed = () => {
//     const elapsedMilliseconds = Date.now() - this.initTime;
//     if (elapsedMilliseconds >= this.config.msBeforeAbort) {
//       this.reflectError();
//     } else if (elapsedMilliseconds >= this.config.msBeforeInformingOfLongWait) {
//       this.reflectLongWait();
//     }
//   };

//   initialiseState() {
//     if (this.domRequirementsMet) {
//       this.state = {
//         heading: this.content.initial.heading,
//         spinnerStateText: this.content.initial.spinnerStateText,
//         spinnerState: this.content.initial.spinnerState,
//         buttonDisabled: true,
//         ariaButtonEnabledMessage: "",
//         done: false,
//         error: false,
//         virtualDom: [],
//       };
//     }
//   }

//   initialiseContent(element: {
//     dataset: {
//       initialHeading: unknown;
//       initialSpinnerstatetext: unknown;
//       initialSpinnerstate: unknown;
//       errorHeading: unknown;
//       errorMessagetext: unknown;
//       errorWhatyoucandoHeading: unknown;
//       errorWhatyoucandoMessageText1: unknown;
//       errorWhatyoucandoMessageLinkHref: unknown;
//       errorWhatyoucandoMessageLinkText: unknown;
//       errorWhatyoucandoMessageText2: unknown;
//       completeSpinnerstate: unknown;
//       longwaitSpinnerstatetext: unknown;
//       continuebuttonText: unknown;
//       apiUrl: unknown;
//       ariaButtonEnabledMessage: unknown;
//       msBeforeInformingOfLongWait: string;
//       msBeforeAbort: string;
//       msBetweenRequests: string;
//       msBetweenDomUpdate: string;
//     };
//   }) {
//     function throwIfMissing(data: undefined) {
//       if (data === undefined) {
//         throw new Error("Missing required data");
//       }
//       return data;
//     }

//     try {
//       this.content = {
//         initial: {
//           heading: throwIfMissing(element.dataset.initialHeading),
//           spinnerStateText: throwIfMissing(
//             element.dataset.initialSpinnerstatetext,
//           ),
//           spinnerState: throwIfMissing(element.dataset.initialSpinnerstate),
//         },
//         error: {
//           heading: throwIfMissing(element.dataset.errorHeading),
//           messageText: throwIfMissing(element.dataset.errorMessagetext),
//           whatYouCanDo: {
//             heading: throwIfMissing(element.dataset.errorWhatyoucandoHeading),
//             message: {
//               text1: throwIfMissing(
//                 element.dataset.errorWhatyoucandoMessageText1,
//               ),
//               link: {
//                 href: throwIfMissing(
//                   element.dataset.errorWhatyoucandoMessageLinkHref,
//                 ),
//                 text: throwIfMissing(
//                   element.dataset.errorWhatyoucandoMessageLinkText,
//                 ),
//               },
//               text2: throwIfMissing(
//                 element.dataset.errorWhatyoucandoMessageText2,
//               ),
//             },
//           },
//         },
//         complete: {
//           spinnerState: throwIfMissing(element.dataset.completeSpinnerstate),
//         },
//         longWait: {
//           spinnerStateText: throwIfMissing(
//             element.dataset.longwaitSpinnerstatetext,
//           ),
//         },
//         continueButton: {
//           text: element.dataset.continuebuttonText ?? "Continue",
//         },
//       };

//       this.config = {
//         apiUrl: element.dataset.apiUrl || this.config.apiUrl,
//         ariaButtonEnabledMessage: throwIfMissing(
//           element.dataset.ariaButtonEnabledMessage,
//         ),
//         msBeforeInformingOfLongWait:
//           parseInt(element.dataset.msBeforeInformingOfLongWait) ||
//           this.config.msBeforeInformingOfLongWait,
//         msBeforeAbort:
//           parseInt(element.dataset.msBeforeAbort) || this.config.msBeforeAbort,
//         msBetweenRequests:
//           parseInt(element.dataset.msBetweenRequests) ||
//           this.config.msBetweenRequests,
//         msBetweenDomUpdate:
//           parseInt(element.dataset.msBetweenDomUpdate) ||
//           this.config.msBetweenDomUpdate,
//       };

//       this.domRequirementsMet = true;
//     } catch (e) {
//       this.domRequirementsMet = false;
//     }
//   }

//   createVirtualDom() {
//     const domInitialState = [
//       {
//         nodeName: "h1",
//         text: this.state.heading,
//         classes: ["govuk-heading-l"],
//       },
//       {
//         nodeName: "div",
//         id: "spinner",
//         classes: [
//           "spinner",
//           "spinner__pending",
//           "centre",
//           this.state.spinnerState,
//         ],
//       },
//       {
//         nodeName: "p",
//         text: this.state.spinnerStateText,
//         classes: ["centre", "spinner-state-text", "govuk-body"],
//       },
//       {
//         nodeName: "button",
//         text: this.content.continueButton.text,
//         buttonDisabled: this.state.buttonDisabled,
//         classes: ["govuk-button", "govuk-!-margin-top-4"],
//       },
//     ];

//     const domErrorState = [
//       {
//         nodeName: "h1",
//         text: this.state.heading,
//         classes: ["govuk-heading-l"],
//       },
//       {
//         nodeName: "p",
//         text: this.state.messageText,
//         classes: ["govuk-body"],
//       },
//       {
//         nodeName: "h2",
//         text: this.content.error.whatYouCanDo.heading,
//         classes: ["govuk-heading-m"],
//       },
//       {
//         nodeName: "p",
//         innerHTML: `${this.content.error.whatYouCanDo.message.text1}<a href="${this.content.error.whatYouCanDo.message.link.href}">${this.content.error.whatYouCanDo.message.link.text}</a>${this.content.error.whatYouCanDo.message.text2}`,
//         classes: ["govuk-body"],
//       },
//     ];

//     return this.state.error ? domErrorState : domInitialState;
//   }

//   vDomHasChanged = (currentVDom, nextVDom) => {
//     return JSON.stringify(currentVDom) !== JSON.stringify(nextVDom);
//   };

//   convert = (node) => {
//     const el = document.createElement(node.nodeName);
//     if (node.text) el.textContent = node.text;
//     if (node.innerHTML) el.innerHTML = node.innerHTML;
//     if (node.id) el.id = node.id;
//     if (node.classes) el.classList.add(...node.classes);
//     if (node.buttonDisabled) el.setAttribute("disabled", node.buttonDisabled);
//     return el;
//   };

//   updateAriaAlert = (messageText) => {
//     while (this.ariaLiveContainer.firstChild) {
//       this.ariaLiveContainer.removeChild(this.ariaLiveContainer.firstChild);
//     }

//     /* Create new message and append it to the live region */
//     const messageNode = document.createTextNode(messageText);
//     this.ariaLiveContainer.appendChild(messageNode);
//   };

//   updateDom = () => {
//     const vDomChanged = this.vDomHasChanged(
//       this.state.virtualDom,
//       this.createVirtualDom(),
//     );
//     if (vDomChanged) {
//       document.title = this.state.heading;
//       this.state.virtualDom = this.createVirtualDom();
//       const elements = this.state.virtualDom.map(this.convert);
//       this.spinnerContainer.replaceChildren(...elements);
//     }

//     if (this.state.error) {
//       this.spinnerContainer.classList.add("spinner-container__error");
//     }

//     if (this.state.done) {
//       clearInterval(this.updateDomTimer);
//     }

//     if (this.state.ariaButtonEnabledMessage !== "") {
//       this.updateAriaAlert(this.config.ariaButtonEnabledMessage);
//     }
//   };

//   async requestIDProcessingStatus() {
//     const signal = this.abortController.signal;
//     await fetch(this.config.apiUrl, { signal })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.status === "COMPLETED" || data.status === "INTERVENTION") {
//           this.reflectCompletion();
//         } else if (data.status === "ERROR") {
//           this.reflectError();
//         } else if (this.notInErrorOrDoneState()) {
//           setTimeout(async () => {
//             if (Date.now() - this.initTime >= this.config.msBeforeAbort) {
//               return;
//             }
//             await this.requestIDProcessingStatus();
//           }, this.config.msBetweenRequests);
//         }
//       })
//       .catch((error) => {
//         if (error.name !== "AbortError") {
//           console.error("Error in requestIDProcessingStatus:", e);
//           this.reflectError();
//         }
//       })
//       .finally(() => {
//         this.updateDom();
//       });
//   }

//   // For the Aria alert to work reliably we need to create its container once and then update the contents
//   // https://tetralogical.com/blog/2024/05/01/why-are-my-live-regions-not-working/
//   // So here we create a separate DOM element for the Aria live text that won't be touched when the spinner updates.
//   initialiseContainers = () => {
//     this.spinnerContainer = document.createElement("div");
//     this.ariaLiveContainer = document.createElement("div");
//     this.ariaLiveContainer.setAttribute("aria-live", "assertive");
//     this.ariaLiveContainer.classList.add("govuk-visually-hidden");
//     this.ariaLiveContainer.appendChild(document.createTextNode(""));
//     this.container.replaceChildren(
//       this.spinnerContainer,
//       this.ariaLiveContainer,
//     );
//   };

//   initTimer = () => {
//     let spinnerInitTime = sessionStorage.getItem("spinnerInitTime");
//     if (spinnerInitTime === null) {
//       spinnerInitTime = Date.now();
//       sessionStorage.setItem("spinnerInitTime", spinnerInitTime.toString());
//     } else {
//       spinnerInitTime = parseInt(spinnerInitTime, 10);
//     }
//     this.initTime = spinnerInitTime;
//     this.updateAccordingToTimeElapsed();

//     this.updateDomTimer = setInterval(() => {
//       this.updateAccordingToTimeElapsed();
//       this.updateDom();
//     }, this.config.msBetweenDomUpdate);
//   };

//   handleAbort = () => {
//     this.abortController.abort();
//   };

//   initialiseAbortController = () => {
//     this.abortController = new AbortController();
//     window.removeEventListener("beforeunload", this.handleAbort);
//     window.addEventListener("beforeunload", this.handleAbort);
//   };

//   init() {
//     if (this.domRequirementsMet) {
//       this.initTimer();
//       this.initialiseContainers();
//       this.updateDom();
//       this.requestIDProcessingStatus();
//     }
//   }

//   constructor(domContainer: unknown) {
//     this.container = domContainer;
//     this.initialiseContent(this.container);
//     this.initialiseState();
//     this.initialiseAbortController();
//   }
// }
