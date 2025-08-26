import { Spinner } from "../spinner";

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitUntil(
  conditionFn: Function,
  { timeout = 1000, interval = 50 } = {},
) {
  const startTime = Date.now();
  while (true) {
    if (conditionFn()) {
      return; // Condition is true, exit
    }

    if (Date.now() - startTime > timeout) {
      throw new Error(`waitUntil timed out after ${timeout}ms`);
    }

    await wait(interval); // Wait before checking again
  }
}

function getValidSpinnerDivHtml(
  params: {
    msBeforeAbort?: number;
    msBeforeInformingOfLongWait?: number;
    msBetweenDomUpdate?: number;
    msBetweenRequests?: number;
  } = {},
) {
  return `
        <div id="spinner-container"
         data-initial-heading="Initial heading text"
         data-initial-spinnerStateText="Initial spinner state text"
         data-initial-spinnerState="pending"
         data-error-heading="Error heading"
         data-error-messageText="Error message text"
         data-error-whatYouCanDo-heading="Error what you can do heading"
         data-error-whatYouCanDo-message-text1="Error what you can do message text1"
         data-error-whatYouCanDo-message-link-href="Error what you can do message link href"
         data-error-whatYouCanDo-message-link-text="Error what you can do message link text"
         data-error-whatYouCanDo-message-text2="Error what you can do message link text2"
         data-complete-spinnerState="Spinner state complete"
         data-aria-button-enabled-message="Button enabled"
         data-longWait-spinnerStateText="Long wait spinner text"
         data-ms-before-informing-of-long-wait="${params.msBeforeInformingOfLongWait || 6000}"
         data-ms-before-abort="${params.msBeforeAbort || 30000}"
         data-ms-between-dom-update="${params.msBetweenDomUpdate || 2000}"
         data-ms-between-requests="${params.msBetweenRequests || 5000}">
        <form action="/ipv-callback" method="post" novalidate="novalidate">
            <input type="hidden" name="_csrf" value="csrfToken" />
            <div class="govuk-form-group">
                <h1 class="govuk-label-wrapper">
                    <label class="govuk-label govuk-label--l" for="more-detail">
                        Label text
                    </label>
                </h1>
                <p class="govuk-body">Paragraph</p>
                <button type="submit" class="govuk-button">
                    Button text
                </button>
            </div>
        </form>
    </div>`;
}

const validSpinnerHtml = getValidSpinnerDivHtml();

let container: HTMLElement;
let spinner: Spinner;

beforeEach(() => {
  document.body.innerHTML = validSpinnerHtml;
  container = document.getElementById("spinner-container")!;
  spinner = new Spinner(container);
});

