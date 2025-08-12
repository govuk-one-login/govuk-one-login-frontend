/* eslint-disable @typescript-eslint/no-explicit-any */
export interface virtualDom {
  nodeName?: string;
  id?: string;
  classes?: string[];
  text?: string;
}

export type error = {
  spinnerState: string;
  done: boolean;
  virtualDom: never[];
  state: { error: boolean };
  name: string;
};

export type apiRoute = RequestInfo | URL;

export type content = {
  longWait?: {
    spinnerStateText: string;
  };
  initial?: {
    spinnerState: string | virtualDom;
  };
  complete?: {
    spinnerState: string;
    ariaButtonEnabledMessage?: string;
  };
  continueButton?: {
    text: string;
  };
  error?: {
    heading?: string;
    messageText?: string;
    whatYouCanDo: {
      heading: string;
      message: {
        text1: string;
        link: {
          href: string;
          text: string;
        };
        text2: string;
      };
    };
  };
};

export type timers = {
  updateDomTimer?: unknown | number;
  abortUnresponsiveRequest?: unknown | number;
  abort?: unknown | never;
};

export type state = {
  abortController?: null | {
    abort: any;
  };
  abort?: unknown;
  error?: boolean | error;
  spinnerState?: string;
  done?: boolean;
  virtualDom?: unknown[];
  timers?: {
    timers: timers;
  };
  spinnerStateText?: string;
  buttonDisabled?: boolean;
  heading?: object | string | undefined;
  messageText?: string;
  ariaButtonEnabledMessage?: string;
};

export type node = {
  text: object;
  innerHTML: HTMLElement;
  id: string;
  classes: string[];
  nodeName: keyof HTMLElementTagNameMap;
  textContent: unknown | HTMLElement | string;
  el: unknown | HTMLElement | string;
  buttonDisabled: boolean | string;
};

export type initialState = {
  nodeName?: string;
  id?: string;
  classes?: (string | undefined)[];
  text?: object | string;
  buttonDisabled?: state;
}[];

export type spinnerInitial = {
  container?: HTMLElement;
  apiUrl?: string;
  msBeforeInformingOfLongWait?: number;
  msBeforeAbort?: number;
  msBetweenRequests?: number;
  msBeforeDomUpdate?: number;
  ariaLiveContainer?: HTMLElement;
  domRequirementsMet?: boolean;
  initTime?: number | undefined;
  updateDomTimer?: number | undefined | any;
  abortController?: any | object;
  config?: {
    msBeforeAbort: number;
    msBeforeInformingOfLongWait: number;
    msBetweenRequests: number;
    ariaButtonEnabledMessage: string;
    msBetweenDomUpdate: number;
  };
  msBetweenDomUpdate?: number;
};
