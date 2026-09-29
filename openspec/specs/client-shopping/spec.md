# client-shopping Specification

## Purpose

Enable a signed-in client to buy mock products from one selected store, observe a coherent order and stock change, and review only their own purchase history.

## Requirements

### Requirement: Store-bound client cart
Only an authenticated `client` SHALL add purchasable products from the selected store to a cart bound to that client and store. Cart lines SHALL identify products by stable ID and hold positive whole-number quantities. The cart SHALL show the current selected store's retail unit prices from `StoreInventoryItem.salePrice`, quantities, line subtotals, and a derived total; it SHALL never use `Product` or `SupplierOffer` as a customer price source. The client SHALL be able to change quantity or remove a line. Cart data SHALL remain in the current application session, not browser commercial storage.

#### Scenario: Add an offered product
- **WHEN** a signed-in client has selected a valid store and adds a product offered there with available stock
- **THEN** that product appears in a cart bound to the client and store, with a price from that store's inventory entry

#### Scenario: Add without a valid offer
- **WHEN** no valid store is selected, the product is unknown or not offered there, or its stock is zero
- **THEN** the add is rejected with useful feedback and no cart line is created

#### Scenario: Update quantity and remove
- **WHEN** the cart owner sets a line to a positive whole-number quantity within current stock, or removes the line
- **THEN** the visible line and derived totals update, or the removed line disappears, without changing inventory

#### Scenario: Reject invalid or excessive quantity
- **WHEN** an add or quantity change requests zero, a noninteger, or more than the store's current stock
- **THEN** it is rejected with an actionable stock/quantity message and the cart and inventory remain unchanged

#### Scenario: Stock is exhausted after adding an item
- **WHEN** a cart line's current store stock becomes zero before checkout
- **THEN** the cart identifies that item as unavailable, keeps it removable, and does not allow the purchase to complete until the cart is corrected

#### Scenario: Derive retail totals
- **WHEN** quantities or the selected store's sale prices change before checkout
- **THEN** line subtotals and cart total reflect current store inventory prices and quantities, without a separately stored cart total

#### Scenario: Switch stores with a nonempty cart
- **WHEN** the cart owner attempts to select a different store while the cart contains items
- **THEN** the switch is blocked, the existing selected store and cart remain intact, and the interface explains that the cart must be explicitly emptied first

#### Scenario: Switch stores after emptying the cart
- **WHEN** the cart owner removes all items and selects another valid store
- **THEN** the new store is selected and any subsequently added items belong only to it

#### Scenario: Cart isolation between accounts
- **WHEN** a client logs out or another account signs in during the same application session
- **THEN** the former client's cart is not visible or actionable to the other account; logout clears the cart

### Requirement: Coherent mock checkout
Checkout SHALL accept a nonempty cart only for its authenticated client owner and valid selected store. It SHALL validate every line against current store stock and sale price at submission, and validate a supported payment selection (`cash`, `card`, or `nequi`). A successful submission SHALL coherently create exactly one `orderType: "customer"` order with initial status `pending`, one corresponding sale, and payment record(s) whose amounts sum to the sale total; decrement only the purchased store inventory quantities; and clear the cart. The valid customer-order status vocabulary SHALL be `pending`, `confirmed`, `ready`, `completed`, and `cancelled`; this change creates `pending` orders but does not implement status transitions. Order and sale lines SHALL retain the checkout-time unit price and quantity as a historical snapshot. A failed or duplicate submission SHALL NOT partially create business records, decrement stock, or clear the cart.

#### Scenario: Complete checkout
- **WHEN** the cart owner submits a valid cart with current stock and selects one supported mock payment method
- **THEN** one customer order and one linked sale are created for the selected store and client, the sale contains one payment for the exact derived total, purchased inventory decreases once, and the cart becomes empty

#### Scenario: Price changes before checkout
- **WHEN** the selected store's sale price changes after an item was added and before valid checkout
- **THEN** the charged total and saved order/sale line prices use the current store sale price shown at checkout, not an old cart price or supplier offer

#### Scenario: Stock decreases before checkout
- **WHEN** current store stock is less than any cart quantity at submission
- **THEN** checkout fails with an actionable stock message and the cart, orders, sales, payments, and inventory remain otherwise unchanged

#### Scenario: Empty or invalid store checkout
- **WHEN** checkout is attempted with an empty cart, no valid selected store, or a cart bound to another store
- **THEN** no order, sale, payment, or inventory update occurs and the client receives a clear explanation

#### Scenario: Reject invalid payment data
- **WHEN** checkout receives an absent/unsupported payment method or payment amount inconsistent with the current derived total
- **THEN** checkout fails with feedback and no business-state mutation; the UI never claims to process a real payment

#### Scenario: Reject duplicate checkout submission
- **WHEN** the client submits checkout twice before the first submission settles or repeats it after the cart has been cleared
- **THEN** at most one order, sale, and stock decrement result from that cart

#### Scenario: Preserve state on any checkout failure
- **WHEN** a checkout precondition fails, including an invalid line, conflicting inventory entry, or inability to create a coherent order/sale/payment set
- **THEN** no partial business records or stock change are committed, and the cart remains available for correction

### Requirement: Client shopping access and personal history
`/client/cart` and `/client/orders` SHALL be protected for the `client` role through the application's central route policy. Only a signed-in client SHALL see shopping entry points and add-to-cart controls; public catalog browsing SHALL remain available to everyone. An authenticated client SHALL see only orders whose `customerId` matches that client's ID, with their status, store, items, total, and mock-payment summary. This change SHALL not allow customer order status edits.

#### Scenario: Client shopping entry points
- **WHEN** a signed-in client views an offered in-stock product or their dashboard/navigation
- **THEN** they can reach the add-to-cart/cart/order-history flow for their selected store

#### Scenario: Public or non-client browsing
- **WHEN** a signed-out visitor or a non-client account views the public catalog/detail
- **THEN** browsing remains available but client purchase controls and protected shopping navigation are not offered

#### Scenario: Protected route enforcement
- **WHEN** a signed-out visitor opens a shopping URL directly, or a non-client account opens it directly
- **THEN** the existing protected-route policy sends the visitor to login or the account's safe dashboard respectively, without rendering client shopping data

#### Scenario: View only own orders
- **WHEN** a client opens `/client/orders` after purchases exist for multiple clients
- **THEN** only orders with that client's `customerId` are shown, and no other client's order or payment details appear

#### Scenario: Empty history and session reset
- **WHEN** the client has no orders, including after commercial state resets on a full reload
- **THEN** history shows an accurate empty state and does not claim that prior session purchases persisted

### Requirement: Accessible and honest shopping interface
The cart, checkout, and order-history UI SHALL use semantic labeled controls, keyboard-operable quantity/payment/submission actions, visible focus and validation feedback, and a layout usable at a 320-pixel viewport. It SHALL identify payments and commercial records as session-only mock behavior, not a real transaction service.

#### Scenario: Correct a shopping error by keyboard
- **WHEN** a client submits an invalid quantity or payment selection using the keyboard and then corrects it
- **THEN** the relevant error is perceivable and the corrected action can complete without a pointer

#### Scenario: Narrow shopping view
- **WHEN** cart, checkout, or order history is viewed at 320 pixels wide
- **THEN** controls, amounts, items, and status text remain readable without horizontal page scrolling
