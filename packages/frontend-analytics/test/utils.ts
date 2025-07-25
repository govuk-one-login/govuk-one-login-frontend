export function acceptCookies() {
  document.cookie = `cookies_preferences_set=${encodeURIComponent('{"analytics":true}')};`;
}

export function rejectCookies() {
  document.cookie = `cookies_preferences_set=${encodeURIComponent('{"analytics":false}')};`;
}

export function unsetCookies() {
  document.cookie = `cookies_preferences_set=${encodeURIComponent('{"analytics":true}')};expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}
