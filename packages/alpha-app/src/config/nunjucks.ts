import * as frontendUi from "@govuk-one-login/frontend-ui";
import i18next from "i18next";
import nunjucks from "nunjucks";

const configureNunjucks = (
  app: Express.Application,
  viewsPath: string | string[],
) => {
  const nunjucksEnv = nunjucks.configure(viewsPath, {
    autoescape: true,
    express: app,
    noCache: true,
  });

  frontendUi.addFrontendUiGlobals(nunjucksEnv);

  nunjucksEnv.addFilter("translate", function (key, options) {
    const translate = i18next.getFixedT(this.ctx.language);
    return translate(key, options);
  });
  return nunjucksEnv;
};

export { configureNunjucks };
