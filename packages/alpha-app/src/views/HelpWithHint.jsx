const React = require("react");
const Base = require("./components/Base");
const { BackLink, Checkboxes, Button } = require("./components/GovUK");

const HelpWithHint = (props) => {
  const { t, showError } = props;
  return (
    <Base {...props}>
      <BackLink href="/organisation-type" text={t("general.govuk.backLink")} />
      <form method="post" id="helpWithHintForm">
        <Checkboxes
          name="helpWithHint"
          legend={t("pages.helpWithHint.content.header")}
          hint={t("pages.helpWithHint.content.hint")}
          errorMessage={showError ? t("pages.helpWithHint.content.errors.validationError") : undefined}
          items={[
            { value: "Getting access to the integration environment to test GOV.UK One Login", text: t("pages.helpWithHint.content.options.accessIntegrationEnvironment") },
            { value: "Having a technical discussion", text: t("pages.helpWithHint.content.options.technicalDiscussion") },
            { value: "Walking through the onboarding process", text: t("pages.helpWithHint.content.options.onboardingProcess") },
            { value: "Understanding the GOV.UK One Login programme in more detail", text: t("pages.helpWithHint.content.options.moreDetail") },
            { value: "Other", text: t("pages.helpWithHint.content.options.other") },
          ]}
        />
        <Button text={t("general.buttons.continue")} />
      </form>
      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener("DOMContentLoaded", function () {
          const storedHelpWithHints = localStorage.getItem("helpWithHint");
          const form = document.getElementById("helpWithHintForm");
          if (storedHelpWithHints) {
            storedHelpWithHints.split("/").forEach((value) => {
              const checkbox = form.querySelector('input[value="' + value + '"]');
              if (checkbox) { checkbox.checked = true; }
            });
          }
          form.addEventListener("submit", function (event) {
            event.preventDefault();
            const checkedItems = Array.from(form.querySelectorAll("input[type=checkbox]:checked")).map((cb) => cb.value);
            localStorage.setItem("helpWithHint", checkedItems.join("/"));
            const urlParams = new URLSearchParams(window.location.search);
            const editQuery = urlParams.get("edit") === "true" ? "?edit=true" : "";
            form.action = "/validate-help-with-hint" + editQuery;
            form.submit();
          });
        });
      `}} />
    </Base>
  );
};

module.exports = HelpWithHint;
