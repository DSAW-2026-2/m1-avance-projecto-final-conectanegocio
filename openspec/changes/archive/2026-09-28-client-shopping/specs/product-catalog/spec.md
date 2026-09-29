# Spec Delta

## MODIFIED Requirements

### Requirement: Dynamic product detail and invalid resources
Each offered product card SHALL navigate to `/products/:productId`. The detail route SHALL resolve the product identity from the route ID and, when a valid store is selected, resolve its matching store inventory entry. The page SHALL distinguish an unknown product ID from a known product not sold by the selected store. Only a signed-in client viewing an offered, in-stock item SHALL see the mock add-to-cart action; no purchase action SHALL appear for invalid, unavailable, or out-of-stock offers.

#### Scenario: Navigate from a card
- **WHEN** a visitor activates an offered product card's detail link
- **THEN** the browser navigates to the URL containing that product's ID and shows its detail

#### Scenario: Resolve a valid product ID
- **WHEN** a visitor opens a known product's detail URL with a selected store that offers it
- **THEN** the detail shows its name, description, category, selected store, and that store's sale price and stock/availability

#### Scenario: Unknown product ID
- **WHEN** a visitor opens a detail URL whose product ID does not identify a product
- **THEN** the page clearly reports that the product was not found and offers a route back to the catalog, without fabricated product or commercial data

#### Scenario: Known product not sold by selected store
- **WHEN** a known product's detail URL is opened while the selected store has no matching inventory entry
- **THEN** the page identifies the product and explains that this store does not offer it, without displaying a price or stock for another store

#### Scenario: Switch store before viewing detail
- **WHEN** a visitor changes the selected store in the catalog and opens a product detail
- **THEN** the detail uses the newly selected store, including its offer or its not-sold state

#### Scenario: Client purchase action on a valid offer
- **WHEN** a signed-in client views a valid offered product with positive stock in a selected store
- **THEN** the detail offers a labeled mock add-to-cart action bound to that store and product

#### Scenario: No purchase action for unavailable or unauthorized visitor
- **WHEN** the item has no valid store offer or positive stock, or the viewer is signed out or not a client
- **THEN** the detail has no add-to-cart action, while ordinary public product information remains available
