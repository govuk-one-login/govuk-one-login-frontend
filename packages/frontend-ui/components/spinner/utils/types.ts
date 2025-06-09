export type virtualDom = {
  nodeName?: string;
  id?: string;
  classes?: string[];
};

export type error = {
  spinnerState: string;
  done: boolean;
  virtualDom: never[];
  state: { error: any };
  error: any;
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

export type state = {
  error?: boolean | error;
  spinnerState?: string;
  done?: boolean;
  virtualDom?: any[];
  timers?: {
    updateDomTimer: any;
    abortUnresponsiveRequest: any;
  };
  spinnerStateText?: string;
};

export type timers = {
  timers?: {
    updateDomTimer?: any;
  };
  updateDomTimer?: any;
  abortUnresponsiveRequest?: any;
};
