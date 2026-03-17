const React = require("react");
const {
  addLanguageParam,
  contactUsUrl,
} = require("@govuk-one-login/frontend-ui");

const GovUKLogo = () => (
  <svg
    focusable="false"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 148 30"
    height="30"
    width="148"
    fill="currentcolor"
    aria-label="GOV.UK"
    className="govuk-header__logotype"
  >
    <title>GOV.UK</title>
    <path d="M22.6 10.4c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4m-5.9 6.7c-.9.4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4m17.8-1.7c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s.1 2 1 2.4m5.9 6.7c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s.1 2 1 2.4m-9.1 2.8c4.3-.5 6.4-4.4 6.4-4.4s-1.3 1-3.6 1.3c.5-1.5 2.4-5.1 2.4-5.1s-2.3 1.2-4.8 3.2c.1-3.1.5-6.7 5.8-7.2 3.7-.3 6.7 1.5 7 3.8.4 2.6-2 4.3-3.7 1.6-1.4-4.5 2.4-6.1 4.9-3.2-1.9-4.5-1.8-7.7 2.4-10.9 3 4 2.6 7.3-1.2 11.1 2.4-1.3 6.2 0 4 4.6-1.2-2.8-3.7-2.2-4.2.2-.3 1.7.7 3.7 3 4.2 1.9.3 4.7-.9 7-5.9-1.3 0-2.4.7-3.9 1.7l2.4-8c.6 2.3 1.4 3.7 2.2 4.5.6-1.6.5-2.8 0-5.3l5 1.8c-2.6 3.6-5.2 8.7-7.3 17.5-7.4-1.1-15.7-1.7-24.5-1.7s-17.1.6-24.5 1.7C1.7 24.8-.9 19.7-3.5 16.1l5-1.8c-.5 2.5-.6 3.7 0 5.3.8-.8 1.6-2.3 2.2-4.5l2.4 8c-1.5-1-2.6-1.7-3.9-1.7 2.3 5 5.2 6.2 7 5.9 2.3-.4 3.3-2.4 3-4.2-.5-2.4-3-3.1-4.2-.2-2.2-4.6 1.6-6 4-4.6-3.7-3.7-4.2-7.1-1.2-11.1 4.2 3.2 4.3 6.4 2.4 10.9 2.5-2.8 6.3-1.3 4.9 3.2-1.8-2.7-4.1-1-3.7 1.6.3 2.3 3.3 4.1 7 3.8 5.4-.5 5.7-4.2 5.8-7.2-1.3-.2-3.7 1-5.7 3.8l-.7-8.5c2.2 2.3 4.2 2.7 6.4 2.8-.7-2.3-4.1-6.1-4.1-6.1h10.6z" />
  </svg>
);

const SkipLink = ({ title }) => (
  <a
    href="#main-content"
    className="govuk-skip-link"
    role="button"
    aria-label={title}
  >
    {title}
  </a>
);

