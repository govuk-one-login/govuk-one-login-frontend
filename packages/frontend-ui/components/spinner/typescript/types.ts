export type state = {
  spinnerState?: string;
  done?: boolean;
  virtualDom?: {
    nodeName: string;
    id: string;
    classes?: (string | undefined)[] | node;
    convert?: node | undefined | unknown;
  }[];
  spinnerStateText?: string;
  error?: boolean;
};

export type container =
  | HTMLElement
  | null
  | Node
  | {
      replaceChildren?: Node;
      classList?: HTMLElement | Node;
    };

export type node = {
  nodeName?: string;
  text?: string;
  innerHTML?: string;
  id?: string;
  classes?: [];
};

export type apiRoute = string | undefined | unknown;

export type Timeout = Date | unknown;

export type timers = {
  updateDomTimer?: Timeout;
  abortUnresponsiveRequest?: Timeout;
};
