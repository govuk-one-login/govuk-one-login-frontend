import { apiRoute, container, node, state, timers } from "./types";

export const WaitInteractions = (() => {
  const content = {
    initial: {
      spinnerState: "pending",
    },
    complete: { spinnerState: "completed" },
  };

  const state: state = {
    spinnerState: content.initial.spinnerState,
    done: false,
    virtualDom: [],
  };

  const timers: timers = {};

  const createVirtualDom = () => {
    const initialState = [
      {
        nodeName: "div",
        id: "spinner",
        classes: ["spinner", "spinner__pending", "centre", state.spinnerState],
      },
    ];

    return initialState;
  };

  const vDomHasChanged = (
    currentVDom: never[],
    nextVDom: { nodeName: string; id: string; classes: string[] }[],
  ) => {
    return JSON.stringify(currentVDom) !== JSON.stringify(nextVDom);
  };

  const updateDom = () => {
    const vDomChanged = vDomHasChanged(
      state.virtualDom as [],
      createVirtualDom() as [],
    );
    const container: container = document.getElementById("spinner-container");

    if (vDomChanged) {
      state.virtualDom = createVirtualDom();
      const elements = state?.virtualDom?.map(convert as never);
      container?.replaceChildren(...(elements as unknown as []));
    }

    if (state.error) {
      container?.classList.add("spinner-container__error");
    }

    if (state.done) {
      clearInterval(timers.updateDomTimer as unknown as undefined);
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
    const el = document.createElement(
      node.nodeName as keyof HTMLElementTagNameMap,
    );
    if (node.text) el.textContent = node.text;
    if (node.innerHTML) el.innerHTML = node.innerHTML;
    if (node.id) el.id = node.id;
    if (node.classes) el.classList.add(...node.classes);
    return el;
  };

  const notInErrorOrDoneState = () => {
    return !(state.done || state.error);
  };

  const requestIDProcessingStatus = async () => {
    const apiRoute: apiRoute =
      document?.getElementById("spinner-container")?.dataset.apiRoute;
    try {
      const response = await fetch(apiRoute as unknown as URL);

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
