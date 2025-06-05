export type virtualDom = { nodeName: string; id: string; classes: string[] }[];

export type error = {
  spinnerState: string;
  done: boolean;
  virtualDom: never[];
};

export type apiRoute = RequestInfo | URL;
