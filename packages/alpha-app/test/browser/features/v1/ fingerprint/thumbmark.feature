@deviceintelligence
Feature: Device Intelligence

    Scenario: User does not accept the analytics cookies
        Given I visit the welcome page
        When I reject analytics cookies
        Then the di-device-intelligence cookie has been set

    Scenario: User accepts the analytics cookie
        Given I visit the welcome page
        When I accept analytics cookies
        Then the di-device-intelligence cookie has been set

    Scenario: User has identical cookie value after page refresh
        Given I visit the welcome page
        And I accept analytics cookies
        And the di-device-intelligence cookie has been set
        When I refresh the welcome page
        Then I should see an identical di-device-intelligence cookie value after the page refresh