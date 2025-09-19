import { PollResult, Spinner, useSpinner } from "../spinner";
import { describe } from "@jest/globals";

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getValidSpinnerDivHtml(
  params: {
    msBeforeAbort?: number;
    msBeforeInformingOfLongWait?: number;
    msBetweenDomUpdate?: number;
    msBetweenRequests?: number;
    ariaAlertCompletionText?: string;
  } = {},
) {
  let ariaAlertCompletionTextData = "";
  if (params.ariaAlertCompletionText) {
    ariaAlertCompletionTextData = `data-aria-alert-completion-text="${params.ariaAlertCompletionText}`;
  }

  return `
        <div id="spinner-container"
         data-ms-before-informing-of-long-wait="${params.msBeforeInformingOfLongWait || 6000}"
         data-ms-before-abort="${params.msBeforeAbort || 30000}"
         data-ms-between-dom-update="${params.msBetweenDomUpdate || 2000}"
         data-ms-between-requests="${params.msBetweenRequests || 5000}"
         ${ariaAlertCompletionTextData}">
          <div id="no-js-content">JS is disabled</div>
          <div id="wait-content" style="display:none">Waiting</div>
          <div id="long-wait-content" style="display:none">Long wait</div>
          <div id="success-content" style="display:none">Success</div>
          <div id="error-content" style="display:none">Error</div>
    </div>`;
}

const validSpinnerHtml = getValidSpinnerDivHtml({ariaAlertCompletionText: "Aria success text"});

let container: HTMLDivElement;
const pollingFunction: jest.Mock = jest.fn();
const successFunction: jest.Mock = jest.fn();
const errorFunction: jest.Mock = jest.fn();

beforeEach(() => {
  pollingFunction.mockReset();
  successFunction.mockReset();
  errorFunction.mockReset();
  pollingFunction.mockResolvedValue(PollResult.Pending);
  document.body.innerHTML = validSpinnerHtml;
  container = document.getElementById("spinner-container") as HTMLDivElement;
});

describe("Validation", () => {

  describe("useSpinner method", () => {

    test("should display Spinner constructor errors in the container", () => {
      // Act
      useSpinner("spinner-container", null as never, successFunction, errorFunction);

      // Assert
      expect(container.innerHTML).toMatchSnapshot();
    });
  });

  describe("Spinner constructor", () => {

    test("should throw an exception if no polling function is provided", () => {
      // Act and assert
      expect(() => {
        new Spinner(container, null as never, successFunction, errorFunction);
      }).toThrow("Polling function must be provided");
    });

    test("should throw an exception if no no-js content is provided", () => {
      // Arrange
      document.body.innerHTML = `<div id="spinner-container"
         data-ms-before-informing-of-long-wait="6000"
         data-ms-before-abort="30000"
         data-ms-between-dom-update="1000"
         data-ms-between-requests="500">
          <div id="wait-content" style="display:none">Waiting</div>
          <div id="long-wait-content" style="display:none">Long wait</div>
          <div id="success-content" style="display:none">Success</div>
          <div id="error-content" style="display:none">Error</div>
        </div>`;
      container = document.getElementById("spinner-container") as HTMLDivElement;

      // Act and assert
      expect(() => {
        new Spinner(container, pollingFunction, successFunction, errorFunction);
      }).toThrow("HTML Element with id no-js-content must be provided");
    });

    test("should throw an exception if success content and success function are not provided", () => {
      // Arrange
      document.body.innerHTML = `<div id="spinner-container"
         data-ms-before-informing-of-long-wait="6000"
         data-ms-before-abort="30000"
         data-ms-between-dom-update="1000"
         data-ms-between-requests="500">
          <div id="no-js-content">JS is disabled</div>
          <div id="wait-content" style="display:none">Waiting</div>
          <div id="long-wait-content" style="display:none">Long wait</div>
          <div id="error-content" style="display:none">Error</div>
        </div>`;
      container = document.getElementById("spinner-container") as HTMLDivElement;

      // Act and assert
      expect(() => {
        new Spinner(container, pollingFunction, null as never, errorFunction);
      }).toThrow("One of success-content or successFunction must be provided");
    });

    test("should throw an exception if error content and error function are not provided", () => {
      // Arrange
      document.body.innerHTML = `<div id="spinner-container"
         data-ms-before-informing-of-long-wait="6000"
         data-ms-before-abort="30000"
         data-ms-between-dom-update="1000"
         data-ms-between-requests="500">
          <div id="no-js-content">JS is disabled</div>
          <div id="wait-content" style="display:none">Waiting</div>
          <div id="long-wait-content" style="display:none">Long wait</div>
          <div id="success-content" style="display:none">Success</div>
        </div>`;
      container = document.getElementById("spinner-container") as HTMLDivElement;

      // Act and assert
      expect(() => {
        new Spinner(container, pollingFunction, successFunction, null as never);
      }).toThrow("One of error-content or errorFunction must be provided");
    });
  });
});