const CookieBanner = ({ cb }) => (
  <div className="govuk-cookie-banner" data-nosnippet aria-label={cb.ariaLabel}>
    <div
      className="govuk-cookie-banner__message govuk-width-container"
      id="cookies-banner-main"
    >
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-cookie-banner__heading govuk-heading-m">
            {cb.headingText}
          </h2>
          <div className="govuk-cookie-banner__content">
            <p className="govuk-body">{cb.body1}</p>
            <p className="govuk-body">{cb.body2}</p>
          </div>
        </div>
      </div>
      <div className="govuk-button-group">
        <button
          type="button"
          name="cookiesAccept"
          value="accept"
          className="govuk-button"
          data-module="govuk-button"
          aria-label={cb.acceptAdditionalCookies}
        >
          {cb.acceptAdditionalCookies}
        </button>
        <button
          type="button"
          name="cookiesReject"
          value="reject"
          className="govuk-button"
          data-module="govuk-button"
          aria-label={cb.rejectAdditionalCookies}
        >
          {cb.rejectAdditionalCookies}
        </button>
        <a
          className="govuk-link"
          href="https://signin.account.gov.uk/cookies"
          aria-label={cb.viewCookies}
        >
          {cb.viewCookies}
        </a>
      </div>
    </div>
    <div
      className="govuk-cookie-banner__message govuk-width-container"
      id="cookies-accepted"
      hidden
    >
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <div className="govuk-cookie-banner__content">
            <p className="govuk-body">
              {cb.cookieBannerAccept.body1}
              <a
                className="govuk-link"
                href="https://signin.account.gov.uk/cookies"
              >
                {cb.changeCookiePreferencesLink}
              </a>
              {cb.cookieBannerAccept.body2}
            </p>
          </div>
        </div>
      </div>
      <div className="govuk-button-group">
        <button
          type="button"
          className="govuk-button cookie-hide-button"
          data-module="govuk-button"
          aria-label={cb.hideCookieMessage}
        >
          {cb.hideCookieMessage}
        </button>
      </div>
    </div>
    <div
      className="govuk-cookie-banner__message govuk-width-container"
      id="cookies-rejected"
      hidden
    >
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <div className="govuk-cookie-banner__content">
            <p className="govuk-body">
              {cb.cookieBannerReject.body1}
              <a
                className="govuk-link"
                href="https://signin.account.gov.uk/cookies"
              >
                {cb.changeCookiePreferencesLink}
              </a>
              {cb.cookieBannerReject.body2}
            </p>
          </div>
        </div>
      </div>
      <div className="govuk-button-group">
        <button
          type="button"
          className="govuk-button cookie-hide-button"
          data-module="govuk-button"
          aria-label={cb.hideCookieMessage}
        >
          {cb.hideCookieMessage}
        </button>
      </div>
    </div>
  </div>
);

const Header = ({ header, signOutLink }) => (
  <header className="govuk-header" data-module="govuk-header">
    <div className="frontendUi_header__signOut govuk-header__container govuk-width-container">
      <div className="govuk-header__logo">
        <a
          href="https://www.gov.uk/"
          className="govuk-header__link govuk-header__link--homepage"
        >
          <GovUKLogo />
        </a>
      </div>
      <div className="frontendUi-header__content govuk-header__content">
        <nav aria-label={header.ariaLabel} className="govuk-header__navigation">
          <ul
            id="navigation"
            className="frontendUi_header__signOut govuk-header__navigation-list"
          >
            <li className="frontendUi_header_signOut-item govuk-header__navigation-item">
              <a
                aria-label={header.signOutAriaLabel}
                className="govuk-header__link"
                href={signOutLink}
              >
                {header.signOut}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
);

const PhaseBanner = ({ phaseBanner, contactUrl, currentUrl }) => (
  <div role="region" className="govuk-phase-banner">
    <p className="govuk-phase-banner__content">
      <strong className="govuk-tag govuk-phase-banner__content__tag">
        {phaseBanner.tag}
      </strong>
      <span className="govuk-phase-banner__text">
        {phaseBanner.text}
        <a
          className="govuk-link"
          rel="noopener"
          target="_blank"
          href={contactUsUrl(contactUrl, currentUrl?.toString())}
        >
          {phaseBanner.link}
        </a>
        .
      </span>
    </p>
  </div>
);

