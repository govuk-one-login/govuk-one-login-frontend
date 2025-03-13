const WaitInteractions = (() => {
  const content = {
    initial: {
      heading: "Returning you to [service]",
      spinnerStateText: "Wait to be returned to the service",
      spinnerState: "pending",
    },
    error: {
      heading: "Sorry, there is a problem",
      messageText: "We cannot return you to the service at the moment.",
      whatYouCanDo: {
        heading: "What you can do",
        message: {
          text1:
            "Go back to the service you were trying to use. You can look for the service using your search engine or find it from the ",
          link: {
            href: "https://www.gov.uk",
            text: "GOV.UK homepage",
          },
          text2: ".",
        },
      },
    },
    complete: {
      spinnerState: "You can now continue to the service",
    },
    longWait: {
      spinnerStateText: "We're still trying to return you to the service",
    },
  };

  const state = {
    heading: content.initial.heading,
    spinnerStateText: content.initial.spinnerStateText,
    spinnerState: content.initial.spinnerState,
    buttonDisabled: true,
    done: false,
    virtualDom: [],
  };

  const timers = {};

  const createVirtualDom = () => {
    const initialState = [
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
        classes: ["centre", "spinner-state-text"],
      },
      {
        nodeName: "button",
        text: "Continue",
        buttonDisabled: state.buttonDisabled,
        classes: ["govuk-button", "govuk-!-margin-top-4"],
      },
    ];

    const errorState = [
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
        innerHTML: `${content.error.whatYouCanDo.message.text1}<a href="${content.error.whatYouCanDo.message.link.href}">${content.error.whatYouCanDo.message.link.text}</a>${content.error.whatYouCanDo.message.text2}`,
        classes: ["govuk-body"],
      },
    ];

    return state.error ? errorState : initialState;
  };

  const vDomHasChanged = (currentVDom, nextVDom) => {
    return JSON.stringify(currentVDom) !== JSON.stringify(nextVDom);
  };

  const updateDom = () => {
    const vDomChanged = vDomHasChanged(state.virtualDom, createVirtualDom());
    const container = document.getElementById("spinner-container");

    if (vDomChanged) {
      document.title = state.heading;
      state.virtualDom = createVirtualDom();
      const elements = state.virtualDom.map(convert);
      container.replaceChildren(...elements);
    }

    if (state.error) {
      container.classList.add("spinner-container__error");
    }

    if (state.done) {
      clearInterval(timers.updateDomTimer);
    }
  };

  const reflectCompletion = () => {
    state.spinnerState = "spinner__ready";
    state.spinnerStateText = content.complete.spinnerState;
    state.buttonDisabled = false;
    state.done = true;
  };

  const reflectError = () => {
    state.heading = content.error.heading;
    state.messageText = content.error.messageText;
    state.spinnerState = "spinner__failed";
    state.done = true;
    state.error = true;
  };

  const convert = (node) => {
    const el = document.createElement(node.nodeName);
    if (node.text) el.textContent = node.text;
    if (node.innerHTML) el.innerHTML = node.innerHTML;
    if (node.id) el.id = node.id;
    if (node.classes) el.classList.add(...node.classes);
    if (node.buttonDisabled) el.setAttribute("disabled", node.buttonDisabled);
    return el;
  };

  const notInErrorOrDoneState = () => {
    return !(state.done || state.error);
  };

  const requestIDProcessingStatus = async () => {
    const apiRoute =
      document.getElementById("spinner-container").dataset.apiRoute;

    try {
      const response = await fetch(apiRoute);

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
      timers.informUserWhereWaitIsLong = setTimeout(() => {
        if (state.spinnerState !== "ready") {
          state.spinnerStateText = content.longWait.spinnerStateText;
        }
      }, 5000);

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

WaitInteractions.init();
