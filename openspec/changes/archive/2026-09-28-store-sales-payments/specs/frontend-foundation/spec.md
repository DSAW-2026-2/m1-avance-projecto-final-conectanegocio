# Spec Delta

## MODIFIED Requirements

### Requirement: Honest feature boundaries
The product catalog SHALL display only mock store-specific offer information; implemented client shopping and store sales/payments SHALL be identified as session-only mock behavior, while other unimplemented business functions SHALL remain unmistakably unavailable. Mock account forms and protected identity dashboards SHALL NOT imply production authentication, real payment processing, or completed business capabilities beyond the implemented client-shopping and store-sales workflows. Unimplemented business routes SHALL NOT display business data or controls.

#### Scenario: Open a planned public feature placeholder
- **WHEN** a visitor opens `/products`
- **THEN** store-contextual catalog browsing is available; only a signed-in client with a purchasable offer sees the implemented mock shopping entry point, not a misleading real-payment action

#### Scenario: Open a future protected path
- **WHEN** a visitor navigates directly to a store, distributor, client, or chat business path that has not been implemented
- **THEN** no business dashboard, data, or controls are shown

#### Scenario: Open an implemented account dashboard
- **WHEN** an authorized user opens their role's protected dashboard
- **THEN** the view identifies the current mock account and organization without showing invented commercial activity; a client may see genuine session shopping links, while a permitted store administrator or cashier may see a genuine session sales link