describe("Spinner behaviour", () => {

  test("initial waiting", async () => {
    // Arrange
    document.body.innerHTML = getValidSpinnerDivHtml({
      msBeforeInformingOfLongWait: 2000,
      msBetweenRequests: 1000,
      msBetweenDomUpdate: 10,
      msBeforeAbort: 30000,
      ariaAlertCompletionText: "Aria success text",
    });
    container = document.getElementById("spinner-container") as HTMLDivElement;
    const spinner = new Spinner(container, pollingFunction, successFunction, errorFunction);

    // Act
    await spinner.init();

    // Assert
    expect(container.innerHTML).toMatchSnapshot();
  });

  test("long waiting", async () => {
    // Arrange
    document.body.innerHTML = getValidSpinnerDivHtml({
      msBeforeInformingOfLongWait: 10,
      msBetweenRequests: 1000,
      msBetweenDomUpdate: 5,
      msBeforeAbort: 30000,
      ariaAlertCompletionText: "Aria success text",
    });
    container = document.getElementById("spinner-container") as HTMLDivElement;
    const spinner = new Spinner(container, pollingFunction, successFunction, errorFunction);

    // Act
    await spinner.init();
    await wait(20);

    // Assert
    expect(container.innerHTML).toMatchSnapshot();
  });

  test("success", async () => {
    // Arrange
    document.body.innerHTML = getValidSpinnerDivHtml({
      msBeforeInformingOfLongWait: 1000,
      msBetweenRequests: 10,
      msBetweenDomUpdate: 5,
      msBeforeAbort: 30000,
      ariaAlertCompletionText: "Aria success text",
    });
    container = document.getElementById("spinner-container") as HTMLDivElement;
    pollingFunction.mockResolvedValue(PollResult.Success);
    const spinner = new Spinner(container, pollingFunction, successFunction, errorFunction);

    // Act
    await spinner.init();
    await wait(30);

    // Assert
    expect(container.innerHTML).toMatchSnapshot();
    expect(pollingFunction).toHaveBeenCalledTimes(1);
    expect(successFunction).toHaveBeenCalledTimes(1);
  });

  test("success with no aria text", async () => {
    // Arrange
    document.body.innerHTML = getValidSpinnerDivHtml({
      msBeforeInformingOfLongWait: 1000,
      msBetweenRequests: 10,
      msBetweenDomUpdate: 5,
      msBeforeAbort: 30000,
    });
    container = document.getElementById("spinner-container") as HTMLDivElement;
    pollingFunction.mockResolvedValue(PollResult.Success);
    const spinner = new Spinner(container, pollingFunction, successFunction, errorFunction);

    // Act
    await spinner.init();
    await wait(30);

    // Assert
    expect(container.innerHTML).toMatchSnapshot();
    expect(pollingFunction).toHaveBeenCalledTimes(1);
    expect(successFunction).toHaveBeenCalledTimes(1);
  });

  test("error", async () => {
    // Arrange
    document.body.innerHTML = getValidSpinnerDivHtml({
      msBeforeInformingOfLongWait: 1000,
      msBetweenRequests: 10,
      msBetweenDomUpdate: 5,
      msBeforeAbort: 30000,
      ariaAlertCompletionText: "Aria success text",
    });
    container = document.getElementById("spinner-container") as HTMLDivElement;
    pollingFunction.mockResolvedValue(PollResult.Failure);
    const spinner = new Spinner(container, pollingFunction, successFunction, errorFunction);

    // Act
    await spinner.init();
    await wait(30);

    // Assert
    expect(container.innerHTML).toMatchSnapshot();
    expect(pollingFunction).toHaveBeenCalledTimes(1);
    expect(errorFunction).toHaveBeenCalledTimes(1);
  });

  test("timeout", async () => {
    // Arrange
    document.body.innerHTML = getValidSpinnerDivHtml({
      msBeforeInformingOfLongWait: 1000,
      msBetweenRequests: 10,
      msBetweenDomUpdate: 5,
      msBeforeAbort: 25,
      ariaAlertCompletionText: "Aria success text",
    });
    container = document.getElementById("spinner-container") as HTMLDivElement;
    const spinner = new Spinner(container, pollingFunction, successFunction, errorFunction);

    // Act
    await spinner.init();
    await wait(30);

    // Assert
    expect(container.innerHTML).toMatchSnapshot();
    expect(pollingFunction).toHaveBeenCalledTimes(3);
    expect(errorFunction).toHaveBeenCalledTimes(1);
  });
});

