/*
    These functions should be used only for the sake of having a particular cookie for page design feature tests on pages where
    that cookie is required. Feature tests related to the user journey should set the cookies in the correct way a user would,
    e.g. getting a valid sessionId cookie by calling /authorize.
*/

async function setCookie(context, name, value) {
  await context.addCookies([
    { name, value, path: "/", domain: process.env.SERVICE_COOKIE_DOMAIN },
  ]);
}

async function setLngCookieToEnglish(context) {
  await setCookie(context, "lng", "en");
}

async function setLngCookieToWelsh(context) {
  await setCookie(context, "lng", "cy");
}

module.exports = {
  setLngCookieToEnglish,
  setLngCookieToWelsh,
};
