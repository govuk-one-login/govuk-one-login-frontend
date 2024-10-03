export const i18nextConfigurationOptions = (path) => ({
    debug: false, // Whether to enable debug mode for i18next
    fallbackLng: "en", // The default language to fall back
    // to if a translation is not available in the requested language
    preload: ["en", "cy"], // An array of languages to preload, typically the default and supported languages
    supportedLngs: ["en", "cy"], // An array of supported languages
    backend: {
      loadPath: path, // The path pattern to load translations from, e.g., locales/{{lng}}/{{ns}}.json
      allowMultiLoading: true, // Whether to allow loading multiple namespaces at once
    },
    detection: {
      lookupCookie: "lng", // The name of the cookie to look for language information
      lookupQuerystring: "lng", // The query string parameter to look for language information
      order: ["querystring", "cookie"], // The order in which to look
      // for language information (query string first, then cookie)
      caches: ["cookie"], // Caching mechanism for language detection
      ignoreCase: true, // Whether to ignore case when detecting language
      cookieSecure: true, // Whether to set the secure flag for the cookie
      cookieDomain: "", // The domain for the cookie (empty for the current domain)
      cookieSameSite: "", // The SameSite attribute for the cookie
    },
  });
