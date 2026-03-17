const React = require("react");
const Base = require("./components/Base");
const { BackLink, Radios, Button } = require("./components/GovUK");

const OrganisationType = (props) => {
  const { t, showError } = props;
  return (
    <Base {...props}>
      <BackLink href="/welcome" text={t("general.govuk.backLink")} />
      <form method="post" id="organisationForm">
        <Radios
          name="organisationType"
          id="organisation-type"
          legend={t("pages.organisationType.content.header")}
          errorMessage={showError ? t("pages.organisationType.content.errors.validationError") : undefined}
          items={[
            { value: "Government department or Ministry", text: t("pages.organisationType.content.options.governmentDepartmentOrMinistry") },
            { value: "Executive Agency", text: t("pages.organisationType.content.options.executiveAgency") },
            { value: "Arms length body", text: t("pages.organisationType.content.options.armsLengthBody") },
            { value: "Other", text: t("pages.organisationType.content.options.other") },
          ]}
        />
        <Button text={t("general.buttons.continue")} />
      </form>
      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener("DOMContentLoaded", function () {
          const storedOrganisationType = localStorage.getItem("organisationType");
          const form = document.forms.organisationForm;
          if (storedOrganisationType) {
            Array.from(form.elements.organisationType).find((radio) => radio?.value === storedOrganisationType).checked = true;
          }
        });
        document.getElementById("organisationForm").addEventListener("submit", function (event) {
          event.preventDefault();
          const organisationType = document.querySelector('input[name="organisationType"]:checked')?.value;
          if (organisationType) { localStorage.setItem("organisationType", organisationType); }
          const urlParams = new URLSearchParams(window.location.search);
          const editQuery = urlParams.get("edit") === "true" ? "?edit=true" : "";
          document.getElementById("organisationForm").action = "/validate-organisation-type" + editQuery;
          this.submit();
        });
      `}} />
    </Base>
  );
};

module.exports = OrganisationType;
