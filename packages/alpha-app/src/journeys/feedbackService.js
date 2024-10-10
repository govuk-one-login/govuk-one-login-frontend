function validateFeedback(req, res) {
  try {
    const {
      feedbackEntity,
      feedbackType,
      feedbackDescription,
      feedbackConsent,
    } = req.body;

    let showFeedbackTypeError = false;
    let showFeedbackDescriptionError = false;
    let showFeedbackConsentError = false;
    let showFeedbackEntityError = false;

    // Check feedbackEntity field value
    if (!feedbackEntity || feedbackEntity === "") {
      showFeedbackEntityError = true;
    }

    // Check feedbackType field value
    if (!feedbackType || feedbackType === "") {
      showFeedbackTypeError = true;
    }

    // Check feedbackDescription field value
    if (!feedbackDescription || feedbackDescription === "") {
      showFeedbackDescriptionError = true;
    }

    // Check feedbackConsent field value
    if (!feedbackConsent || feedbackConsent === "") {
      showFeedbackConsentError = true;
    }

    if (
      showFeedbackEntityError ||
      showFeedbackTypeError ||
      showFeedbackDescriptionError ||
      showFeedbackConsentError
    ) {
      res.render("feedback.njk", {
        showFeedbackEntityError,
        showFeedbackTypeError,
        showFeedbackDescriptionError,
        showFeedbackConsentError,
      });
    } else {
      res.redirect("/welcome");
    }
  } catch (error) {
    // Handle unexpected errors
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = { validateFeedback };
