const React = require("react");
const Base = require("./components/Base");
const { BackLink } = require("./components/GovUK");

const CharacterExample = (props) => {
  const { t } = props;
  return (
    <Base {...props}>
      <BackLink href="/welcome" text={t("general.govuk.backLink")} />
      <h1 className="govuk-heading-xl">{t("pages.home.content.header")}</h1>
      <aside>
        <nav>
          <h2 className="govuk-heading-m">{t("pages.home.content.navHeading")}</h2>
          <ol className="govuk-list govuk-list--number">
            <li>{t("pages.home.content.list1")}</li>
          </ol>
        </nav>
      </aside>
      <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
      <script dangerouslySetInnerHTML={{ __html: "localStorage.clear();" }} />
    </Base>
  );
};

module.exports = CharacterExample;
