/* eslint-disable @typescript-eslint/no-require-imports */
const nunjucks = require("nunjucks");
const i18next = require("i18next");
const addLanguageParam = require("@govuk-one-login/frontend-language-toggle");

module.exports = {
  configureNunjucks: (app, viewsPath) => {
    const nunjucksEnv = nunjucks.configure(viewsPath, {
      autoescape: true,
      express: app,
      noCache: true,
    });

    nunjucksEnv.addGlobal("addLanguageParam", addLanguageParam);

    nunjucksEnv.addFilter("translate", function (key, options) {
      const translate = i18next.getFixedT(this.ctx.language);
      return translate(key, options);
    });

    return nunjucksEnv;
  },
};
