# Tasks

## 1. Shared business state and cart rules

- [x] 1.1 Extend the existing DataContext with one in-memory business snapshot for selected store, inventory, cart, orders, sales, and operation feedback; verify catalog still shows the same selected-store offers and a reload resets only commercial state.
- [x] 1.2 Add pure cart/store selectors for unique store inventory lookup, cart ownership, current sale prices, line subtotals, and total; verify with Node tests that supplier/product prices never determine customer totals and missing/duplicate offers fail safely.
- [x] 1.3 Implement guarded add, quantity change, removal, clear-cart, and store selection operations; verify Node tests for positive integers, zero stock, excessive quantity, wrong owner, no store, and blocked/accepted store switches without inventory mutation.
- [x] 1.4 Wire logout to clear the session cart without altering registered accounts; verify with an account-switch scenario that another identity cannot view or act on the prior cart.

## 2. Shopping entry points and cart presentation

- [x] 2.1 Add `/client/cart` and `/client/orders` to central destinations and page mapping with client-only policy; verify route/navigation tests for signed-out, non-client, and client access, including direct URLs.
- [x] 2.2 Add a client-only add-to-cart control to valid in-stock product detail, using central access policy and business-operation feedback; verify no control on invalid/no-store/not-offered/zero-stock details or for non-clients.
- [x] 2.3 Add client dashboard links to catalog, cart, and own orders, and adjust its future-feature wording only for implemented shopping; verify other dashboards remain identity-only and links obey the same policy.
- [x] 2.4 Build focused cart line, quantity, remove/empty, store-block notice, and derived-total UI on `/client/cart`; verify keyboard quantity correction, exhausted-stock feedback with removal, empty state, and one-store prices in the browser; add related plain CSS and keep each component ≤80 lines.

## 3. Atomic checkout operation

- [x] 3.1 Implement a pure customer checkout transition against the latest snapshot, with all role/owner/store/stock/price/payment preconditions and no side effects inside the state updater; verify focused Node tests for each invalid input and unchanged business fields on failure.
- [x] 3.2 In one successful transition create a pending customer order, linked sale, snapshot lines, exact-total payment array, inventory decrement, and emptied cart with unique session IDs; verify Node tests for relationship integrity and only purchased-store rows changing.
- [x] 3.3 Expose checkout through one functional DataContext state update with explicit success/error feedback; verify tests for current-price revaluation, stock drop before checkout, two queued submissions, and updater replay producing no duplicate external effect.

## 4. Mock checkout UI

- [x] 4.1 Add a small labeled cash/card/nequi selector and checkout summary within `/client/cart`, passing only form input to the centralized operation; verify all three methods, invalid method feedback, exact payment amount, and a nonempty-cart requirement.
- [x] 4.2 Show accessible failure feedback without clearing the cart and a success state without a second submit action; verify rapid double click yields one order/sale/decrement and that no real-payment claim appears; add responsive CSS and check components ≤80 lines.

## 5. Personal order history

- [x] 5.1 Implement client-scoped order/sale selectors using `customerId` and `sale.orderId`, deriving historical totals from line snapshots; verify Node tests with two clients and changed current prices that no foreign details leak or historical totals drift.
- [x] 5.2 Render `/client/orders` with store, items, pending status, snapshot total, mock payment summary, and honest empty/session-reset state; verify browser access for owner versus other roles and 320-pixel keyboard/readability behavior, with components ≤80 lines.

## 6. Cross-feature verification

- [x] 6.1 Run the existing Node tests, `npm run build` (including component-size check), and `npm run lint` only if configured; verify no broken imports, unapproved packages, direct mutation, unnecessary effects, or regression in catalog/auth routes.
- [x] 6.2 Verify every client-shopping scenario end to end, including store switching, checkout failures with no partial state, duplicate submission, logout, history isolation, and responsive/accessibility behavior; run strict OpenSpec validation and record any deviation before considering the change complete.
