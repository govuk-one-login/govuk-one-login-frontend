@deviceintelligence
Feature: ThumbmarkJS E2E testing in Alpha App

Scenario: Check that the fingerprint and cookie are set
    Given I am an FEC dev
    When I run an E2E test in the alpha app
    Then I accept analytics cookies from the banner
    And the cookie has been set

Scenario: Check cookie persistence after page refreshes
    Given I am an FEC dev
    When I run an E2E refresh test in the alpha app
    Then the cookie should be reset in the web page