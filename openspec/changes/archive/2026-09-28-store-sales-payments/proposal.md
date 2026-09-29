# Proposal

## Why

The existing client checkout records sales and reduces store inventory, but authorized store staff cannot register an in-person sale or review their store's sales. This change adds that workflow while keeping customer and staff sales consistent for later reporting.

## What Changes

- Add `/store/sales` for `store_admin` and `store_employee/cashier`, with a store-scoped sale form and sales history; deny inventory employees and all other roles.
- Register one or more current-store items at current `StoreInventoryItem.salePrice`, reconcile mock cash/card/nequi payments to the derived total, and commit exactly one sale and its inventory decrement together.
- Reuse the client-checkout sale/inventory transaction rules without changing customer order or cart behavior.
- Add honest, accessible, responsive store-sales entry points and feedback. Extend the foundation's honest-feature boundary to recognize this implemented mock workflow.
- No supplier, distributor, invoice, report UI, customer-order status, real payment, backend, or M1 prototype changes.

## Capabilities

### New Capabilities

- `store-sales-payments`: Authorized store sale registration, payments, inventory consistency, and store-scoped history.

### Modified Capabilities

- `frontend-foundation`: Its honest-feature boundary and store dashboard scenario must permit real session-only store-sales entry points while still excluding unfinished capabilities.

## Impact

Planning affects the existing React frontend's central route policy, DataContext operation, shared sale transaction utility, store-sales page/components/styles, and tests. It adds no package, persistence layer, or external service. Store sales join the same in-session `sales` collection as client checkout; future reports can derive from that collection. Existing M1 files remain untouched.
