function validateOrganisationType(req, res) {
  try {
    const { organisationType } = req.body;
    const queryParams = req.query;
    const editMode = queryParams.edit;

    if (organisationType && organisationType != null) {
      // Check if in edit mode and redirect accordingly
      if (editMode) {
        res.redirect("/summary-page");
      } else {
        res.redirect("/help-with-hint");
      }
    } else {
      res.render("organisationType.njk", {
        showError: true,
        // Add any other variables needed in your template
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = { validateOrganisationType };
