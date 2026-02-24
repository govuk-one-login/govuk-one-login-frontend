/* eslint-disable @typescript-eslint/no-require-imports */
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const { logger } = require("./utils/logger");
const { configureNunjucks } = require("./config/nunjucks");
const {
  validateOrganisationType,
} = require("./journeys/organisationTypeService.js");
const { validateHelpWithHint } = require("./journeys/helpWithHintService");
const {
  validateServiceDescription,
} = require("./journeys/serviceDescriptionService");
const { validateChooseLocation } = require("./journeys/chooseLocationService");
const { validateEnterEmail } = require("./journeys/enterEmailService");
const { validateFeedback } = require("./journeys/feedbackService");
const { loadAssets } = require("@govuk-one-login/frontend-asset-loader");
const {
  setFrontendUiTranslations,
  frontendUiMiddleware,
} = require("@govuk-one-login/frontend-ui");

const crypto = require("crypto");
const sessionId = crypto.randomBytes(32).toString("hex");
const {
  setGa4ContainerId,
  setUaContainerId,
  setStatusCode,
  setTaxonomyValues,
  setPageTitle,
  setContentId,
} = require("./config/gtmMiddleware.js");
const { checkSessionAndRedirect } = require("./config/middleware");
const i18next = require("i18next");
const i18nextMiddleware = require("i18next-http-middleware");
const Backend = require("i18next-fs-backend");
const { i18nextConfigurationOptions } = require("./config/i18next");
const {
  frontendVitalSignsInit,
} = require("@govuk-one-login/frontend-vital-signs");
const { createEvent } = require("@govuk-one-login/event-catalogue-utils");

const app = express();

let counter = 0;

app.get("/api", (req, res) => {
  counter++;
  const processingTime = req.query.processingTime || 1;
  logger.info(
    `Elapsed processing seconds: ${counter}. Processing time limit is: ${processingTime}`,
  );
  if (counter >= processingTime) {
    res.json({ status: "COMPLETED", counter: counter });
    counter = 0;
  } else {
    res.json({ status: "PENDING", counter: counter });
  }
});

app.post("/api/test-submit-button", (req, res) => {
  const newEvent = createEvent("AIS_EVENT_TRANSITION_APPLIED", {
    component_id: "component_id",
    event_name: "AIS_EVENT_TRANSITION_APPLIED",
    event_timestamp_ms: Date.now(),
    timestamp: Date.now(),
  });
  logger.info("New event created:", newEvent);

  setTimeout(() => {
    res.json({ status: "COMPLETED" });
  }, 11000);
});

const protect = require("overload-protection")("express", {
  production: process.env.NODE_ENV === "production",
  maxEventLoopDelay: 400,
  logging: logger.warn,
});
app.use(protect);
const port = 3000;

const nodeModules = (modulePath) =>
  `${path.resolve(__dirname, "../../../node_modules/", modulePath)}`;

const APP_VIEWS = [
  path.join(__dirname, "views"),
  path.join(__dirname, "components"),
  nodeModules("govuk-frontend/"),
  nodeModules("@govuk-one-login"),
];

app.set("view engine", configureNunjucks(app, APP_VIEWS));
i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init(
    {
      ...i18nextConfigurationOptions(
        path.join(__dirname, "locales/{{lng}}/{{ns}}.json"),
      ),
    },
    (err) => {
      setFrontendUiTranslations(i18next);

      if (err) {
        logger.error("i18next init failed:", err);
      }
    },
  );

app.use(i18nextMiddleware.handle(i18next));
app.use(frontendUiMiddleware);

app.use("/assets", express.static(nodeModules("govuk-frontend/govuk/assets")));

/** GA4 assets */
app.use(
  "/ga4-assets",
  express.static(nodeModules("@govuk-one-login/frontend-analytics/lib")),
);
/** ThumbmarkJS fingerprint **/
app.use(
  "/fingerprint",
  express.static(
    nodeModules("@govuk-one-login/frontend-device-intelligence/build/esm"),
  ),
);
app.use(
  session({
    secret: sessionId,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.ENV != "dev" },
  }),
);
app.use((req, res, next) => {
  if (req.i18n) {
    res.locals.htmlLang = req.i18n.language;
    res.locals.pageTitleLang = req.i18n.language;
    res.locals.mainLang = req.i18n.language;
    try {
      res.locals.currentUrl = new URL(
        req.protocol + "://" + req.get("host") + req.originalUrl,
      );
    } catch (error) {
      logger.error("Failed to set currentUrl:", error.message);
    }
    next();
  }
});

app.use(express.static("public"));

loadAssets(app, "public/**/*");

app.use(express.urlencoded({ extended: true }));
app.use(setGa4ContainerId);
app.use(setUaContainerId);
app.use(setStatusCode);
app.use(setTaxonomyValues);
app.use(setPageTitle);
app.use(setContentId);
app.use(checkSessionAndRedirect);

app.get("/welcome", (req, res) => {
  res.render("home.njk");
});

app.get("/enter-email", (req, res) => {
  res.render("enterEmail.njk");
});

app.get("/service-description", (req, res) => {
  res.render("serviceDescription.njk"); // free text
});

app.get("/organisation-type", (req, res) => {
  res.render("organisationType.njk"); // radio button
});

app.get("/help-with-hint", (req, res) => {
  res.render("helpWithHint.njk"); // checkbox
});

app.get("/choose-location", (req, res) => {
  res.render("chooseLocation.njk"); // select
});

app.get("/summary-page", (req, res) => {
  res.render("summaryPage.njk");
});

app.get("/feedback", (req, res) => {
  res.render("feedback.njk");
});

app.get("/spinner", (req, res) => {
  res.render("spinner.njk");
});

app.get("/test-progress-button", (req, res) => {
  res.render("test-progress-button.njk");
});

app.get(
  "/xDncNmqheVoQoeOTnVmwUnsuByWwKwwAPUZAWRYBnzgrDOCObSzFqMpwAxQRpHMUehzTfzGJjuFJOtWyQBdHQbtpEpxmopVEnghdxyz",
  (req, res) => {
    res.render("characterExample.njk");
  },
);

const server = app.listen(port, () => {
  logger.info(`Example app listening on port ${port}`);
});

frontendVitalSignsInit(server, {
  logLevel: process.env.LOG_LEVEL,
  staticPaths: ["/assets", "/ga4-assets", "/javascript", "/stylesheets"],
});

app.post("/validate-organisation-type", validateOrganisationType);

app.post("/validate-help-with-hint", validateHelpWithHint);

app.post("/validate-service-description", validateServiceDescription);

app.post("/validate-choose-location", validateChooseLocation);

app.post("/validate-enter-email", validateEnterEmail);

app.post("/validate-feedback", validateFeedback);
