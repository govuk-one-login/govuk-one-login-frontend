@v1
Feature: Cookie Banner

Scenario: User sets cookie consent
  Given I visit the welcome page
  Then I see the cookies-banner-main element
  And The cookies_preferences_set cookie is not set

Scenario: User accepts cookie consent
  Given I visit the welcome page
  Then I see the cookies-banner-main element
  When I click Accept
  Then I see the message "You've accepted additional cookies"
  And The cookies_preferences_set cookie is set to true
  When I click Hide
  Then I do not see the cookie banner

Scenario: User rejects cookie consent
  Given I visit the welcome page
  Then I see the cookies-banner-main element
  When I click Reject
  Then I see the message "You've rejected additional cookies"
  And The cookies_preferences_set cookie is set to false
  When I click Hide
  Then I do not see the cookie banner