const React = require("react");
const Base = require("./components/Base");
const { BackLink, Textarea, Button } = require("./components/GovUK");

const ServiceDescription = (props) => {
  const { t, showError } = props;
  return (
    <Base {...props}>
      <BackLink href="/help-with-hint" text={t("general.govuk.backLink")} />
      <form method="post" id="serviceDescriptionForm">
        <Textarea
          id="service-description"
          name="serviceDescription"
          label={t("pages.serviceDescription.content.header")}
          hint={t("pages.serviceDescription.content.hint")}
          errorMessage={showError ? t("pages.serviceDescription.content.errors.validationError") : undefined}
        />
        <Button text={t("general.buttons.continue")} />
      </form>
      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener("DOMContentLoaded", function () {
          const storedServiceDescription = localStorage.getItem("serviceDescription");
          const textField = document.getElementById("service-description");
          textField.value = storedServiceDescription ?? null;
        });
        document.getElementById("serviceDescriptionForm").addEventListener("submit", function (event) {
          event.preventDefault();
          const serviceDescription = document.getElementById("service-description").value;
          localStorage.setItem("serviceDescription", serviceDescription);
          const urlParams = new URLSearchParams(window.location.search);
          const editQuery = urlParams.get("edit") === "true" ? "?edit=true" : "";
          document.getElementById("serviceDescriptionForm").action = "/validate-service-description" + editQuery;
          this.submit();
        });
      `}} />
    </Base>
  );
};

module.exports = ServiceDescription;
