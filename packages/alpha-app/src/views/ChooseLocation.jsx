const React = require("react");
const Base = require("./components/Base");
const { BackLink, Select, Button } = require("./components/GovUK");

const ChooseLocation = (props) => {
  const { t, showError } = props;
  return (
    <Base {...props}>
      <BackLink href="/service-description" text={t("general.govuk.backLink")} />
      <form method="post" id="chooseLocationForm">
        <Select
          id="choose-location"
          name="chooseLocation"
          label={t("pages.chooseLocation.content.header")}
          hint={t("pages.chooseLocation.content.hint")}
          errorMessage={showError ? t("pages.chooseLocation.content.errors.validationError") : undefined}
          items={[
            { value: "", text: t("pages.chooseLocation.content.options.chooseLocation"), selected: true },
            { value: "East Midlands", text: t("pages.chooseLocation.content.options.eastMidlands") },
            { value: "East of England", text: t("pages.chooseLocation.content.options.eastEngland") },
            { value: "London", text: t("pages.chooseLocation.content.options.london") },
            { value: "North East", text: t("pages.chooseLocation.content.options.northEast") },
            { value: "North West", text: t("pages.chooseLocation.content.options.northWest") },
            { value: "South East", text: t("pages.chooseLocation.content.options.southEast") },
            { value: "South West", text: t("pages.chooseLocation.content.options.southWest") },
            { value: "West Midlands", text: t("pages.chooseLocation.content.options.westMidlands") },
            { value: "Yorkshire and the Humber", text: t("pages.chooseLocation.content.options.yorkshireAndHumber") },
          ]}
        />
        <Button text={t("general.buttons.continue")} />
      </form>
      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener("DOMContentLoaded", function () {
          const storedChooseLocation = localStorage.getItem("chooseLocation");
          const dropdownToSelect = document.getElementById("choose-location");
          if (storedChooseLocation) { dropdownToSelect.value = storedChooseLocation; }
        });
        document.getElementById("chooseLocationForm").addEventListener("submit", function (event) {
          event.preventDefault();
          const chooseLocation = document.getElementById("choose-location").value;
          localStorage.setItem("chooseLocation", chooseLocation);
          const urlParams = new URLSearchParams(window.location.search);
          const editQuery = urlParams.get("edit") === "true" ? "?edit=true" : "";
          document.getElementById("chooseLocationForm").action = "/validate-choose-location" + editQuery;
          this.submit();
        });
      `}} />
    </Base>
  );
};

module.exports = ChooseLocation;
