@v1
Feature: Form Error events are pushed to the data layer for GA4 when analytics package detects an form error message in the page

Scenario: GA4 form error event is pushed when user submits a form without to fill the radio button field
  Given I visit the welcome page
  And I accept analytics cookies
  And I visit the organisation-type page
  And I submit the form
  Then The dataLayer includes the form error event into organisation type error page

Scenario: GA4 form error event is pushed when user submits a form without to fill the checkbox field
  Given I visit the welcome page
  And I accept analytics cookies
  And I visit the help-with-hint page
  And I submit the form
  Then The dataLayer includes the form error event into help with hint error page

Scenario: GA4 form error event is pushed when user submits a form without to fill the textarea field
  Given I visit the welcome page
  And I accept analytics cookies
  And I visit the service-description page
  And I submit the form
  Then The dataLayer includes the form error event into service description error page

Scenario: GA4 form error event is pushed when user submits a form without to fill the dropdown field
  Given I visit the welcome page
  And I accept analytics cookies
  And I visit the choose-location page
  And I submit the form
  Then The dataLayer includes the form error event into choose location error page

Scenario: GA4 form error event is pushed when user submits a form without to fill the text field
  Given I visit the welcome page
  And I accept analytics cookies
  And I visit the enter-email page
  And I submit the form
  Then The dataLayer includes the form error event into enter email error page