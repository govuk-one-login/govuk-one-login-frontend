import type { NextFunction, Request, Response } from "express";
import componentList from "../views/components/componentList";

const noSessionPages = [
  "/components",
  "/welcome",
  "/spinner",
  "/test-progress-button",
  "/step-card",
  "/enter-name",
  ...componentList.map((component) => `/components/${component}`),
];

const checkSessionAndRedirect = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Check if the user has an active session
  const hasSession = req.session?.userSession?.startedJourney;

  // Check if the user is on the homepage
  const isOnNoSessionPage =
    noSessionPages.includes(req.path) || req.path.startsWith("/components/");

  // If the user is on the Home Page and does not have a session, set it
  if (isOnNoSessionPage && !hasSession) {
    req.session.userSession = {
      startedJourney: true,
    };
  }

  // If the user doesn't have a session and is not on the homepage, redirect to Journey Guard Page
  if (!hasSession && !isOnNoSessionPage) {
    return res.render("journeyGuard.njk");
  }

  next();
};

export { checkSessionAndRedirect };
