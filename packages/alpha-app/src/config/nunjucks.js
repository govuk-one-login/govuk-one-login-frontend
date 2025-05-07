/* eslint-disable @typescript-eslint/no-require-imports */
const nunjucks = require("nunjucks");
const i18next = require("i18next");
const frontendUi = require("@govuk-one-login/frontend-ui");
module.exports = {
  configureNunjucks: (app, viewsPath) => {
    const nunjucksEnv = nunjucks.configure(viewsPath, {
      autoescape: true,
      express: app,
      noCache: true,
    });

    nunjucksEnv.addGlobal("addLanguageParam", frontendUi.addLanguageParam);
    nunjucksEnv.addGlobal("contactUsUrl", frontendUi.contactUsUrl);
    nunjucksEnv.addGlobal(
      "May_2025_Rebrand",
      process.env.May_2025_Rebrand == "true",
    );

    nunjucksEnv.addFilter("translate", function (key, options) {
      const translate = i18next.getFixedT(this.ctx.language);
      return translate(key, options);
    });
    return nunjucksEnv;
  },
};
