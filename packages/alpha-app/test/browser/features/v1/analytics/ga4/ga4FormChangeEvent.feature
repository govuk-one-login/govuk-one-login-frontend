@v1
Feature: Form change events are pushed to the data layer for GA4 when user decides to change his answer

Scenario: GA4 form change event is pushed when user wants to edit one of the answers
  Given I visit the welcome page
  And I accept analytics cookies
  And I edit the organisation-type page
  Then The dataLayer includes the form change event