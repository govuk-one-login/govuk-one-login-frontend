(function () {
  'use strict';

  const WaitInteractions = (() => {
    const content = {
      initial: {
        spinnerState: "pending",
      },
      complete: { spinnerState: "completed" },
    };

    const state = {
      spinnerState: content.initial.spinnerState,
      done: false,
      virtualDom: [],
    };

    const timers = {};

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

    const vDomHasChanged = (currentVDom, nextVDom) => {
      return JSON.stringify(currentVDom) !== JSON.stringify(nextVDom);
    };

    const updateDom = () => {
      const vDomChanged = vDomHasChanged(state.virtualDom, createVirtualDom());
      const container = document.getElementById("spinner-container");

      if (vDomChanged) {
        // document.title = state.heading;
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
      state.done = true;
    };

    const reflectError = () => {
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

  /* eslint-disable no-undef */

  WaitInteractions.init();

  window.DI = window.DI || {};
  window.DI.analyticsUa = window.DI.analyticsUa || {};

  (function (analytics) {

    function initGtm() {
      const sendData = window.DI.analyticsGa4.pageViewTracker.pushToDataLayer;

      sendData({
        "gtm.allowlist": ["google"],
        "gtm.blocklist": ["adm", "awct", "sp", "gclidw", "gcs", "opt"],
      });

      sendData({
        event: "progEvent",
        ProgrammeName: "DI - FEC",
      });

      if (window.DI.journeyState) {
        sendData({
          event: "journeyEvent",
          JourneyStatus: window.DI.journeyState,
        });
      }

      const languageCode = document.querySelector("html")?.getAttribute("lang");
      const languageNames = {
        en: "english",
        cy: "welsh",
      };

      sendData({
        event: "langEvent",
        language: languageNames[languageCode],
        languagecode: languageCode,
      });

      sendData({
        "gtm.start": new Date().getTime(),
        event: "gtm.js",
      });
    }

    const init = function () {
      const consentGiven = window.DI.analyticsGa4.cookie.hasConsentForAnalytics();
      console.log("consentGiven", consentGiven);
      if (consentGiven) {
        console.log("load UA script");
        window.DI.analyticsGa4.loadGtmScript(
          window.DI.analyticsGa4.uaContainerId,
        );
        initGtm();
      } else {
        window.addEventListener("cookie-consent", window.DI.analyticsUa.init);
      }
    };

    analytics.init = init;
  })(window.DI.analyticsUa);

})();
