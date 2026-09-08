import * as frontendUi from "@govuk-one-login/frontend-ui";
import type { Application } from "express";
import i18next from "i18next";
import nunjucks from "nunjucks";

const localsMiddleware = frontendUi.locals.middleware;

const configureNunjucks = (app: Application, viewsPath: string | string[]) => {
  const nunjucksEnv = nunjucks.configure(viewsPath, {
    autoescape: true,
    express: app,
    noCache: true,
  });

  frontendUi.addFrontendUiGlobals(nunjucksEnv);
  nunjucksEnv.addGlobal(
    "MAY_2025_REBRAND_ENABLED",
    process.env.MAY_2025_REBRAND_ENABLED === "true",
  );

  nunjucksEnv.addFilter("translate", function (key, options) {
    const translate = i18next.getFixedT(this.ctx.language);
    return translate(key, options);
  });

  app.use(localsMiddleware(app, nunjucksEnv));

  return nunjucksEnv;
};

export { configureNunjucks };
