function validateEnterEmail(req, res) {
  try {
    const { enterEmail } = req.body;

    if (enterEmail && enterEmail !== "") {
      // Check if in edit mode and redirect accordingly
      res.redirect("/summary-page");
    } else {
      // Handle validation error, render the form with an error state
      res.render("enterEmail.njk", {
        showError: true,
        // Add any other variables needed for template
      });
    }
  } catch (error) {
    // Handle unexpected errors
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = { validateEnterEmail };
