/* eslint-disable @typescript-eslint/no-require-imports */
const { logger } = require("../utils/logger");

function validateChooseLocation(req, res) {
  try {
    const { chooseLocation } = req.body;
    const queryParams = req.query;
    const editMode = queryParams.edit;

    if (chooseLocation && chooseLocation !== "") {
      // Check if in edit mode and redirect accordingly
      if (editMode) {
        res.redirect("/summary-page");
      } else {
        res.redirect("/enter-email");
      }
    } else {
      // Handle validation error, render the form with an error state
      res.render("chooseLocation.njk", {
        showError: true,
        // Add any other variables needed for template
      });
    }
  } catch (error) {
    // Handle unexpected errors
    logger.error(error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = { validateChooseLocation };