describe("the spinner component", () => {
  describe("config property", () => {
    test("should exist with default values", () => {
      expect(spinner).toHaveProperty("config");
    });
    test("should be configurable through the dataset", () => {
      expect(spinner.config.msBeforeAbort).toEqual(30000);
      expect(spinner.config.msBeforeInformingOfLongWait).toEqual(6000);
      expect(spinner.config.ariaButtonEnabledMessage).toEqual("Button enabled");
    });
  });

  describe("requestIDProcessingStatus method", () => {
    test("should exist", () => {
      expect(spinner).toHaveProperty("requestIDProcessingStatus");
    });
  });

  describe("reflectLongWait method", () => {
    test("should exist", () => {
      expect(spinner).toHaveProperty("reflectLongWait");
    });

    test("should set the spinner.state.done to true", () => {
      expect(spinner.state.spinnerStateText).toEqual(
        "Initial spinner state text",
      );
      spinner.reflectLongWait();
      expect(spinner.state.spinnerStateText).toEqual("Long wait spinner text");
    });
  });

  describe("reflectCompletion method", () => {
    test("should exist", () => {
      expect(spinner).toHaveProperty("reflectCompletion");
    });

    test("should set the spinner.state.done to true", () => {
      expect(spinner.state.done).toEqual(false);
      spinner.reflectCompletion();
      expect(spinner.state.done).toEqual(true);
    });
  });

  describe("reflectError method", () => {
    test("should exist", () => {
      expect(spinner).toHaveProperty("reflectError");
    });

    test("should set the both spinner.state.done and spinner.state.errir to true", () => {
      expect(spinner.state.done).toEqual(false);
      expect(spinner.state.error).toEqual(false);
      spinner.reflectError();
      expect(spinner.state.done).toEqual(true);
      expect(spinner.state.error).toEqual(true);
    });
  });

  describe("updateDom method", () => {
    test("should exist", () => {
      expect(spinner).toHaveProperty("updateDom");
    });
  });

  describe("notInErrorOrDoneState method", () => {
    test("should exist", () => {
      expect(spinner).toHaveProperty("notInErrorOrDoneState");
    });

    test("should return false if only state.done is true", () => {
      spinner.state.done = true;
      spinner.state.error = false;
      expect(spinner.notInErrorOrDoneState()).toBeFalsy();
    });

    test("should return false if only state.error is true", () => {
      spinner.state.done = false;
      spinner.state.error = true;
      expect(spinner.notInErrorOrDoneState()).toBeFalsy();
    });

    test("should return false if state.error and state.done are true", () => {
      spinner.state.done = true;
      spinner.state.error = true;
      expect(spinner.notInErrorOrDoneState()).toBeFalsy();
    });

    test("should return true if neither state.error or state.done are true", () => {
      spinner.state.done = false;
      spinner.state.error = false;
      expect(spinner.notInErrorOrDoneState()).toBeTruthy();
    });
  });

  describe("convert method", () => {
    test("should exist", () => {
      expect(spinner).toHaveProperty("convert");
    });

    test("should return a DOM element that represents the input", () => {
      const elementRepresentationsToTest = [
        {
          nodeName: "h1",
          text: "This is heading text",
          classes: ["govuk-*"],
        },
        {
          nodeName: "p",
          innerHTML: `<p>a <a href="#">HTML</a> string</p>`,
          classes: ["govuk-*"],
        },
        {
          nodeName: "div",
          id: "spinner",
          classes: ["govuk-*"],
        },
        {
          nodeName: "button",
          text: "Continue",
          buttonDisabled: true,
          classes: ["govuk-*"],
        },
      ];

      elementRepresentationsToTest.forEach((i) => {
        let output = spinner.convert(i);
        expect(output.nodeName).toEqual(i.nodeName.toUpperCase());
        expect(output.className).toEqual(i.classes[0]);
      });
    });
  });

  describe("vDomHasChanged method", () => {
    test("should exist", () => {
      expect(spinner).toHaveProperty("vDomHasChanged");
    });

    test("should return false when passed objects that have the same JSON string representation", () => {
      expect(
        spinner.vDomHasChanged(
          [{ classes: [], nodeName: "foo" }],
          [{ classes: [], nodeName: "foo" }],
        ),
      );
    });

    test("should return true when passed objects that have different JSON string representations", () => {
      expect(
        spinner.vDomHasChanged(
          [{ classes: [], nodeName: "foo" }],
          [{ classes: [], nodeName: "bar" }],
        ),
      );
    });
  });

  describe("createVirtualDom method", () => {
    test("should exist", () => {
      expect(spinner).toHaveProperty("createVirtualDom");
    });

    test("should return the DOM initial state when spinner.state.error is false", () => {
      spinner.state.error = false;

      const domInitialState = [
        {
          nodeName: "h1",
          text: spinner.state.heading,
          classes: ["govuk-heading-l"],
        },
        {
          nodeName: "div",
          id: "spinner",
          classes: [
            "spinner",
            "spinner__pending",
            "centre",
            spinner.state.spinnerState,
          ],
        },
        {
          nodeName: "p",
          text: spinner.state.spinnerStateText,
          classes: ["centre", "spinner-state-text", "govuk-body"],
        },
        {
          nodeName: "button",
          text: "Continue",
          buttonDisabled: spinner.state.buttonDisabled,
          classes: ["govuk-button", "govuk-!-margin-top-4"],
        },
      ];

      expect(spinner.createVirtualDom()).toEqual(domInitialState);
    });

    test("should return to DOM error state when spinner.state.error is true", () => {
      spinner.state.error = true;

      const domErrorState = [
        {
          nodeName: "h1",
          text: spinner.state.heading,
          classes: ["govuk-heading-l"],
        },
        {
          nodeName: "p",
          text: spinner.state.messageText,
          classes: ["govuk-body"],
        },
        {
          nodeName: "h2",
          text: spinner.content.error.whatYouCanDo.heading,
          classes: ["govuk-heading-m"],
        },
        {
          nodeName: "p",
          innerHTML: `${spinner.content.error.whatYouCanDo.message.text1}<a href="${spinner.content.error.whatYouCanDo.message.link.href}">${spinner.content.error.whatYouCanDo.message.link.text}</a>${spinner.content.error.whatYouCanDo.message.text2}`,
          classes: ["govuk-body"],
        },
      ];
      expect(spinner.createVirtualDom()).toEqual(domErrorState);
    });
  });

  describe("when instantiated with a correctly formed HTMLDivElement", () => {
    test("should have a container property of the same type", () => {
      expect(spinner.container instanceof HTMLDivElement).toBeTruthy();
    });

    describe("the content property", () => {
      test("should exist", () => {
        expect(spinner).toHaveProperty("content");
      });
      test("should include all properties from data attributes", () => {
        const expectedContent = {
          complete: { spinnerState: "Spinner state complete" },
          error: {
            heading: "Error heading",
            messageText: "Error message text",
            whatYouCanDo: {
              heading: "Error what you can do heading",
              message: {
                link: {
                  href: "Error what you can do message link href",
                  text: "Error what you can do message link text",
                },
                text1: "Error what you can do message text1",
                text2: "Error what you can do message link text2",
              },
            },
          },
          initial: {
            heading: "Initial heading text",
            spinnerState: "pending",
            spinnerStateText: "Initial spinner state text",
          },
          longWait: { spinnerStateText: "Long wait spinner text" },
          continueButton: {
            text: "Continue",
          },
        };

        expect(spinner.content).toEqual(expectedContent);
      });
    });

    describe("the state property", () => {
      test("should exist", () => {
        expect(spinner).toHaveProperty("state");
      });

      describe("should be initialised with", () => {
        test("a heading property that matches the initial data attribute", () => {
          expect(spinner.state.heading).toEqual("Initial heading text");
        });
        test("a spinnerStateText that matches the initial data attribute", () => {
          expect(spinner.state.spinnerStateText).toEqual(
            "Initial spinner state text",
          );
        });
        test("a spinnerState that matches the initial data attribute", () => {
          expect(spinner.state.spinnerState).toEqual("pending");
        });
        test("a buttonDisabled property that is true", () => {
          expect(spinner.state.buttonDisabled).toBe(true);
        });
        test("a done property that is false", () => {
          expect(spinner.state.done).toBe(false);
        });
        test("an error property that is false", () => {
          expect(spinner.state.done).toBe(false);
        });
        test("a virtualDom property", () => {
          expect(spinner.state).toHaveProperty("virtualDom");
          expect(spinner.state.virtualDom).toEqual([]);
        });
      });
    });

    test("should have domRequirementsMet set as true", () => {
      expect(spinner.domRequirementsMet).toBe(true);
    });

    test("should have a createVirtualDom property", () => {
      expect(spinner).toHaveProperty("createVirtualDom");
    });

    describe("should set up the spinner HTML correctly", () => {
      beforeEach(() => {
        global.fetch = jest.fn(() =>
          Promise.resolve({
            json: () => Promise.resolve({ status: "PROCESSING" }),
          }),
        ) as jest.Mock;
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      test("with initial values", () => {
        spinner.init();
        expect(container.innerHTML).toMatchSnapshot();
      });
    });
  });

  describe("when instantiated with a badly formed HTMLDivElement", () => {
    beforeEach(() => {
      // This HTML is missing several data attributes the spinner relies upon
      document.body.innerHTML = `
        <div id="bad-spinner-container"
          data-initial-heading="Initial heading text"
          data-initial-spinnerStateText="Initial spinner state text"
          data-initial-spinnerState="pending"
          data-error-heading="Error heading"
          data-error-messageText="Error message text"
        >
          <form action="/ipv-callback" method="post" novalidate="novalidate">
              <input type="hidden" name="_csrf" value="csrfToken" />
              <div class="govuk-form-group">
                  <h1 class="govuk-label-wrapper">
                      <label class="govuk-label govuk-label--l" for="more-detail">
                          Label text
                      </label>
                  </h1>
                  <p class="govuk-body">Paragraph</p>
                  <button type="submit" class="govuk-button">
                      Button text
                  </button>
              </div>
          </form>
      </div>`;

      container = document.getElementById("bad-spinner-container")!;
      spinner = new Spinner(container);
    });

    test("should have domRequirementsMet set as false", () => {
      expect(spinner.domRequirementsMet).toBe(false);
    });

    test("should not have replaced the container contents", () => {
      spinner.init();
      expect(container.innerHTML).toMatchSnapshot();
    });
  });

  describe("the spinner component with custom continue text", () => {
    document.body.innerHTML = `
      <div id="spinner-container"
       data-initial-heading="Initial heading text"
       data-initial-spinnerStateText="Initial spinner state text"
       data-initial-spinnerState="pending"
       data-error-heading="Error heading"
       data-error-messageText="Error message text"
       data-error-whatYouCanDo-heading="Error what you can do heading"
       data-error-whatYouCanDo-message-text1="Error what you can do message text1"
       data-error-whatYouCanDo-message-link-href="Error what you can do message link href"
       data-error-whatYouCanDo-message-link-text="Error what you can do message link text"
       data-error-whatYouCanDo-message-text2="Error what you can do message link text2"
       data-complete-spinnerState="Spinner state complete"
       data-longWait-spinnerStateText="Long wait spinner text"
       data-ms-before-informing-of-long-wait="6000"
       data-ms-before-abort="30000"
       data-continueButton-text="Custom continue text">
        <form action="/ipv-callback" method="post" novalidate="novalidate">
            <input type="hidden" name="_csrf" value="csrfToken" />
            <div class="govuk-form-group">
                <h1 class="govuk-label-wrapper">
                    <label class="govuk-label govuk-label--l" for="more-detail">
                        Label text
                    </label>
                </h1>
                <p class="govuk-body">Paragraph</p>
                <button type="submit" class="govuk-button">
                    Button text
                </button>
            </div>
        </form>
    </div>`;
    const container = document.getElementById("spinner-container")!;
    const spinner = new Spinner(container);

    test("should include all properties from data attributes", () => {
      const expectedContent = {
        complete: { spinnerState: "Spinner state complete" },
        error: {
          heading: "Error heading",
          messageText: "Error message text",
          whatYouCanDo: {
            heading: "Error what you can do heading",
            message: {
              link: {
                href: "Error what you can do message link href",
                text: "Error what you can do message link text",
              },
              text1: "Error what you can do message text1",
              text2: "Error what you can do message link text2",
            },
          },
        },
        initial: {
          heading: "Initial heading text",
          spinnerState: "pending",
          spinnerStateText: "Initial spinner state text",
        },
        longWait: { spinnerStateText: "Long wait spinner text" },
        continueButton: {
          text: "Custom continue text",
        },
      };
      expect(spinner.content).toEqual(expectedContent);
    });
  });

  describe("when the API call returns COMPLETED", () => {
    beforeEach(() => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ status: "COMPLETED" }),
        }),
      ) as jest.Mock;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test("should update contents correctly", async () => {
      spinner.init();

      await waitUntil(() => spinner.state.done);

      expect(container.innerHTML).toMatchSnapshot();
    });
  });

  describe("when the API call returns INTERVENTION", () => {
    beforeEach(() => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ status: "INTERVENTION" }),
        }),
      ) as jest.Mock;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test("should update contents correctly", async () => {
      spinner.init();

      await waitUntil(() => spinner.state.done);

      expect(container.innerHTML).toMatchSnapshot();
    });
  });

  describe("when the API call returns ERROR", () => {
    beforeEach(() => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ status: "ERROR" }),
        }),
      ) as jest.Mock;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test("should update contents correctly", async () => {
      spinner.init();

      await waitUntil(() => spinner.state.done);

      expect(container.innerHTML).toMatchSnapshot();
    });
  });

  describe("when the long wait time elapses", () => {
    beforeEach(() => {
      document.body.innerHTML = getValidSpinnerDivHtml({
        msBeforeInformingOfLongWait: 20,
        msBetweenRequests: 10,
        msBetweenDomUpdate: 10,
      });
      container = document.getElementById("spinner-container")!;
      spinner = new Spinner(container);

      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ status: "PROCESSING" }),
        }),
      ) as jest.Mock;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test("should update contents correctly", async () => {
      spinner.init();
      await wait(30);
      expect(container.innerHTML).toMatchSnapshot();
    });
  });

  describe("when the abort time elapses", () => {
    beforeEach(() => {
      document.body.innerHTML = getValidSpinnerDivHtml({
        msBeforeAbort: 20,
        msBetweenRequests: 10,
        msBetweenDomUpdate: 10,
      });
      container = document.getElementById("spinner-container")!;
      spinner = new Spinner(container);

      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ status: "PROCESSING" }),
        }),
      ) as jest.Mock;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test("should update contents correctly", async () => {
      await spinner.init();

      await wait(500);

      expect(container.innerHTML).toMatchSnapshot();
    });
  });

  describe("when scheduled setTimeout tries to execute recursive function after msBeforeAbort", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      document.body.innerHTML = getValidSpinnerDivHtml({
        msBeforeAbort: 15,
        msBetweenRequests: 10,
        msBetweenDomUpdate: 2000,
      });
      container = document.getElementById("spinner-container")!;
      spinner = new Spinner(container);

      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ status: "PROCESSING" }),
        }),
      ) as jest.Mock;
    });

    afterEach(() => {
      jest.useRealTimers();
      jest.restoreAllMocks();
    });

    test("should stop polling", async () => {
      const spyRequestIDProcessingStatus = jest.spyOn(
        spinner,
        "requestIDProcessingStatus",
      );
      spinner.init();
      // Await the fetch
      await jest.runAllTicks();
      // Await the json processing
      await jest.runAllTicks();
      // Await the data arriving
      await jest.runAllTicks();
      // Await the timeout creation
      await jest.runAllTicks();
      // Await the timout finishing
      await jest.runAllTimers();
      expect(spyRequestIDProcessingStatus).toHaveBeenCalledTimes(2);
    });
  });

  describe("when spinner is initialised", () => {
    beforeEach(() => {
      container = document.getElementById("spinner-container")!;
      spinner = new Spinner(container);

      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ status: "PROCESSING" }),
        }),
      ) as jest.Mock;
    });

    afterEach(() => {
      jest.restoreAllMocks();
      sessionStorage.clear();
    });

    test("should save init time in session storage", async () => {
      await spinner.init();
      const initTime = sessionStorage.getItem("spinnerInitTime");
      expect(initTime).not.toBeNull();
    });
  });

  describe("when spinner is end in completion state", () => {
    beforeEach(() => {
      document.body.innerHTML = getValidSpinnerDivHtml({
        msBetweenRequests: 10,
        msBetweenDomUpdate: 10,
      });
      container = document.getElementById("spinner-container")!;
      spinner = new Spinner(container);

      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ status: "COMPLETED" }),
        }),
      ) as jest.Mock;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test("should clear init time from session storage", async () => {
      await spinner.init();
      const initTime = sessionStorage.getItem("spinnerInitTime");
      expect(initTime).not.toBeNull();
      await wait(20);
      expect(spinner.state.spinnerState).toBe("spinner__ready");
      expect(sessionStorage.getItem("spinnerInitTime")).toBeNull();
    });
  });

  describe("when spinner is end in error state", () => {
    beforeEach(() => {
      document.body.innerHTML = getValidSpinnerDivHtml({
        msBeforeAbort: 20,
        msBetweenRequests: 10,
        msBetweenDomUpdate: 5,
      });
      container = document.getElementById("spinner-container")!;
      spinner = new Spinner(container);

      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ status: "PROCESSING" }),
        }),
      ) as jest.Mock;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test("should clear init time from session storage", async () => {
      await spinner.init();
      const initTime = sessionStorage.getItem("spinnerInitTime");
      expect(initTime).not.toBeNull();
      await wait(30);
      expect(spinner.state.spinnerState).toBe("spinner__failed");
      expect(sessionStorage.getItem("spinnerInitTime")).toBeNull();
    });
  });
});
