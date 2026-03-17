const React = require("react");
const Base = require("./components/Base");
const { BackLink, Input, Button } = require("./components/GovUK");

const EnterEmail = (props) => {
  const { t, showError } = props;
  return (
    <Base {...props}>
      <BackLink href="/choose-location" text={t("general.govuk.backLink")} />
      <form method="post" id="enterEmailForm">
        <Input
          id="enter-email"
          name="enterEmail"
          label={t("pages.enterEmail.content.header")}
          errorMessage={showError ? t("pages.enterEmail.content.errors.validationError") : undefined}
        />
        <Button text={t("general.buttons.continue")} />
      </form>
      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener("DOMContentLoaded", function () {
          const storedEmail = localStorage.getItem("enterEmail");
          const textField = document.getElementById("enter-email");
          textField.value = storedEmail ?? null;
        });
        document.getElementById("enterEmailForm").addEventListener("submit", function (event) {
          event.preventDefault();
          const enterEmail = document.getElementById("enter-email").value;
          if (enterEmail) { localStorage.setItem("enterEmail", enterEmail); }
          const urlParams = new URLSearchParams(window.location.search);
          const editQuery = urlParams.get("edit") === "true" ? "?edit=true" : "";
          document.getElementById("enterEmailForm").action = "/validate-enter-email" + editQuery;
          this.submit();
        });
      `}} />
    </Base>
  );
};

module.exports = EnterEmail;
