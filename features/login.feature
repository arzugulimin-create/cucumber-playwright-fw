Feature: ZincBank Sign In
  As a ZincBank customer
  I want to sign in with my username and password
  So that I can access my accounts

  Background:
    Given I am on the ZincBank sign in page

  @smoke @login
  Scenario: Sign in with valid credentials from the environment
    When I sign in with the configured username and password
    Then I should be signed in and see my accounts
    And the accounts page should greet the configured username
