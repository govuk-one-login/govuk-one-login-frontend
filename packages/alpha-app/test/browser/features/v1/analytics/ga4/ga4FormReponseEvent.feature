@v1
Feature: Form response events are pushed to the data layer for GA4 when user submit a form


Scenario: GA4 form response event is pushed when user accepts analytics cookies and submits radio buttons form
  Given I visit the welcome page
  And I accept analytics cookies
  And I visit the organisation-type page
  And I set up a listener for the data layer push
  When I select Other option
  And I submit the form
  Then The dataLayer includes the organisation type form response event
  # Then I should not have any automatically detectable accessibility issues

Scenario: GA4 form response event is pushed when user accepts analytics cookies and submits checkboxes form
  Given I visit the welcome page
  And I accept analytics cookies
  And I visit the help-with-hint page
  And I set up a listener for the data layer push
  When I select Other option
  And I submit the form
  Then The dataLayer includes the help with hint form response event
  # Then I should not have any automatically detectable accessibility issues

Scenario: GA4 form response event is pushed when user accepts analytics cookies and submits textarea form
  Given I visit the welcome page
  And I accept analytics cookies
  And I visit the service-description page
  And I set up a listener for the data layer push
  When I fill service-description field
  And I submit the form
  Then The dataLayer includes the service description form response event
  # Then I should not have any automatically detectable accessibility issues

Scenario: GA4 form response event is pushed when user accepts analytics cookies and submits input text form
  Given I visit the welcome page
  And I accept analytics cookies
  And I visit the enter-email page
  And I set up a listener for the data layer push
  When I fill enter-email field
  And I submit the form
  Then The dataLayer includes the enter email form response event
  # Then I should not have any automatically detectable accessibility issues

Scenario: GA4 form response event is pushed when user accepts analytics cookies and submits dropdown form
  Given I visit the welcome page
  And I accept analytics cookies
  And I visit the choose-location page
  And I set up a listener for the data layer push
  When I choose London value
  And I submit the form
  Then The dataLayer includes the choose location form response event
  # Then I should not have any automatically detectable accessibility issues