export default function addLanguageParam(language: string, url: URL) {
  url.searchParams.set("lng", language);
  return url.pathname + url.search;
};
