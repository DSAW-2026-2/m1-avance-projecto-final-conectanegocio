# Design

## Context

See `proposal.md` for motivation and the delta specs for observable behavior. `DataProvider` currently owns in-session `storeInventory`, `orders`, `sales`, and the client cart. `checkoutState` already computes one client order, sale, payment entry, inventory decrement, and cart clearing from one previous-state snapshot. Catalog helpers resolve store-specific offers; route destinations already drive both navigation and `ProtectedRoute`. No backend, real payment service, commercial localStorage, or added package is permitted.

## Goals / Non-Goals

**Goals:** Reuse the central sale/inventory rules for both purchase channels, preserve client-checkout guarantees, enforce own-store authorization at routing and operation boundaries, and leave one auditable `sales` source for later reports.

**Non-Goals:** Split-payment UI, customer identification for counter sales, new customer orders, inventory administration, report aggregates/UI, seeded sales unrelated to this workflow, and persistent commercial records.

## Decisions

### One shared sale transaction, two commands

Extract the existing checkout's sale-line, payment, ID, and inventory-decrement preparation into a small pure transaction helper. It receives a previous business-state snapshot, the explicit store ID, requested product/quantity lines, payment entries, creator ID, and timestamp; it resolves current offers through existing catalog rules and either returns a fully prepared sale plus next inventory or a validation failure. It never mutates inputs or commits a partial result. The client `checkoutCustomerOrder` path keeps its owner/cart/selected-store validation, then uses the same prepared sale in its existing single updater to append the customer order and linked sale, decrement inventory, and clear the cart. The new `registerStoreSale` path authorizes the staff member, derives the store from `currentUser.storeId`, then appends only the prepared sale and inventory in one functional `setState(previous => ...)`. Do not make the pure helper itself an alternate state owner. Existing customer order IDs, order links, payment shape, success/duplicate behavior, and historical snapshots must remain compatible.

This design avoids copying `checkoutState` into a second sale function. A generic event bus, reducer, or new Context would add concepts without solving this small shared transaction. The full precondition check runs against the state inside the functional updater, not against a rendered snapshot that may have become stale. A failure may update a feedback notice, but it must preserve `sales`, `orders`, `cart`, and `storeInventory` references/values. Sales and inventory are in one React state object, so one returned next snapshot is the local atomic boundary; it is not a database transaction or cross-tab guarantee.

### Staff store, products, and money

The public catalog's `selectedStoreId` is a browsing/client-cart choice, not staff authority. Staff sale scope comes solely from a valid `currentUser.storeId`; reject missing/unknown IDs in the operation and show no history for them. The form lists available offers from `getStoreOffers(storeId, products, storeInventory, stores)` and uses stable `productId` lines. The operation re-resolves each distinct line at submission, rejects unknown/duplicate/unavailable/conflicting offers and nonpositive or noninteger quantities, verifies current stock and finite valid retail prices, then snapshots `unitPrice`. Before decrementing by inventory-row ID it also rejects duplicate row IDs anywhere in the inventory snapshot, including another store, so no unrelated row can be decremented accidentally. Totals are computed from those lines, not stored separately in form state. The final sale total is stored because it is a historical transaction snapshot, not redundant live derived UI state. `SupplierOffer.price` and a product-level price are never used.

The existing `payments: [{ method, amount }]` Sale shape remains. The operation takes an array of positive finite numeric COP entries, each using `cash`, `card`, or `nequi`, and requires their exact sum to equal the current total; the simple UI chooses one method and supplies exactly the derived total. Split payments can later use the same operation without a new data model, but adding a split UI now is unnecessary. Invalid totals, payment shapes, or non-finite arithmetic fail before any commit. Keep numeric money rather than display-formatted strings; use `formatMoney` only to render. The UI must state that no money is actually collected.

### Idempotent store submission