describe("Init time", () => {
  beforeEach(() => {
    document.body.innerHTML = getValidSpinnerDivHtml({
      msBeforeInformingOfLongWait: 1000,
      msBetweenRequests: 10,
      msBetweenDomUpdate: 5,
      msBeforeAbort: 25,
    });
    container = document.getElementById("spinner-container") as HTMLDivElement;
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  test("should save init time in session storage when spinner is initialised", async () => {
    // Arrange
    const spinner = new Spinner(container, pollingFunction, successFunction, errorFunction);

    // Act
    await spinner.init();

    // Assert
    expect(sessionStorage.getItem("spinnerInitTime")).not.toBeNull();
  });

  test("should clear init time on success", async () => {
    // Arrange
    pollingFunction.mockResolvedValue(PollResult.Success);
    const spinner = new Spinner(container, pollingFunction, successFunction, errorFunction);

    // Act
    await spinner.init();

    // Assert
    expect(sessionStorage.getItem("spinnerInitTime")).toBeNull();
  });

  test("should clear init time on error", async () => {
    // Arrange
    pollingFunction.mockResolvedValue(PollResult.Failure);
    const spinner = new Spinner(container, pollingFunction, successFunction, errorFunction);

    // Act
    await spinner.init();

    // Assert
    expect(sessionStorage.getItem("spinnerInitTime")).toBeNull();
  });

  test("should clear init time on timeout", async () => {
    // Arrange
    const spinner = new Spinner(container, pollingFunction, successFunction, errorFunction);

    // Act
    await spinner.init();
    await wait(30);

    // Assert
    expect(sessionStorage.getItem("spinnerInitTime")).toBeNull();
  });

  test("Spinner shows long wait on page refresh", async () => {
    // Arrange
    document.body.innerHTML = getValidSpinnerDivHtml({
      msBeforeInformingOfLongWait: 10,
      msBetweenRequests: 5,
      msBetweenDomUpdate: 5,
      msBeforeAbort: 25,
      ariaAlertCompletionText: "Aria success text",
    });
    container = document.getElementById("spinner-container") as HTMLDivElement;
    const spinner = new Spinner(container, pollingFunction, successFunction, errorFunction);
    sessionStorage.setItem("spinnerInitTime", (Date.now() - 15).toString());

    // Act
    await spinner.init();

    // Assert
    expect(container.innerHTML).toMatchSnapshot();
  });

  test("Spinner shows timeout on page refresh", async () => {
    // Arrange
    document.body.innerHTML = getValidSpinnerDivHtml({
      msBeforeInformingOfLongWait: 10,
      msBetweenRequests: 5,
      msBetweenDomUpdate: 5,
      msBeforeAbort: 25,
      ariaAlertCompletionText: "Aria success text",
    });
    container = document.getElementById("spinner-container") as HTMLDivElement;
    const spinner = new Spinner(container, pollingFunction, successFunction, errorFunction);
    sessionStorage.setItem("spinnerInitTime", (Date.now() - 30).toString());

    // Act
    await spinner.init();

    // Assert
    expect(container.innerHTML).toMatchSnapshot();
    expect(pollingFunction).toHaveBeenCalledTimes(0);
    expect(errorFunction).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem("spinnerInitTime")).toBeNull();
  });
});
