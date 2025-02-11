/* eslint-disable @typescript-eslint/no-require-imports */
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const path = require("path");
const session = require("express-session");
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

const crypto = require("crypto");
const sessionId = crypto.randomBytes(16).toString("hex");
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

const app = express();
const protect = require("overload-protection")("express", {
  production: process.env.NODE_ENV === "production",
  maxEventLoopDelay: 400,
  logging: console.warn,
});
app.use(protect);
const port = 3000;

const nodeModules = (modulePath) =>
  `${path.resolve(__dirname, "../../../node_modules/", modulePath)}`;

const APP_VIEWS = [
  path.join(__dirname, "views"),
  path.join(__dirname, "components"),
  nodeModules("govuk-frontend/"),
  nodeModules("@govuk-prototype-kit/templates"),
  nodeModules("@govuk-one-login"),
];

app.set("view engine", configureNunjucks(app, APP_VIEWS));

// const defaultLocalesPath = path.join(__dirname, "locales");
// const nodeModuleLocalesPath = path.join(
//   nodeModules("@govuk-one-login/frontend-ui/components/cookie-banner/locales"),
// );

// const loadTranslations = i18nextResourcesToBackend((lng, ns, callback) => {
//   try {
//     const cookieBannerTranslations = require(
//       path.join(nodeModuleLocalesPath, lng, `${ns}.json`),
//     );

//     // const defaultTranslations = require(
//     //   path.join(defaultLocalesPath, lng, `${ns}.json`),
//     // );

//     const mergedTranslations = {
//       // ...defaultTranslations,
//       ...cookieBannerTranslations,
//     };

//     callback(null, mergedTranslations);
//   } catch (error) {
//     console.error(`Error loading translations for ${lng}/${ns}:`, error);
//     callback(error, null);
//   }
// });

i18next
  // .use(loadTranslations)
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init(
    {
      ...i18nextConfigurationOptions(path.join(__dirname, "locales/{{lng}}/{{ns}}.json")),
    },
    (err) => {
      i18next.addResourceBundle('en', 'translation', {
        "cookieBanner": {
          "body1": "We use some essential cookies to make this service work.",
          "body2": "We'd like to set additional cookies so we can remember your settings, understand how people use the service and make improvements.",
          "ariaLabel": "Cookies on ",
          "headingText": "Cookies on ",
          "acceptAdditionalCookies": "Accept additional cookies",
          "rejectAdditionalCookies": "Reject additional cookies",
          "viewCookies": "View cookies",
          "cookieBannerAccept": {
            "body1": "You've accepted additional cookies. You can ",
            "body2": " at any time."
          },
          "cookieBannerReject": {
            "body1": "You've rejected additional cookies. You can ",
            "body2": " at any time."
          },
          "changeCookiePreferencesLink": "change your cookie settings",
          "hideCookieMessage": "Hide cookie message",
          "viewCookiesLink": "https://signin.account.gov.uk/cookies"
        }
      }, true, false);

      if (err) {
        console.error("i18next init failed:", err);
      } else {
        console.log("✅ i18next successfully initialised");
        console.log(
          "🔹 Loaded translations (CY):",
          
          i18next.getResourceBundle("cy", "translation"),
          // i18next.getResourceBundle("cy", "uiComponents"),
        );
        console.log(
          "🔹 Loaded translations (EN):",
          i18next.getResourceBundle("en", "translation"),
          // i18next.getResourceBundle("en", "uiComponents"),
        );
      }
    },
  );

    

app.use(i18nextMiddleware.handle(i18next));
app.use("/assets", express.static(nodeModules("govuk-frontend/govuk/assets")));

/** GA4 assets */
app.use(
  "/ga4-assets",
  express.static(nodeModules("@govuk-one-login/frontend-analytics/lib")),
);
app.use(
  session({
    secret: sessionId, // Should I make this more secure?
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
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
      console.error("Failed to set currentUrl:", error.message);
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

app.get(
  "/xDncNmqheVoQoeOTnVmwUnsuByWwKwwAPUZAWRYBnzgrDOCObSzFqMpwAxQRpHMUehzTfzGJjuFJOtWyQBdHQbtpEpxmopVEnghdxyz",
  (req, res) => {
    res.render("characterExample.njk");
  },
);

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
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