Each form attempt gets a stable, session-only `submissionId` generated once for that draft (native browser UUID or a simple collision-checked session ID; no package). `registerStoreSale` requires it and stores it on the Sale. Repeated calls with the same ID find the already-created Sale in the current state and do not create another sale or decrement again; reusing the ID with changed details is rejected, never treated as a new sale. After success the form clears and starts a fresh ID; invalid attempts may keep their ID while the draft is corrected. The submit button also becomes temporarily unavailable while a submission is in flight, but the state-level ID check is the actual protection against two queued updates. Client checkout retains cart-clearing duplicate protection and does not need a store-sale submission ID. No separate global processed-ID collection is needed because the Sale itself records the key. The ID is internal metadata, not a customer-facing receipt or proof of payment.

### Authorization, history, and route composition

Add one central destination `{ path: '/store/sales', page: 'storeSales', requiresAuth: true, allowedRoles: ['store_admin', 'store_employee'], allowedSubRoles: { store_employee: ['cashier'] }, navigation: 'Ventas' }`. Existing `canAccess`, `visibleDestinations`, and `ProtectedRoute` consume it; do not duplicate role tests in the menu. The operation and history selector also call `canAccess(user, storeSalesDestination)` and check the assigned store, because hidden links or route wrappers alone do not protect business data. `store_employee/inventory` fails closed through the existing policy. Admin has no subrole restriction. Neither page nor operation permits choosing a different transaction store.

History filters the shared `sales` array by `user.storeId` after authorization, so it includes both client checkout sales (with `orderId`) and staff sales (without one). Display stored date, item-price snapshots, total, and payment entries, with an honest empty state; no report summary or independent history state. This single collection is the later reporting source. A small store dashboard entry can be derived from the same destination policy. Do not expose history through DataContext without a user-scoped selector or page-level authorized filter.

### UI and verification shape

Use a `StoreSalesPage` coordinator plus focused components for product/quantity selection, chosen lines, payment selection, and history rows; reuse `FormField`, `EmptyState`, `formatMoney`, tokens, and current layout. Local draft state holds lines and payment choice; DataContext holds committed sales/inventory and a sale feedback notice. Avoid `useEffect` for totals/history/availability; derive during render. Keep every React component at or below 80 lines via the existing component-size check, with named utilities for pure calculations rather than compressed JSX. Use semantic form labels, field errors, status messages, keyboard actions, visible focus, and responsive stacking or bounded table overflow at 320px. A history list may be simpler than a wide table at this width.

Pure tests should cover transaction preparation, authorization, store isolation, current-price snapshots, split reconciliation, atomic failure, and idempotency. Integration-level checks should verify client checkout remains one order + one sale + inventory decrement + cart clear, and that customer-created sales appear in store history. Build and component-size checks must stay clean; there is currently no lint script, so only run it if one is added or available.

## Risks / Trade-offs

- [Shared-helper extraction regresses client checkout] → Preserve its existing public inputs and outcomes; run the existing shopping tests plus new cross-channel tests.
- [Queued rapid submissions double-decrement] → Stable per-draft ID recorded on Sale, checked in the functional updater; UI disabling is supplementary only.
- [Stale stock or price at submit] → Resolve all offers and totals inside the updater from its current state, then commit once.
- [Store data leaks via public catalog selection or hidden navigation] → Authorize the operation and history independently, always deriving staff scope from the account's assigned store.
- [Money equality/precision] → Use current numeric COP values, validate finite arithmetic and exact reconciliation; test mixed/split amounts, including mismatch. If future fractional currency requirements appear, define a common integer-minor-unit policy in a later change rather than ad hoc tolerances here.
- [Session reset] → Commercial records remain in memory and are honestly labeled; localStorage remains limited to account/session mock data.

## Migration Plan

Implement the pure shared helper and adapt client checkout with regression tests first; then add the staff command, policy, page, and focused UI. There is no persisted commercial data to migrate or deploy. Until implementation is verified, the existing client-shopping flow remains the behavioral baseline. Revert only the in-scope application edits if a future implementation fails verification; do not alter the historical M1 prototype.
