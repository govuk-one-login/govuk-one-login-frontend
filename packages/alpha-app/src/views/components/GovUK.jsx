const React = require("react");

const BackLink = ({ href, text }) => (
  <div className="govuk-back-link-container">
    <a href={href} className="govuk-back-link">{text}</a>
  </div>
);

const Button = ({ text, href, type = "submit", isStartButton = false, attributes = {} }) => {
  if (href) {
    return (
      <a href={href} role="button" draggable={false} className={`govuk-button${isStartButton ? " govuk-button--start" : ""}`} data-module="govuk-button" {...attributes}>
        {text}
        {isStartButton && (
          <svg className="govuk-button__start-icon" xmlns="http://www.w3.org/2000/svg" width="17.5" height="19" viewBox="0 0 33 40" aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
          </svg>
        )}
      </a>
    );
  }
  return (
    <button type={type} className="govuk-button" data-module="govuk-button" {...attributes}>
      {text}
    </button>
  );
};

const Input = ({ id, name, label, errorMessage }) => (
  <div className={`govuk-form-group${errorMessage ? " govuk-form-group--error" : ""}`}>
    <h1 className="govuk-label-wrapper">
      <label className="govuk-label govuk-label--l" htmlFor={id}>{label}</label>
    </h1>
    {errorMessage && <p id={`${id}-error`} className="govuk-error-message"><span className="govuk-visually-hidden">Error:</span> {errorMessage}</p>}
    <input
      className={`govuk-input${errorMessage ? " govuk-input--error" : ""}`}
      id={id}
      name={name}
      type="text"
      aria-describedby={errorMessage ? `${id}-error` : undefined}
    />
  </div>
);

const Textarea = ({ id, name, label, hint, errorMessage }) => (
  <div className={`govuk-form-group${errorMessage ? " govuk-form-group--error" : ""}`}>
    <h1 className="govuk-label-wrapper">
      <label className="govuk-label govuk-label--l" htmlFor={id}>{label}</label>
    </h1>
    {hint && <div id={`${id}-hint`} className="govuk-hint">{hint}</div>}
    {errorMessage && <p id={`${id}-error`} className="govuk-error-message"><span className="govuk-visually-hidden">Error:</span> {errorMessage}</p>}
    <textarea
      className={`govuk-textarea${errorMessage ? " govuk-textarea--error" : ""}`}
      id={id}
      name={name}
      rows={5}
      aria-describedby={[hint && `${id}-hint`, errorMessage && `${id}-error`].filter(Boolean).join(" ") || undefined}
    />
  </div>
);

const Radios = ({ name, id, legend, items, errorMessage }) => (
  <div className={`govuk-form-group${errorMessage ? " govuk-form-group--error" : ""}`}>
    <fieldset className="govuk-fieldset" aria-describedby={errorMessage ? `${id}-error` : undefined}>
      <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
        <h1 className="govuk-fieldset__heading">{legend}</h1>
      </legend>
      {errorMessage && <p id={`${id}-error`} className="govuk-error-message"><span className="govuk-visually-hidden">Error:</span> {errorMessage}</p>}
      <div className="govuk-radios" data-module="govuk-radios">
        {items.map((item) => (
          <div key={item.value} className="govuk-radios__item">
            <input className="govuk-radios__input" id={`${id}-${item.value}`} name={name} type="radio" value={item.value} />
            <label className="govuk-label govuk-radios__label" htmlFor={`${id}-${item.value}`}>{item.text}</label>
          </div>
        ))}
      </div>
    </fieldset>
  </div>
);

