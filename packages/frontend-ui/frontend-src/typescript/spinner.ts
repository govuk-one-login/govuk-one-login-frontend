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
  };

  const timers: timers = {};

  const createVirtualDom = () => {
    const initialState: initialState = [
      {
        nodeName: "div",
        id: "spinner",
        classes: ["spinner", "spinner__pending", "centre", state.spinnerState],
      },
    ];

    return initialState;
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
  };

  const reflectCompletion = () => {
    state.spinnerState = "spinner__ready";
    state.spinnerStateText = content.complete.spinnerState;
    state.done = true;
  };

  const reflectError = () => {
    state.spinnerState = "spinner__failed";
    state.done = true;
    state.error = true;
  };

  const convert = (node: node) => {
    const el = document.createElement(node.nodeName);
    if (node.text) (el.textContent as unknown as object) = node.text;
    if (node.innerHTML)
      (el.innerHTML as unknown as HTMLElement) = node.innerHTML;
    if (node.id) el.id = node.id;
    if (node.classes) el.classList.add(...node.classes);
    return el;
  };

  const notInErrorOrDoneState = () => {
    return !(state.done || state.error);
  };

  const requestIDProcessingStatus = async () => {
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
