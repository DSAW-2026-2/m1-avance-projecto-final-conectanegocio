# product-catalog Specification

## Purpose

Let any visitor inspect a store-specific retail catalog and product detail without mistaking product identity for a universal price or stock level.

## Requirements

### Requirement: Public store-contextual browsing
The application SHALL expose `/products` and `/products/:productId` to signed-out and signed-in visitors. A visitor SHALL select a valid store before commercial information is shown. The selected store SHALL remain in effect while navigating between catalog and detail in the same application session; no store SHALL be silently chosen or inferred from the visitor's account.

#### Scenario: Open catalog without a store
- **WHEN** a visitor opens `/products` with no selected store
- **THEN** the page explains that a store is required, presents the available stores, and shows no retail price, stock, or invented default-store offer

#### Scenario: Select a store
- **WHEN** a visitor selects a known store
- **THEN** the catalog displays that store's offered products and identifies the selected store

#### Scenario: Reject an invalid store context
- **WHEN** a store selection or retained store ID does not resolve to a known store
- **THEN** the interface requests a valid store selection and does not display commercial information for the invalid ID

#### Scenario: Preserve store across catalog and detail
- **WHEN** a visitor selects a store, opens a product detail, and returns to the catalog without reloading
- **THEN** the same store remains selected and its offer information remains in use

#### Scenario: Direct detail navigation without a store
- **WHEN** a visitor directly opens a valid `/products/:productId` with no selected store
- **THEN** the page shows that product's identity, asks for a store, and shows no retail price or stock until one is selected

### Requirement: Store-specific catalog offers
The catalog SHALL join each product identity to an inventory entry for the selected store by `productId` and `storeId`. Retail sale price, quantity, and availability SHALL come from that store's inventory entry, not from a universal product field or supplier offer. A product without an entry for the selected store SHALL not appear as offered there; an entry with zero quantity SHALL remain distinguishable as out of stock.

#### Scenario: List offered products
- **WHEN** the selected store has inventory entries for known products
- **THEN** the catalog displays those products once each with that store's retail price and stock status

#### Scenario: Different store prices and quantities
- **WHEN** the same product has inventory entries in two stores with different sale prices or quantities and the visitor switches stores
- **THEN** the displayed retail price and stock status immediately match the newly selected store

#### Scenario: Product not offered in selected store
- **WHEN** a product has no inventory entry for the selected store
- **THEN** it is absent from that store's catalog and is not presented as available there

#### Scenario: Out-of-stock offer
- **WHEN** a selected store offers a product with quantity zero
- **THEN** the product remains identifiable in browsing and is clearly marked out of stock, not available for purchase

#### Scenario: Low-stock offer
- **WHEN** an offered product has a positive quantity at or below its nonnegative `minStock` threshold
- **THEN** it is identified as low stock rather than out of stock

#### Scenario: Store with no valid offers
- **WHEN** the selected store has no inventory entries resolving to known products
- **THEN** the catalog presents an empty-store explanation rather than prices, stock, or a broken list

### Requirement: Catalog search and category filtering
The catalog SHALL support case-insensitive name search and category filtering together for the selected store's offers. Search results SHALL update after a short debounce pause; filtering SHALL not alter product or inventory source data. Empty results SHALL be explained without implying the store has no inventory when filters caused the empty view.

#### Scenario: Search by product name
- **WHEN** a visitor enters part of an offered product's name into the labeled search control and pauses
- **THEN** the visible offers include matching names and exclude nonmatching names

#### Scenario: Debounced typing
- **WHEN** a visitor types several characters faster than the debounce delay
- **THEN** the visible search result settles to the latest entered query after the pause rather than committing each intermediate query as a final result

#### Scenario: Filter by category
- **WHEN** a visitor chooses a category
- **THEN** only offered products in that category are shown

#### Scenario: Combine search and category
- **WHEN** both a name query and category are active
- **THEN** only selected-store offers satisfying both conditions are shown

#### Scenario: No search or category match
- **WHEN** name search, category filtering, or their combination produces no offered product
- **THEN** a useful no-results message identifies the filters as the cause and allows the visitor to change them

#### Scenario: Switch stores while filtering
- **WHEN** a visitor changes stores while search or category controls have values
- **THEN** the results and available categories are recalculated for the new store, without displaying the previous store's price or stock

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

### Requirement: Accessible responsive catalog presentation
The catalog and detail SHALL reuse the application's public shell and visual conventions, provide labeled store/search/category controls, semantic keyboard-operable links and controls, visible focus, meaningful status/empty/error text, and usable narrow-screen layout.

#### Scenario: Keyboard browsing
- **WHEN** a visitor uses a keyboard to select a store, set filters, and open a product detail
- **THEN** each control has an understandable label, can be operated without a pointer, and has visible focus

#### Scenario: Narrow viewport
- **WHEN** the catalog or detail is viewed at a 320-pixel-wide viewport
- **THEN** controls, cards, prices, and status text remain readable and operable without horizontal page scrolling
