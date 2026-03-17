const React = require("react");
const Base = require("./components/Base");

const Spinner = (props) => (
  <Base {...props}>
    <div id="spinner-container" data-ms-before-informing-of-long-wait="4000" data-ms-before-abort="9000" data-ms-between-dom-update="1000" data-ms-between-requests="3000">
      <div id="no-js-content"><p className="centre govuk-body">JS is disabled</p></div>
      <div id="wait-content" style={{ display: "none" }}><p className="centre govuk-body">Waiting</p></div>
      <div id="long-wait-content" style={{ display: "none" }}><p className="centre govuk-body">Still waiting</p></div>
      <div id="success-content" style={{ display: "none" }}><p className="centre govuk-body">Success!</p></div>
      <div id="error-content" style={{ display: "none" }}><p className="centre govuk-body">Error :(</p></div>
    </div>
  </Base>
);

module.exports = Spinner;
