const React = require("react");
const Base = require("./components/Base");
const { Button, InsetText, Pagination } = require("./components/GovUK");

const Home = (props) => {
  const { t } = props;
  return (
    <Base {...props}>
      <h1 className="govuk-heading-xl">{t("pages.home.content.header")}</h1>
      <aside>
        <nav>
          <h2 className="govuk-heading-m">{t("pages.home.content.navHeading")}</h2>
          <ol className="govuk-list govuk-list--number">
            <li>{t("pages.home.content.list1")}</li>
            <li><a href="/service-description" className="govuk-link">{t("pages.home.content.list2")}</a></li>
            <li><a href="https://apps.apple.com/gb/app/gov-uk-id-check/id1629050566" className="govuk-link">{t("pages.home.content.list3")}</a></li>
          </ol>
        </nav>
      </aside>
      <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
      <h1 className="govuk-heading-l">{t("pages.home.content.subheading1")}</h1>
      <p className="govuk-body">{t("pages.home.content.paragraph1")}</p>
      <p className="govuk-body" dangerouslySetInnerHTML={{ __html: t("pages.home.content.paragraph2") }} />
      <p className="govuk-body">{t("pages.home.content.paragraph3")}</p>
      <p className="govuk-body" dangerouslySetInnerHTML={{ __html: t("pages.home.content.paragraph4") }} />
      <InsetText text={t("pages.home.content.insetText")} />
      <p className="govuk-body">{t("pages.home.content.paragraph5")}</p>
      <ul className="govuk-list govuk-list--bullet">
        <li>{t("pages.home.content.list4")}</li>
        <li>{t("pages.home.content.list5")}</li>
        <li>{t("pages.home.content.list6")}</li>
      </ul>
      <details className="govuk-details">
        <summary className="govuk-details__summary"><span className="govuk-details__summary-text">First Details Component</span></summary>
        <div className="govuk-details__text">We need to know your nationality so we can work out which elections you're entitled to vote in. If you cannot provide your nationality, you'll have to send copies of identity documents through the post.</div>
      </details>
      <details className="govuk-details">
        <summary className="govuk-details__summary"><span className="govuk-details__summary-text">Second Details Component</span></summary>
        <div className="govuk-details__text">We need to know your nationality so we can work out which elections you're entitled to vote in. If you cannot provide your nationality, you'll have to send copies of identity documents through the post.</div>
      </details>
      <Button text={t("general.buttons.startNow")} href="/organisation-type" isStartButton attributes={{ "data-nav": true, "data-link": "undefined" }} />
      <h2 className="govuk-heading-m">{t("pages.home.content.subheading2")}</h2>
      <p className="govuk-body" dangerouslySetInnerHTML={{ __html: t("pages.home.content.paragraph6") }} />
      <Pagination next={{ labelText: t("pages.home.content.pagination.text"), href: "#" }} />
      <div>
        <a href="#" className="govuk-link govuk-link--no-visited-state govuk-body">{t("pages.home.content.printGuideLinkText")}</a>
      </div>
      <script dangerouslySetInnerHTML={{ __html: "localStorage.clear();" }} />
    </Base>
  );
};

module.exports = Home;
