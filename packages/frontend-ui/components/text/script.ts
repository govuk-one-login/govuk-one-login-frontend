((_scope: Document, window: Window & typeof globalThis) => {
  documentReady(noPaste);

  function documentReady(callback: () => void): void {
    addEvent(document, "DOMContentLoaded", callback);
    addEvent(window, "load", callback);
  }

  function each<T>(
    a: ArrayLike<T>,
    cb: (item: T, index: number, arr: T[]) => void,
  ): void {
    const arr = [].slice.call(a) as T[];
    for (let i = 0; i < arr.length; i++) cb(arr[i], i, arr);
  }

  var prevent = (e: Event & { returnValue?: boolean }): false => {
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = true;
    }

    return false;
  };

  function hasClass(el: Element, className: string): boolean {
    return el.className.split(/\s/).indexOf(className) !== -1;
  }

  function getElementsByClass(
    parent: Document | Element,
    tag: string | string[],
    className: string,
  ): HTMLCollectionOf<Element> | Element[] {
    if (parent.getElementsByClassName) {
      return parent.getElementsByClassName(className);
    } else {
      const elems: Element[] = [];
      each(
        parent.getElementsByTagName(Array.isArray(tag) ? tag[0] : tag),
        (t: Element) => {
          if (hasClass(t, className)) {
            elems.push(t);
          }
        },
      );
      return elems;
    }
  }

  function noPaste(): void {
    var elements = getElementsByClass(document, ["input"], "js-nopaste");
    each(elements, (element: Element) => {
      once(element as StartableElement, "js-nopaste", () => {
        addEvent(element, "paste", prevent);
        addEvent(element, "dragdrop", prevent);
        addEvent(element, "drop", prevent);
      });
    });
  }

  interface StartableElement extends Element {
    started?: Record<string, boolean>;
  }

  function once(
    elem: StartableElement | null,
    key: string,
    callback: (elem: StartableElement) => void,
  ): void {
    if (!elem) {
      return;
    }
    elem.started = elem.started || {};
    if (!elem.started[key]) {
      elem.started[key] = true;
      callback(elem);
    }
  }

  interface LegacyEventTarget extends EventTarget {
    attachEvent?: (
      type: string,
      callback: EventListenerOrEventListenerObject,
    ) => void;
  }

  function addEvent(
    el: LegacyEventTarget,
    type: string,
    callback: EventListenerOrEventListenerObject,
  ): void {
    if (el.addEventListener) {
      el.addEventListener(type, callback, false);
    } else if (el.attachEvent) {
      el.attachEvent(`on${type}`, callback);
    }
  }
})(document, window);
