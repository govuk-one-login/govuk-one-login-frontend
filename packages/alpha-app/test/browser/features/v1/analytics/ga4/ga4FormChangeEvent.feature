@v1
Feature: Form change events are pushed to the data layer for GA4 when user decides to change his answer

Scenario: GA4 form change event is pushed when user wants to edit one of the answers
 Given I visit the welcome page
 And I accept analytics cookies
 And I visit the organisation-type page
 And I select Other option
 And I submit the form
 And I visit the help-with-hint page
 And I select Other option
 And I submit the form
 And I visit the service-description page
 And I fill service-description field
 And I submit the form
 And I visit the enter-email page
 And I fill enter-email field
 And I submit the form
 And I visit the choose-location page
 And I choose London value
 And I submit the form
 And I visit the summary-page page
 And I set up a listener for the data layer push
 When I click the Change link to return to the organisation page
 And I edit the organisation-type page
 Then The dataLayer includes the form change event