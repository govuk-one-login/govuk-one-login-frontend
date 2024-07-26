@v1
Feature: Navigation events are pushed to the data layer for GA4 when user clicks on navigation link or button

Scenario: GA4 navigation button event is pushed when user clicks on the link button
  Given I visit the welcome page
  And I accept analytics cookies
  And I set up a listener for the data layer push
  When I click Start Now link
  Then The dataLayer includes the navigation button event

Scenario: GA4 navigation inbound link event is pushed when user clicks on the inbound link
  Given I visit the welcome page
  And I accept analytics cookies
  And I set up a listener for the data layer push
  When I click Test Inbound Link link
  Then The dataLayer includes the navigation inbound link event

Scenario: GA4 navigation outbound link event is pushed when user clicks on the outbound link
  Given I visit the welcome page
  And I accept analytics cookies
  And I set up a listener for the data layer push
  When I click Test Outbound Link link
  Then The dataLayer includes the navigation outbound link event

Scenario: GA4 navigation logo event is pushed when user clicks on the logo
  Given I visit the welcome page
  And I accept analytics cookies
  And I set up a listener for the data layer push
  When I click logo
  Then The dataLayer includes the navigation logo event

Scenario: GA4 navigation link event is pushed when user clicks on banner link
  Given I visit the welcome page
  And I accept analytics cookies
  And I set up a listener for the data layer push
  When I click restart link
  Then The dataLayer includes the navigation banner link event

Scenario: GA4 navigation link event is pushed when user clicks on footer link
  Given I visit the welcome page
  And I accept analytics cookies
  And I set up a listener for the data layer push
  When I click Contact link
  Then The dataLayer includes the navigation footer link event

Scenario: GA4 navigation link event is pushed when user clicks on footer licence link
  Given I visit the welcome page
  And I accept analytics cookies
  And I set up a listener for the data layer push
  When I click Open Government Licence link
  Then The dataLayer includes the navigation footer licence link event

Scenario: GA4 navigation link event is pushed when user clicks on footer copyright link
  Given I visit the welcome page
  And I accept analytics cookies
  And I set up a listener for the data layer push
  When I click Crown copyright link
  Then The dataLayer includes the navigation footer copyright link event

Scenario: GA4 navigation link event is pushed when user clicks on menu link
  Given I visit the welcome page
  And I accept analytics cookies
  And I set up a listener for the data layer push
  When I click Menu link 1 link
  Then The dataLayer includes the navigation menu link event

Scenario: GA4 navigation link event is pushed when user clicks on a very long menu link
  Given I visit the welcome page
  And I accept analytics cookies
  And I set up a listener for the data layer push
  When I click Menu link 3 link
  Then The dataLayer includes the very long navigation menu link event

