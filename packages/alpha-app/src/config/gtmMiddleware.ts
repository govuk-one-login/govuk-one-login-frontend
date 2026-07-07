import { GA4_CONTAINER_ID, UA_CONTAINER_ID, ROUTE_INFO } from "./constants";
import { logger } from "../utils/logger";
import type { Request, Response, NextFunction } from "express";

// This function makes sure that the GA4 Container ID is accessible to all pages,
// so we don't have to repeat it in every route

const setGa4ContainerId = (req: Request, res: Response, next: NextFunction) => {
  //     Set the GA4 Container ID in (locals) that all pages can see.
  res.locals.ga4ContainerId = GA4_CONTAINER_ID;
  next(); // Pass control to the next middleware function
};

// This function makes sure that the UA Container ID is accessible to all pages,
//so we don't have to repeat it in every route

const setUaContainerId = (req: Request, res: Response, next: NextFunction) => {
  //     Set the UA Container ID in (locals) that all pages can see.
  res.locals.uaContainerId = UA_CONTAINER_ID;
  next(); // Pass control to the next middleware function
};

// Middleware to instantiate the status code for the On Page Load tracker
const setStatusCode = (req: Request, res: Response, next: NextFunction) => {
  res.locals.statusCode = res.statusCode;
  next();
};

function getPath(req: Request) {
  const { url } = req;
  const path = ROUTE_INFO.find((route) => route.path === url.split("?")[0]);
  if (!path) logger.debug("Path not found");
  return path;
}

// Middleware to instantiate the values for taxonomy levels 1 and 2 for the On Page Load tracker
const setTaxonomyValues = (req: Request, res: Response, next: NextFunction) => {
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
const setPageTitle = (req: Request, res: Response, next: NextFunction) => {
  const path = getPath(req);
  if (path) {
    res.locals.englishPageTitle = path.pageTitle || "undefined";
  } else {
    res.locals.englishPageTitle = "undefined";
  }

  next();
};

// Middleware to instantiate the value for the pageTitle for the On Page Load tracker
const setContentId = (req: Request, res: Response, next: NextFunction) => {
  const path = getPath(req);
  if (path) {
    res.locals.contentId = path.contentId || "undefined";
  } else {
    res.locals.englishPageTitle = "undefined";
  }

  next();
};

export {
  setGa4ContainerId,
  setUaContainerId,
  setStatusCode,
  setTaxonomyValues,
  setPageTitle,
  setContentId,
};
