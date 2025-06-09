export type virtualDom = { nodeName: string; id: string; classes: string[] }[];

export type error = {
  spinnerState: string;
  done: boolean;
  virtualDom: never[];
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
  spinnerState: string;
  done: boolean;
  virtualDom: any[];
};