const LanguageSelect = ({ languageSelect, currentUrl, activeLanguage }) => {
  const languages = [
    { code: "en", text: "English", visuallyHidden: "Change to English" },
    {
      code: "cy",
      text: "Cymraeg",
      visuallyHidden: "Newid yr iaith ir Gymraeg",
    },
  ];
  return (
    <nav
      className="language-select"
      aria-label={languageSelect.ariaLabel}
      role="navigation"
    >
      <ul
        className="govuk-list language-select__list govuk-body-s govuk-!-margin-0"
        role="list"
      >
        {languages.map((lang) => (
          <li
            key={lang.code}
            className="language-select__list-item"
            role="listitem"
          >
            {activeLanguage === lang.code ? (
              <span aria-current="true">{lang.text}</span>
            ) : (
              <a
                className="govuk-link govuk-link--no-visited-state"
                href={addLanguageParam(lang.code, currentUrl)}
                rel="alternate"
                hrefLang={lang.code}
                lang={lang.code}
                role="link"
              >
                {lang.text}
                <div className="govuk-visually-hidden">
                  {lang.visuallyHidden}
                </div>
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

const Footer = ({ footer }) => (
  <footer className="govuk-footer" aria-label="footer">
    <div className="govuk-width-container">
      <div className="govuk-footer__meta">
        <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
          <h2 className="govuk-visually-hidden">
            {footer.navItemHiddenHeader}
          </h2>
          <ul className="govuk-footer__inline-list">
            {footer.footerNavItems.map((item, i) => (
              <li key={i} className="govuk-footer__inline-list-item">
                <a
                  className="govuk-footer__link"
                  href={item.href}
                  {...(item.attributes ?? {})}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
          <div
            className="govuk-footer__meta-custom"
            dangerouslySetInnerHTML={{ __html: footer.contentLicence.html }}
          />
        </div>
        <div className="govuk-footer__meta-item">
          <a
            className="govuk-footer__link govuk-footer__copyright-logo"
            href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/"
          >
            {footer.copyright.text}
          </a>
        </div>
      </div>
    </div>
  </footer>
);

const Ga4OnPageLoad = ({
  contentId,
  englishPageTitle,
  statusCode,
  taxonomyLevel1,
  taxonomyLevel2,
}) => (
  <script
    dangerouslySetInnerHTML={{
      __html: `
    function trackOnPageLoad() {
      window.DI.analyticsGa4.pageViewTracker.trackOnPageLoad({
        statusCode: '${statusCode}',
        englishPageTitle: '${englishPageTitle}',
        taxonomy_level1: '${taxonomyLevel1}',
        taxonomy_level2: '${taxonomyLevel2}',
        content_id: '${contentId}',
        dynamic: false,
        logged_in_status: false
      });
    }
    window.addEventListener('load', trackOnPageLoad);
    window.addEventListener('cookie-consent', trackOnPageLoad);
  `,
    }}
  />
);

const Base = ({
  children,
  translations,
  htmlLang,
  currentUrl,
  ga4ContainerId,
  contentId,
  englishPageTitle,
  statusCode,
  taxonomyLevel1,
  taxonomyLevel2,
}) => {
  const t = translations.translation;
  return (
    <html lang={htmlLang} className="govuk-template">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/stylesheets/govuk-frontend.css" />
        <link rel="stylesheet" href="/stylesheets/frontendUi.css" />
      </head>
      <body className="govuk-template__body">
        <SkipLink title={t.skipLink.title} />
        <CookieBanner cb={t.cookieBanner} />
        <Header
          header={t.header}
          signOutLink="https://signin.account.gov.uk/signed-out"
        />
        <div className="govuk-width-container">
          <PhaseBanner
            phaseBanner={t.phaseBanner}
            contactUrl="https://signin.account.gov.uk/contact-us"
            currentUrl={currentUrl}
          />
          <LanguageSelect
            languageSelect={t.languageSelect}
            currentUrl={currentUrl}
            activeLanguage={htmlLang}
          />
          <main
            id="main-content"
            className="govuk-main-wrapper govuk-!-padding-top-3"
          >
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-two-thirds">{children}</div>
            </div>
          </main>
        </div>
        <Footer footer={t.footer} />
        <script type="module" src="/javascript/index.js" />
        <script src="/ga4-assets/analytics.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.DI.appInit({"ga4ContainerId":"${ga4ContainerId}"},{"isDataSensitive":false,"isPageDataSensitive":false,"enableGa4Tracking":true,"enableUaTracking":false,"cookieDomain":"localhost","logLevel":"debug"});`,
          }}
        />
        <Ga4OnPageLoad
          contentId={contentId}
          englishPageTitle={englishPageTitle}
          statusCode={statusCode}
          taxonomyLevel1={taxonomyLevel1}
          taxonomyLevel2={taxonomyLevel2}
        />
        <script type="module" src="/fingerprint/index.js" />
        <script
          type="module"
          dangerouslySetInnerHTML={{
            __html: `import { setFingerprintCookie, setLogLevel } from "/fingerprint/index.js"; setFingerprintCookie('localhost'); setLogLevel("silent");`,
          }}
        />
      </body>
    </html>
  );
};

module.exports = Base;
