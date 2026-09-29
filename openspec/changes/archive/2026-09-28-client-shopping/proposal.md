# Proposal

## Why

The public catalog already identifies store-specific products, prices, and stock, but a client cannot complete the intended purchase flow. This change connects that existing browse context to a coherent mock cart, checkout, and personal order history without implying real payments or a backend.

## What Changes

- Add client-only shopping entry points, a store-bound cart with quantity/removal controls and derived totals, and a simple single-method mock checkout supporting cash, card, or nequi.
- On successful checkout, create a customer order and corresponding sale with payment records, decrement the selected store's inventory, and clear the cart as one coherent business transition. Reject invalid/duplicate checkout without partial business updates.
- Add protected `/client/cart` and `/client/orders` routes; show each client only their own order history. Keep the public catalog/detail available to everyone, with a client-only add-to-cart action when an offer is purchasable.
- Preserve the existing selected-store rule. A nonempty cart blocks switching to another store until the client explicitly empties it; no products or prices from different stores are mixed.
- Keep commercial state in the current React session. No new package, backend, real payment service, or change to the historical M1 prototype.

Out of scope: store-employee sales UI, supplier comparison or purchase orders, distributor operations, invoices, reports UI, messaging, split-payment UI, and customer order-status administration.

## Capabilities

### New Capabilities

- `client-shopping`: Client cart, checkout, order/sale/payment/inventory transition, and own-order history.

### Modified Capabilities

- `frontend-foundation`: Cart and checkout become implemented client features rather than universally unavailable future features; unrelated unfinished routes remain honest.
- `product-catalog`: Valid store offers gain a client-only purchase entry point while public browsing, store-specific data, and unavailable-product behavior remain unchanged.

## Impact

Extends the existing `DataContext` business operations and store selection, central destination policy, client dashboard, product detail, and plain-CSS UI. Auth/role behavior remains centralized; `AuthContext` continues to own accounts and session only. Existing React/Vite/Router dependencies suffice. The M1 static prototype and all other roles' business screens remain untouched.
