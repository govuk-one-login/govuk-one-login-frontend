export interface virtualDom {
  nodeName?: string;
  id?: string;
  classes?: string[];
}

export type error = {
  spinnerState: string;
  done: boolean;
  virtualDom: never[];
  state: { error: boolean };
};

export type apiRoute = RequestInfo | URL;

export type content = {
  initial: {
    spinnerState: string | virtualDom;
  };
  complete: {
    spinnerState: string;
  };
};

export type timers = {
  updateDomTimer?: unknown | number;
  abortUnresponsiveRequest?: unknown | number;
};

export type state = {
  error?: boolean | error;
  spinnerState?: string;
  done?: boolean;
  virtualDom?: unknown[];
  timers?: {
    timers: timers;
  };
  spinnerStateText?: string;
};

export type node = {
  text: object;
  innerHTML: HTMLElement;
  id: string;
  classes: string[];
  nodeName: keyof HTMLElementTagNameMap;
  textContent: unknown | HTMLElement | string;
  el: unknown | HTMLElement | string;
};

export type initialState = {
  nodeName: string;
  id: string;
  classes: (string | undefined)[];
}[];
