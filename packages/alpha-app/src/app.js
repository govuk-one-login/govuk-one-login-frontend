/* eslint-disable @typescript-eslint/no-require-imports */
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const { logger } = require("./utils/logger");
const { configureReact } = require("./config/react-renderer");
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
const {
  createEvent,
  validateEvent,
} = require("@govuk-one-login/event-catalogue-utils");

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
  console.log("New event created:", newEvent);
  const valid = validateEvent(newEvent);
  console.log("Created event is valid?:", valid);

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

app.set("views", path.join(__dirname, "views"));
configureReact(app);
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
    res.locals.t = req.i18n.getFixedT(req.i18n.language);
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
  res.render("Home", res.locals);
});

app.get("/enter-email", (req, res) => {
  res.render("EnterEmail", res.locals);
});

app.get("/service-description", (req, res) => {
  res.render("ServiceDescription", res.locals);
});

app.get("/organisation-type", (req, res) => {
  res.render("OrganisationType", res.locals);
});

app.get("/help-with-hint", (req, res) => {
  res.render("HelpWithHint", res.locals);
});

app.get("/choose-location", (req, res) => {
  res.render("ChooseLocation", res.locals);
});

app.get("/summary-page", (req, res) => {
  res.render("SummaryPage", res.locals);
});

app.get("/feedback", (req, res) => {
  res.render("Feedback", res.locals);
});

app.get("/spinner", (req, res) => {
  res.render("Spinner", res.locals);
});

app.get("/test-progress-button", (req, res) => {
  res.render("TestProgressButton", res.locals);
});

app.get(
  "/xDncNmqheVoQoeOTnVmwUnsuByWwKwwAPUZAWRYBnzgrDOCObSzFqMpwAxQRpHMUehzTfzGJjuFJOtWyQBdHQbtpEpxmopVEnghdxyz",
  (req, res) => {
    res.render("CharacterExample", res.locals);
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
