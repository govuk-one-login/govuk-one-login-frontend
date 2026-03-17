const React = require("react");
const Base = require("./components/Base");
const { ProgressButton } = require("./components/GovUK");

const TestProgressButton = (props) => (
  <Base {...props}>
    <div className="govuk-grid-row">
      <h1 className="govuk-heading-l">Test Progress Button</h1>
      <form method="post" id="myForm" action="/api/test-submit-button" noValidate>
        <input type="text" style={{ marginBottom: "10px" }} />
        <ProgressButton translations={props.translations} errorPage="/error" customDevErrorTimeout={10000} />
      </form>
      <h1 className="govuk-heading-l">Non Form Button</h1>
      <ProgressButton translations={props.translations} href="#" errorPage="/error" />
    </div>
  </Base>
);

module.exports = TestProgressButton;
