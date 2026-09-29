# Tasks

## 1. Shared sale transaction

- [x] 1.1 Extract pure current-store line validation, retail price/stock checks, snapshot total, payment reconciliation, unique Sale ID, and immutable inventory decrement preparation from client checkout; verify focused tests reject empty/duplicate/invalid lines, unavailable/conflicting offers, duplicate inventory-row IDs across stores, bad stock/price/date, and invalid or mismatched single/split payments without changing the input state.
- [x] 1.2 Adapt `checkoutCustomerOrder` to the shared preparation while retaining its order link, `pending` status, client ownership, cart clearing, and one-commit failure/duplicate semantics; verify the existing client-shopping tests and add a regression test for one order + one sale + one decrement with current-price snapshots.

## 2. Store command and access

- [x] 2.1 Add the central `/store/sales` destination with administrator/cashier-only policy, page mapping, and policy-derived navigation; verify route and visibility tests for admin, cashier, inventory employee, other roles, and signed-out direct access.
- [x] 2.2 Add `registerStoreSale` to DataContext using the account's valid `storeId` and one functional state update; verify tests for own-store scope despite another selected catalog store, invalid organization, no order/cart changes, stock changes before submit, and no partial business-state mutation on every failure.
- [x] 2.3 Make store sale attempts idempotent using a stable draft `submissionId` recorded on Sale, including collision/reused-ID handling; verify two queued/repeated submissions yield one sale/decrement and a fresh attempt can create a new sale.
- [x] 2.4 Add an authorized own-store history selector over the shared sales collection, including client-checkout and staff sales; verify tests exclude other stores, reject unauthorized/invalid-store callers, and provide a truthful empty result after session reset.

## 3. Store sales presentation

- [x] 3.1 Build a focused store-sales page and product/quantity draft controls from current own-store offers, with editable/removable distinct lines and render-derived subtotals/total; verify valid multi-item composition and invalid/zero/out-of-stock correction without premature stock mutation.
- [x] 3.2 Add a simple cash/card/nequi selector and submit action using the same stable draft ID until success, clearing the draft only after success; verify invalid payment feedback, success feedback, no duplicate action, keyboard correction, and explicit mock/session-only wording.
- [x] 3.3 Render the authorized store's shared sale history and a policy-derived store dashboard entry, reusing current UI tokens/primitives; verify mixed client/staff sales, stored payment/item snapshots, own-store isolation, empty state, and a 320px readable layout with focus/labels.
- [x] 3.4 Add only necessary plain-CSS styles and check every new/changed React component with `npm run check:components`; verify no component exceeds 80 lines and no redundant total state, DOM manipulation, or unjustified `useEffect` was added.

## 4. Cross-feature verification

- [x] 4.1 Run existing and new relevant tests, `npm run build`, `npm run lint` if available, and strict OpenSpec validation; verify the client cart/checkout and store sale state transitions, route authorization, and no unapproved dependencies or unfinished business features.
