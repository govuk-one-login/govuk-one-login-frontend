const noSessionPages = ["/welcome", "/spinner"];

const checkSessionAndRedirect = (req, res, next) => {
  // Check if the user has an active session
  const hasSession =
    req.session &&
    req.session.userSession &&
    req.session.userSession.startedJourney;

  // Check if the user is on the homepage
  const isOnNoSessionPage = noSessionPages.includes(req.path);

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
module.exports = { checkSessionAndRedirect };
