import { Spinner } from "./spinner.ts";

describe("the spinner component", () => {
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
         data-ms-before-abort="30000">
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

  const container = document.getElementById("spinner-container");
  const spinner = new Spinner(container);

  describe("config property", () => {
    test("should exist with default values", () => {
      expect(spinner).toHaveProperty("config");
      expect(spinner.config.msBetweenDomUpdate).toEqual(2000);
    });
    test("should be configurable through the dataset", () => {
      expect(spinner.config.msBeforeAbort).toEqual(30000);
      expect(spinner.config.msBeforeInformingOfLongWait).toEqual(6000);
    });
  });

  describe("requestIDProcessingStatus method", () => {
    const container = document.getElementById("spinner-container");
    const spinner = new Spinner(container);

    test("should exist", () => {
      expect(spinner).toHaveProperty("requestIDProcessingStatus");
    });
  });

  describe("reflectLongWait method", () => {
    const container = document.getElementById("spinner-container");
    const spinner = new Spinner(container);

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
    const container = document.getElementById("spinner-container");
    const spinner = new Spinner(container);

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
    const container = document.getElementById("spinner-container");
    const spinner = new Spinner(container);

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
    const container = document.getElementById("spinner-container");
    const spinner = new Spinner(container);

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
        const output = spinner.convert(i);
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
      expect(spinner.vDomHasChanged({ foo: "foo" }, { foo: "foo" }));
    });

    test("should return true when passed objects that have different JSON string representations", () => {
      expect(spinner.vDomHasChanged({ foo: "foo" }, { foo: "bar" }));
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
    const container = document.getElementById("spinner-container");
    const spinner = new Spinner(container);
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

    test("should have a timers property", () => {
      expect(spinner).toHaveProperty("timers");
    });

    test("should have a createVirtualDom property", () => {
      expect(spinner).toHaveProperty("createVirtualDom");
    });
  });

  describe("when instantiated with a badly formed HTMLDivElement", () => {
    beforeEach(() => {
      // This HTML is missing several data attributes the spinner relies upon
      document.body.innerHTML = `
        <div id="bad-spinner-container"
        data-initial-heading="Initial heading text"
         data-initial-spinnerStateText="Initial spinner state text"
         data-initial-spinnerState="Initial spinner state"
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
    });

    const container = document.getElementById("bad-spinner-container");
    const spinner = new Spinner(container);

    test("should have domRequirementsMet set as false", () => {
      expect(spinner.domRequirementsMet).toBe(false);
    });
  });
});
