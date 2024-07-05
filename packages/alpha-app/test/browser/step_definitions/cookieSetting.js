const { Given } = require("@cucumber/cucumber");

Given("I have the {word} cookie set", async function (cookieName) {
  await this.context.addCookies([
    {
      name: cookieName,
      value: "true",
      path: "/",
      domain: process.env.SERVICE_COOKIE_DOMAIN,
    },
  ]);
});

Given(
  "I have the {word} cookie set to {word}",
  async function (cookieName, value) {
    await this.context.addCookies([
      {
        name: cookieName,
        value: value,
        path: "/",
        domain: process.env.SERVICE_COOKIE_DOMAIN,
      },
    ]);
  },
);
