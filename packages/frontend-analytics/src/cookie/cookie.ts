declare global {
  interface Window {
    dtrum?: {
      enable: () => void;
      disable: () => void;
    };
  }
}

export class Cookie {
  public consent: boolean = false;
  public hasCookie: boolean = false;
  public COOKIES_PREFERENCES_SET = "cookies_preferences_set";
  public cookiesAccepted = document.getElementById("cookies-accepted");
  public cookiesRejected = document.getElementById("cookies-rejected");
  public hideCookieBanner =
    document.getElementsByClassName("cookie-hide-button");
  public cookieBannerContainer: HTMLCollectionOf<Element> =
    document.getElementsByClassName("govuk-cookie-banner");
  public cookieBanner = document.getElementById("cookies-banner-main");
  public acceptCookies = document.getElementsByName("cookiesAccept");
  public rejectCookies = document.getElementsByName("cookiesReject");
  cookieDomain: string;
  HIDDEN_CLASS = "govuk-!-display-none";
  SHOWN_CLASS = "govuk-!-display-block";

  constructor(cookieDomain: string | undefined) {
    this.initialise();
    this.cookieDomain = cookieDomain || "account.gov.uk";
  }

  /**
   * Initializes the object and performs necessary setup.
   */
  initialise(): void {
    // Check if a cookie preference has been set
    const savedCookiePreference = Cookie.getCookie(
      this.COOKIES_PREFERENCES_SET,
    );
    if (savedCookiePreference) {
      this.consent = this.hasConsentForAnalytics();
      this.initDynatrace(this.consent);
      this.hideElement(this.cookieBannerContainer[0] as HTMLElement);
    } else {
      // add event listeners
      this.acceptCookies[0]?.addEventListener(
        "click",
        this.handleAcceptClickEvent.bind(this),
      );
      this.rejectCookies[0]?.addEventListener(
        "click",
        this.handleRejectClickEvent.bind(this),
      );

      const hideButtons = Array.prototype.slice.call(this.hideCookieBanner);
      hideButtons.forEach((hideButton) => {
        hideButton.addEventListener(
          "click",
          this.handleHideButtonClickEvent.bind(this),
        );
      });

      this.showElement(this.cookieBannerContainer[0] as HTMLElement);
    }

    if (!this.consent) {
      window.addEventListener(
        "cookie-consent",
        () => {
          const newConsent = this.hasConsentForAnalytics();
          this.initDynatrace(newConsent);
        },
        { once: true },
      );
    }
  }

  /**
   * Handles the click event when the accept button is clicked.
   *
   * @param {Event} event - The click event.
   */
  handleAcceptClickEvent(event: Event): void {
    event.preventDefault();
    this.setBannerCookieConsent(true, this.cookieDomain);
    this.consent = true;
    window.DI.analyticsGa4.loadGtmScript();
  }

  /**
   * Handles the click event when the reject button is clicked.
   *
   * @param {Event} event - The click event object.
   */
  handleRejectClickEvent(event: Event): void {
    event.preventDefault();
    this.consent = false;
    this.setBannerCookieConsent(false, this.cookieDomain);
  }

  /**
   * Handles the click event of the hide button.
   *
   * @param {Event} event - The click event.
   */
  handleHideButtonClickEvent(event: Event): void {
    event.preventDefault();
    this.hideElement(this.cookieBannerContainer[0] as HTMLElement);
  }

  /**
   * Set the banner cookie consent.
   *
   * @param {boolean} analyticsConsent - Whether analytics consent is given or not.
   * @param {string} domain - The domain where the cookie is set.
   */
  setBannerCookieConsent(analyticsConsent: boolean, domain: string): void {
    Cookie.setCookie(
      this.COOKIES_PREFERENCES_SET,
      { analytics: analyticsConsent },
      domain,
      365,
    );

    if (this.cookieBanner) {
      this.hideElement(this.cookieBanner);
    }

    if (analyticsConsent === true) {
      if (this.cookiesAccepted) {
        this.showElement(this.cookiesAccepted);
      }

      const event = new CustomEvent("cookie-consent");
      window.dispatchEvent(event);
    } else if (this.cookiesRejected) {
      this.showElement(this.cookiesRejected);
    }
  }

  /**
   * Checks whether the user has given consent for analytics.
   *
   * @return {boolean} - Returns true if the user has given consent for analytics, false otherwise.
   */
  hasConsentForAnalytics(): boolean {
    const cookieValue = Cookie.getCookie(this.COOKIES_PREFERENCES_SET);

    if (!cookieValue) {
      return false;
    }
    this.hasCookie = true;

    const cookieConsent = JSON.parse(decodeURIComponent(cookieValue));
    return cookieConsent ? cookieConsent.analytics === true : false;
  }

  /**
   * Retrieves the value of a cookie by its name.
   *
   * @param {string} name - The name of the cookie to retrieve.
   * @return {string} The value of the cookie if found, or an empty string if not found.
   */
  static getCookie(name: string): string {
    const nameEQ = `${name}=`;
    if (document.cookie) {
      const cookies = document.cookie.split(";");
      for (let i = 0, len = cookies.length; i < len; i++) {
        let cookie = cookies[i];
        while (cookie.startsWith(" ")) {
          cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.startsWith(nameEQ)) {
          return cookie.substring(nameEQ.length);
        }
      }
    }
    return "";
  }

  /**
   * Sets a cookie with the given name, values, options, and domain.
   *
   * @param {string} name - The name of the cookie.
   * @param {any} values - The values to be stored in the cookie.
   * @param {any} options - The options for the cookie (optional).
   * @param {string} domain - The domain to which the cookie belongs.
   * @return {void} This function does not return a value.
   */
  static setCookie(
    name: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values: any,
    domain: string,
    lifetimeInDays?: number,
  ): void {
    let cookieString = `${name}=${encodeURIComponent(JSON.stringify(values))}`;
    if (lifetimeInDays) {
      const date = new Date();
      date.setTime(date.getTime() + lifetimeInDays * 24 * 60 * 60 * 1000);
      cookieString = `${cookieString}; Expires=${date.toUTCString()}; Path=/; Domain=${domain}`;
    }

    if (document.location.protocol === "https:") {
      cookieString += "; Secure";
    }
    document.cookie = cookieString;
  }

  /**
   * Hides the given HTML element by setting its display property to "none".
   *
   * @param {HTMLElement} element - The HTML element to be hidden.
   */
  hideElement(element: HTMLElement): void {
    if (!element?.classList.contains(this.HIDDEN_CLASS)) {
      element?.classList.add(this.HIDDEN_CLASS);
    }
    if (element?.classList.contains(this.SHOWN_CLASS)) {
      element?.classList.remove(this.SHOWN_CLASS);
    }
  }

  /**
   * Shows the specified HTML element by setting its display property to "block".
   *
   * @param {HTMLElement} element - The element to be shown.
   */
  showElement(element: HTMLElement): void {
    if (element?.classList.contains(this.HIDDEN_CLASS)) {
      element?.classList.remove(this.HIDDEN_CLASS);
    }
    if (!element?.classList.contains(this.SHOWN_CLASS)) {
      element?.classList.add(this.SHOWN_CLASS);
    }
  }

  /**
   * Enables/disables Dynatrace accordingly to the user consent from the cookie.
   * @param {boolean} hasConsentedForAnalytics
   */
  initDynatrace(hasConsentedForAnalytics: boolean): void {
    if (window.dtrum) {
      if (hasConsentedForAnalytics) {
        window.dtrum.enable();
      } else {
        window.dtrum.disable();
      }
    }
  }
}
