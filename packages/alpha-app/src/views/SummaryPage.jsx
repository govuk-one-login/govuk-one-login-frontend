const React = require("react");
const Base = require("./components/Base");
const { BackLink, SummaryList } = require("./components/GovUK");

const SummaryPage = (props) => {
  const { t } = props;
  return (
    <Base {...props}>
      <BackLink href="/enter-email" text={t("general.govuk.backLink")} />
      <h1 className="govuk-heading-l govuk-!-margin-bottom-5">Check answers</h1>
      <SummaryList rows={[
        {
          key: { text: t("pages.organisationType.content.header") },
          value: { html: '<div id="organisationTypeContainer"></div>' },
          actions: { items: [{ href: "/organisation-type?edit=true", text: t("pages.summaryPage.content.changeLink"), visuallyHiddenText: "organisationType" }] },
        },
        {
          key: { text: t("pages.helpWithHint.content.header") },
          value: { html: '<div id="helpWithHintContainer"></div>' },
          actions: { items: [{ href: "/help-with-hint?edit=true", text: t("pages.summaryPage.content.changeLink"), visuallyHiddenText: "helpWithHint" }] },
        },
        {
          key: { text: t("pages.serviceDescription.content.header") },
          value: { html: '<div id="serviceDescriptionContainer"></div>' },
          actions: { items: [{ href: "/service-description?edit=true", text: t("pages.summaryPage.content.changeLink"), visuallyHiddenText: "Service description" }] },
        },
        {
          key: { text: t("pages.chooseLocation.content.header") },
          value: { html: '<div id="chooseLocationContainer"></div>' },
          actions: { items: [{ href: "/choose-location?edit=true", text: t("pages.summaryPage.content.changeLink"), visuallyHiddenText: "Choose location" }] },
        },
        {
          key: { text: t("pages.enterEmail.content.header") },
          value: { html: '<div id="enterEmailContainer"></div>' },
          actions: { items: [{ href: "/enter-email?edit=true", text: t("pages.summaryPage.content.changeLink"), visuallyHiddenText: "Enter email" }] },
        },
      ]} />
      <script dangerouslySetInnerHTML={{ __html: `
        document.getElementById("organisationTypeContainer").textContent = localStorage.getItem("organisationType");
        const storedHelpWithHints = localStorage.getItem("helpWithHint");
        if (storedHelpWithHints) {
          document.getElementById("helpWithHintContainer").innerHTML = storedHelpWithHints.split("/").map((el) => el + "</br>").join("");
        }
        document.getElementById("serviceDescriptionContainer").textContent = localStorage.getItem("serviceDescription");
        document.getElementById("chooseLocationContainer").textContent = localStorage.getItem("chooseLocation");
        document.getElementById("enterEmailContainer").textContent = localStorage.getItem("enterEmail");
      `}} />
    </Base>
  );
};

module.exports = SummaryPage;
