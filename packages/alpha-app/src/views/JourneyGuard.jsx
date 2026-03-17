const React = require("react");
const Base = require("./components/Base");

const JourneyGuard = (props) => (
  <Base {...props}>
    <h1 className="govuk-heading-l">{props.t("pages.journeyGuard.content.header")}</h1>
    <p className="govuk-body" dangerouslySetInnerHTML={{ __html: props.t("pages.journeyGuard.content.paragraph1") }} />
  </Base>
);

module.exports = JourneyGuard;
