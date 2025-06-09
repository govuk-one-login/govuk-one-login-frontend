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
    spinnerState: string;
  };
  complete: {
    spinnerState: string;
  };
};

export type state = {
  error?: error;
  spinnerState?: string;
  done?: boolean;
  virtualDom?: any[];
  timers?: {
    updateDomTimer: any;
    abortUnresponsiveRequest: any;
  };
};
