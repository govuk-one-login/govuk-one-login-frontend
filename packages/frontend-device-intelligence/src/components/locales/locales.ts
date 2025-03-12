import { ComponentInterface } from "../index";

export function getLocales(): Promise<ComponentInterface> {
  return Promise.resolve({
    languages: getUserLanguage(),
    timezone: getUserTimezone(),
  });
}

function getUserLanguage(): string {
  return navigator.language;
}

function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
