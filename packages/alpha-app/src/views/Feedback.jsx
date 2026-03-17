const React = require("react");
const Base = require("./components/Base");
const { BackLink, Select, Radios, Textarea, Checkboxes, Button } = require("./components/GovUK");

const Feedback = (props) => {
  const { t, showFeedbackEntityError, showFeedbackTypeError, showFeedbackDescriptionError, showFeedbackConsentError } = props;
  return (
    <Base {...props}>
      <BackLink href="/welcome" text={t("general.govuk.backLink")} />
      <h1 className="govuk-heading-xl">{t("pages.feedback.title")}</h1>
      <form method="post" id="feedbackForm" action="/validate-feedback">
        <Select
          id="feedback-entity"
          name="feedbackEntity"
          label={t("pages.feedback.content.feedbackEntity.label")}
          hint={t("pages.feedback.content.feedbackEntity.hint")}
          errorMessage={showFeedbackEntityError ? t("pages.feedback.content.feedbackEntity.errors.validationError") : undefined}
          items={[
            { value: "", text: "" },
            { value: "Person", text: t("pages.feedback.content.feedbackEntity.options.person") },
            { value: "Entity", text: t("pages.feedback.content.feedbackEntity.options.company") },
          ]}
        />
        <Radios
          name="feedbackType"
          id="feedback-type"
          legend={t("pages.feedback.content.feedbackType.label")}
          errorMessage={showFeedbackTypeError ? t("pages.feedback.content.feedbackType.errors.validationError") : undefined}
          items={[
            { value: "Bug", text: t("pages.feedback.content.feedbackType.options.bug") },
            { value: "Request", text: t("pages.feedback.content.feedbackType.options.request") },
          ]}
        />
        <Textarea
          id="feedback-description"
          name="feedbackDescription"
          label={t("pages.feedback.content.feedbackDescription.label")}
          hint={t("pages.feedback.content.feedbackDescription.hint")}
          errorMessage={showFeedbackDescriptionError ? t("pages.feedback.content.feedbackDescription.errors.validationError") : undefined}
        />
        <Checkboxes
          name="feedbackConsent"
          legend={t("pages.feedback.content.feedbackConsent.label")}
          hint={t("pages.feedback.content.feedbackConsent.hint")}
          errorMessage={showFeedbackConsentError ? t("pages.feedback.content.feedbackConsent.errors.validationError") : undefined}
          items={[{ value: "yes", text: t("pages.feedback.content.feedbackConsent.options.consent") }]}
        />
        <Button text={t("general.buttons.send")} />
      </form>
    </Base>
  );
};

module.exports = Feedback;
