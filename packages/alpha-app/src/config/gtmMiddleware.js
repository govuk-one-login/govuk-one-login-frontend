/* eslint-disable @typescript-eslint/no-require-imports */
const {
  GA4_CONTAINER_ID,
  UA_CONTAINER_ID,
  ROUTE_INFO,
} = require("./constants");

// This function makes sure that the GA4 Container ID is accessible to all pages,
// so we don't have to repeat it in every route

const setGa4ContainerId = (req, res, next) => {
  //     Set the GA4 Container ID in (locals) that all pages can see.
  res.locals.ga4ContainerId = GA4_CONTAINER_ID;
  next(); // Pass control to the next middleware function
};

// This function makes sure that the UA Container ID is accessible to all pages,
//so we don't have to repeat it in every route

const setUaContainerId = (req, res, next) => {
  //     Set the UA Container ID in (locals) that all pages can see.
  res.locals.uaContainerId = UA_CONTAINER_ID;
  next(); // Pass control to the next middleware function
};

// Middleware to instantiate the status code for the On Page Load tracker
const setStatusCode = (req, res, next) => {
  res.locals.statusCode = res.statusCode;
  next();
};

function getPath(req) {
  const { url } = req;
  const path = ROUTE_INFO.find((route) => route.path === url.split("?")[0]);
  if (!path) console.log("Path not found");
  return path;
}

// Middleware to instantiate the values for taxonomy levels 1 and 2 for the On Page Load tracker
const setTaxonomyValues = (req, res, next) => {
  const path = getPath(req);
  if (path) {
    res.locals.taxonomyLevel1 = path.taxonomyLevel1 || "undefined";
    res.locals.taxonomyLevel2 = path.taxonomyLevel2 || "undefined";
  } else {
    res.locals.taxonomyLevel1 = "undefined";
    res.locals.taxonomyLevel2 = "undefined";
  }

  next();
};

// Middleware to instantiate the value for the pageTitle for the On Page Load tracker
const setPageTitle = (req, res, next) => {
  const path = getPath(req);
  if (path) {
    res.locals.englishPageTitle = path.pageTitle || "undefined";
  } else {
    res.locals.englishPageTitle = "undefined";
  }

  next();
};

// Middleware to instantiate the value for the pageTitle for the On Page Load tracker
const setContentId = (req, res, next) => {
  const path = getPath(req);
  if (path) {
    res.locals.contentId = path.contentId || "undefined";
  } else {
    res.locals.englishPageTitle = "undefined";
  }

  next();
};

module.exports = {
  setGa4ContainerId,
  setUaContainerId,
  setStatusCode,
  setTaxonomyValues,
  setPageTitle,
  setContentId,
};