const Checkboxes = ({ name, legend, hint, items, errorMessage }) => {
  const groupId = `${name}-group`;
  return (
    <div className={`govuk-form-group${errorMessage ? " govuk-form-group--error" : ""}`}>
      <fieldset className="govuk-fieldset" aria-describedby={[hint && `${groupId}-hint`, errorMessage && `${groupId}-error`].filter(Boolean).join(" ") || undefined}>
        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
          <h1 className="govuk-fieldset__heading">{legend}</h1>
        </legend>
        {hint && <div id={`${groupId}-hint`} className="govuk-hint">{hint}</div>}
        {errorMessage && <p id={`${groupId}-error`} className="govuk-error-message"><span className="govuk-visually-hidden">Error:</span> {errorMessage}</p>}
        <div className="govuk-checkboxes" data-module="govuk-checkboxes">
          {items.map((item) => (
            <div key={item.value} className="govuk-checkboxes__item">
              <input className="govuk-checkboxes__input" id={`${name}-${item.value}`} name={name} type="checkbox" value={item.value} />
              <label className="govuk-label govuk-checkboxes__label" htmlFor={`${name}-${item.value}`}>{item.text}</label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
};

const Select = ({ id, name, label, hint, items, errorMessage }) => (
  <div className={`govuk-form-group${errorMessage ? " govuk-form-group--error" : ""}`}>
    <h1 className="govuk-label-wrapper">
      <label className="govuk-label govuk-label--l" htmlFor={id}>{label}</label>
    </h1>
    {hint && <div id={`${id}-hint`} className="govuk-hint">{hint}</div>}
    {errorMessage && <p id={`${id}-error`} className="govuk-error-message"><span className="govuk-visually-hidden">Error:</span> {errorMessage}</p>}
    <select
      className={`govuk-select${errorMessage ? " govuk-select--error" : ""}`}
      id={id}
      name={name}
      aria-describedby={[hint && `${id}-hint`, errorMessage && `${id}-error`].filter(Boolean).join(" ") || undefined}
    >
      {items.map((item) => (
        <option key={item.value} value={item.value} defaultValue={item.selected ? item.value : undefined}>
          {item.text}
        </option>
      ))}
    </select>
  </div>
);

const InsetText = ({ text }) => (
  <div className="govuk-inset-text">{text}</div>
);

const SummaryList = ({ rows }) => (
  <dl className="govuk-summary-list">
    {rows.map((row, i) => (
      <div key={i} className="govuk-summary-list__row">
        <dt className="govuk-summary-list__key">{row.key.text}</dt>
        <dd className="govuk-summary-list__value" dangerouslySetInnerHTML={row.value.html ? { __html: row.value.html } : undefined}>
          {!row.value.html ? row.value.text : undefined}
        </dd>
        {row.actions && (
          <dd className="govuk-summary-list__actions">
            {row.actions.items.map((action, j) => (
              <a key={j} href={action.href} className="govuk-link">
                {action.text}
                {action.visuallyHiddenText && <span className="govuk-visually-hidden"> {action.visuallyHiddenText}</span>}
              </a>
            ))}
          </dd>
        )}
      </div>
    ))}
  </dl>
);

const Pagination = ({ next }) => (
  <nav className="govuk-pagination" aria-label="Pagination">
    <div className="govuk-pagination__next">
      <a className="govuk-link govuk-pagination__link" href={next.href} rel="next">
        <svg className="govuk-pagination__icon govuk-pagination__icon--next" xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13">
          <path d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7246z" />
        </svg>
        <span className="govuk-pagination__link-title">{next.labelText}</span>
      </a>
    </div>
  </nav>
);

const ProgressButton = ({ translations, href, errorPage, customDevErrorTimeout }) => {
  const pb = translations?.translation?.progressButton;
  if (!pb) return null;
  const commonProps = {
    className: "govuk-button govuk-button--progress",
    "data-module": "govuk-button",
    "data-frontendui": "di-progress-button",
    "data-waiting-text": pb.waitingText,
    "data-long-waiting-text": pb.longWaitingText,
    "data-error-page": errorPage ?? "#",
    ...(customDevErrorTimeout ? { "data-error-timeout": customDevErrorTimeout } : {}),
  };
  return (
    <div className="noscript">
      <noscript>
        <div className="govuk-body">{pb.noJavascriptMessage}</div>
      </noscript>
      {href
        ? <a href={href} role="button" draggable={false} {...commonProps}>{pb.text}</a>
        : <button type="submit" {...commonProps}>{pb.text}</button>
      }
    </div>
  );
};

module.exports = { BackLink, Button, Input, Textarea, Radios, Checkboxes, Select, InsetText, SummaryList, Pagination, ProgressButton };
