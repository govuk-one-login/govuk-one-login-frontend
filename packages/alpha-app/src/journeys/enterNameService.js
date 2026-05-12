/* eslint-disable @typescript-eslint/no-require-imports */
const { logger } = require("../utils/logger");

function validateEnterName(req, res) {
  try {
    const { firstName, lastName } = req.body;

    const showFirstNameError = !firstName || firstName === "";
    const showLastNameError = !lastName || lastName === "";

    if (!showFirstNameError && !showLastNameError) {
      res.redirect("/welcome");
    } else {
      res.render("enterName.njk", {
        showFirstNameError,
        showLastNameError,
      });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = { validateEnterName };
