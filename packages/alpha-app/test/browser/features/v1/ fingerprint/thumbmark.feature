@deviceintelligence
Feature: ThumbmarkJS E2E testing in Alpha App

    Scenario: User does not have the di-device-intelligence cookie
        Given I visit the welcome page
        When I reject analytics cookies
        Then the di-device-intelligence cookie has been set

    Scenario: User has the di-device-intelligence cookie
        Given I visit the welcome page
        When I accept analytics cookies
        Then the di-device-intelligence cookie has been set

    # Scenario: User has identical cookie value after page refresh (coming soon)

