# Spec Delta

## Purpose

Allow authorized store staff to register honest mock sales for their own store, reconcile payments, update stock coherently, and review the shared sale history without exposing other stores.

## ADDED Requirements

### Requirement: Authorized and store-scoped sales access
`/store/sales` SHALL be available only to signed-in `store_admin` and `store_employee/cashier` accounts with a valid assigned store. Its navigation and direct-route access SHALL use the same central destination policy. Sale entry, submission, and history SHALL use the account's assigned `storeId`, never a separately selected public-catalog store. A caller lacking permission or a valid assigned store SHALL not read another store's sales or change business state.

#### Scenario: Administrator or cashier opens sales
- **WHEN** a store administrator or cashier with a valid assigned store opens `/store/sales`
- **THEN** the page offers sale registration and that store's sales history, and navigation exposes the destination

#### Scenario: Deny other roles and subroles
- **WHEN** a signed-out visitor, client, distributor account, or `store_employee/inventory` opens `/store/sales` directly or attempts its sale action
- **THEN** protected routing or the business action denies access according to the existing safe-redirect convention, no other store's data is rendered, and no sale or stock change occurs

#### Scenario: Ignore catalog store selection for staff sales
- **WHEN** an authorized cashier assigned to store A has selected store B in the public catalog
- **THEN** the sale form, submitted sale, stock decrement, and history remain scoped to store A

#### Scenario: Invalid organization identity
- **WHEN** an otherwise permitted store account has a missing or unknown assigned store ID
- **THEN** sale registration and history are unavailable and no business state changes

### Requirement: Current-store sale composition and totals
The sale form SHALL allow one or more distinct products offered in the account's store, each with a positive whole-number quantity within current available stock. It SHALL display current unit retail prices from the corresponding `StoreInventoryItem.salePrice`, line subtotals, and a derived total in numeric COP terms; no `Product` or `SupplierOffer` price SHALL be used as the sale price. Staff SHALL be able to adjust or remove selected lines before submission without changing stock.

#### Scenario: Compose a multi-item sale
- **WHEN** authorized staff select two available products and valid quantities in their own store
- **THEN** the form shows both current store retail prices, line subtotals, and the sum of those subtotals without reducing stock

#### Scenario: Reject empty or invalid lines
- **WHEN** staff submit no lines, a duplicate or unknown product, or a zero, negative, noninteger, or excessive quantity
- **THEN** the submission is rejected with useful feedback and no sale, payment, or inventory change occurs

#### Scenario: Product becomes unavailable
- **WHEN** an item is removed, has conflicting inventory entries, or reaches zero stock before confirmation
- **THEN** the item is identified as unavailable, the sale is not completed, and staff can correct the draft

#### Scenario: Price or stock changes before submission
- **WHEN** the current store price or quantity changes after a line was selected
- **THEN** displayed totals reflect the current valid store offer and final submission revalidates price and stock against current inventory; a successful sale snapshots the final unit prices

### Requirement: Reconciled mock payments and coherent sale transaction
Submission SHALL accept only supported mock payment entries with method `cash`, `card`, or `nequi`, finite positive numeric COP amounts, and an exact sum equal to the sale's current derived total. The UI SHALL support a simple single-method selection; the recorded `payments[]` representation and business operation SHALL remain capable of validating multiple entries. For a valid submission, the application SHALL create exactly one Sale with stable ID, own-store ID, creator ID, ISO-compatible date, item snapshots, total, and payment entries, and SHALL decrement only its own-store inventory by the sold quantities. Sale and inventory changes SHALL commit together; failure SHALL leave business records and stock unchanged. A repeated submission of the same sale attempt SHALL not create another sale or decrement stock again. A walk-in store sale SHALL not create a customer order or modify a client cart.

#### Scenario: Register a valid sale
- **WHEN** authorized staff submit valid own-store lines and one supported mock payment for the exact current total
- **THEN** exactly one Sale with that payment is recorded, only those store inventory quantities decrease once, and success feedback identifies the simulation

#### Scenario: Reconcile split-compatible payments
- **WHEN** a sale operation receives two supported positive payment entries whose amounts sum exactly to its current total
- **THEN** both entries are recorded on one sale; when their sum differs, submission is rejected without business-state change

#### Scenario: Reject invalid payment
- **WHEN** payment is missing, uses an unsupported method, has a nonnumeric, nonfinite, zero, or negative amount, or does not reconcile to the total
- **THEN** no sale, payment, order, cart, or stock change occurs and an actionable error appears

#### Scenario: Insufficient stock at confirmation
- **WHEN** current stock is below any requested quantity at submission, even if it was sufficient while composing the draft
- **THEN** the whole sale fails with stock feedback; no sale or payment is recorded and no product's stock is decremented

#### Scenario: Duplicate submission
- **WHEN** the same sale attempt is submitted twice rapidly or retried after its first success
- **THEN** at most one Sale and one stock decrement result from that attempt, while a deliberate new attempt remains possible

#### Scenario: Failed transaction leaves business state unchanged
- **WHEN** any sale precondition fails, including inconsistent sale IDs, duplicate inventory-row IDs, or ambiguous store/product inventory entries
- **THEN** no partial Sale, payment, order, cart, or inventory mutation is committed

### Requirement: Store-scoped sales history and reporting source
Authorized store users SHALL see only sales whose `storeId` matches their assigned store, including client-checkout sales and staff-registered sales, with date, items, total, and mock-payment summary. The in-session sales collection SHALL remain the source for later derived reporting; this change SHALL not implement report UI or aggregates.

#### Scenario: Review a mixed own-store history
- **WHEN** a store has a client-checkout sale and a staff-registered sale
- **THEN** authorized staff see both in their store history with recorded item and payment snapshots

#### Scenario: Isolate another store
- **WHEN** sales exist for two stores and a cashier opens history
- **THEN** only sales for that cashier's assigned store appear, regardless of the public-catalog store selection

#### Scenario: Empty session history
- **WHEN** the assigned store has no in-session sales or commercial state resets after reload
- **THEN** an accurate empty state appears without claiming persistent records

### Requirement: Accessible and honest sales interface
Sale entry, payment selection, errors, and history SHALL use labeled semantic controls, keyboard-operable actions, perceivable validation and success feedback, visible focus, and a layout usable at a 320-pixel viewport. The interface SHALL state that sales and payments are simulated and session-only.

#### Scenario: Correct an invalid sale by keyboard
- **WHEN** staff submit a bad quantity or payment selection using only the keyboard and then correct it
- **THEN** the error is perceivable and the corrected sale can complete without a pointer

#### Scenario: Narrow sales view
- **WHEN** the form or history is viewed at 320 pixels wide
- **THEN** products, amounts, actions, and payment summaries remain readable without horizontal page scrolling
