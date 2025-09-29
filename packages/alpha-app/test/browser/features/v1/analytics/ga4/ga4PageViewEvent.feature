@v1
Feature: Page view events are pushed to the data layer for GA4 when user consents

Scenario: GA4 page view event is not pushed when user has neither accepted nor rejected analytics cookies
  Given I visit the welcome page
  Then The google tag manager script is not loaded
  Then I should not have any automatically detectable accessibility issues

Scenario: GA4 page view event is not pushed when user rejects analytics cookies
  Given I visit the welcome page
  When I reject analytics cookies
  Then The google tag manager script is not loaded
  Then I should not have any automatically detectable accessibility issues

Scenario: GA4 page view event is pushed when welcome page is visited
  Given I visit the welcome page
  And I accept analytics cookies
  When I refresh the page
  Then The dataLayer includes the welcome page view event
  Then I should not have any automatically detectable accessibility issues

Scenario: GA4 page view event is pushed when organisation type page is visited
  Given I visit the organisation-type page
  And I accept analytics cookies
  When I refresh the page
  Then The dataLayer includes the organisation type page view event
  Then I should not have any automatically detectable accessibility issues

Scenario: GA4 page view event is pushed when help with hint is visited
  Given I visit the help-with-hint page
  And I accept analytics cookies
  When I refresh the page
  Then The dataLayer includes the help with hint page view event
  Then I should not have any automatically detectable accessibility issues

Scenario: GA4 page view event is pushed when service description page is visited
  Given I visit the service-description page
  And I accept analytics cookies
  When I refresh the page
  Then The dataLayer includes the service description page view event
  Then I should not have any automatically detectable accessibility issues

Scenario: GA4 page view event is pushed when choose location page is visited
  Given I visit the choose-location page
  And I accept analytics cookies
  When I refresh the page
  Then The dataLayer includes the choose location page view event
  Then I should not have any automatically detectable accessibility issues

Scenario: GA4 page view event is pushed when enter email page is visited
  Given I visit the enter-email page
  And I accept analytics cookies
  When I refresh the page
  Then The dataLayer includes the choose enter email page view event
  Then I should not have any automatically detectable accessibility issues

Scenario: GA4 page view event is pushed when summary page is visited
  Given I visit the summary-page page
  And I accept analytics cookies
  When I refresh the page
  Then The dataLayer includes the summary page view event
  Then I should not have any automatically detectable accessibility issues