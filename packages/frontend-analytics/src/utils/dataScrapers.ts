/**
 * Common
 */

export const getDomain = (url: string): string => {
  if (url === "undefined") {
    return "undefined";
  }
  const newUrl = new URL(url);
  return `${newUrl.protocol}//${newUrl.host}`;
};

export const getDomainPath = (url: string, part: number): string => {
  if (url === "undefined") {
    return "undefined";
  }

  // Google Tag Manager takes a maximum string length of 500
  const start = part * 500;
  const end = start + 500;
  const newUrl = new URL(url);
  const domainPath = newUrl.pathname.substring(start, end);
  return domainPath.length ? domainPath : "undefined";
};

export const isChangeLink = (element: HTMLElement): boolean => {
  if (element.tagName === "A") {
    const anchorElement = element as HTMLAnchorElement;
    return new URL(anchorElement.href).searchParams.get("edit") === "true";
  }
  return false;
};
