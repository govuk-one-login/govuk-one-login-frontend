/* eslint-disable @typescript-eslint/no-require-imports */
const { logger } = require("../utils/logger");

function validateHelpWithHint(req, res) {
  try {
    const { helpWithHint } = req.body;
    const queryParams = req.query;
    const editMode = queryParams.edit;

    // Assuming helpWithHint is an array containing selected values
    if (helpWithHint && helpWithHint.length > 0) {
      // Check if in edit mode and redirect accordingly
      if (editMode) {
        res.redirect("/summary-page");
      } else {
        res.redirect("/service-description");
      }
    } else {
      // Handle validation error, render the form with an error state
      res.render("helpWithHint.njk", {
        showError: true,
        // Add any other variables needed in your template
      });
    }
  } catch (error) {
    // Handle unexpected errors
    logger.error(error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = { validateHelpWithHint };
