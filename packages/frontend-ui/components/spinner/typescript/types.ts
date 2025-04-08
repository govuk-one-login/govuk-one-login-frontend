export type state = {
  spinnerState?: string;
  done?: boolean;
  virtualDom?: {
    nodeName?: string;
    id?: string;
    classes?: (string | undefined)[];
    convert?: unknown[];
  }[];
  spinnerStateText?: string;
  error?: boolean;
};

export type container =
  | HTMLElement
  | null
  | {
      replaceChildren?: Node;
      classList?: HTMLElement;
    };

export type node = {
  nodeName?: string;
  text?: string;
  innerHTML?: string;
  id?: string;
  classes?: [];
  convert?: unknown[];
};

export type apiRoute = string | undefined | unknown;

export type Timeout = Date | unknown;

export type timers = {
  updateDomTimer?: Timeout;
  abortUnresponsiveRequest?: Timeout;
};
