export type virtualDom = {
  nodeName?: string;
  id?: string;
  classes?: string[];
};

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
  updateDomTimer?: number;
  abortUnresponsiveRequest?: number;
};

export type state = {
  error?: boolean | error;
  spinnerState?: string;
  done?: boolean;
  virtualDom?: unknown[];
  timers?: {
    timers;
  };
  spinnerStateText?: string;
};
