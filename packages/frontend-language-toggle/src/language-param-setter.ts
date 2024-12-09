export default function addLanguageParam(language: string, url?: URL) {
  if (!url) {
    console.warn(
      "URL is undefined. The parameter cannot be added, and the toggle will not work.",
    );
    return "#invalid-url-lang-toggle";
  }

  url.searchParams.set("lng", language);
  return url.pathname + url.search;
}
