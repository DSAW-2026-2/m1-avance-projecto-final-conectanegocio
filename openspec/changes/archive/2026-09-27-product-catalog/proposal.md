# Proposal

## Why

Visitors need to browse products in a chosen store's commercial context. Product identity alone cannot determine a retail price or availability: each store may carry different stock, charge a different price, or not offer the product.

## What Changes

- Replace the public `/products` placeholder with a store selector and a catalog of that store's offers, including name search, category filtering, availability, and useful empty states.
- Add public `/products/:productId` detail navigation and explicit handling of invalid product IDs and products not sold by the selected store.
- Add coherent product and store-inventory mock data linked by IDs, and shared selected-store state that survives catalog/detail navigation and can later be reused by client shopping.
- Introduce the course-required `useDebouncedValue` hook for search; keep filtered results derived rather than separately stored.
- Preserve the current public route architecture, styling conventions, responsive/accessibility baseline, and M1 prototype.

No authentication permission changes are proposed: both catalog routes remain public for signed-in and signed-out visitors. Store selection for public browsing is not a business-account authorization grant.

## Capabilities

### New Capabilities

- `product-catalog`: Store-contextual public listing, search, category filtering, offer details, and resource/empty-state behavior.

### Modified Capabilities

- `frontend-foundation`: Replace its `/products` unavailable-placeholder contract with an implemented catalog, add the dynamic public detail route to known routes, and retain honest placeholders only for unfinished features.

## Impact

- Affects frontend mock data, shared business/context boundary, product pages/components, a small custom hook, public destination definitions, and plain CSS. No new package, backend, external API, or M1 asset change.
- Depends on the archived `frontend-foundation` route/shell and `authentication-role-access` centralized navigation policy, plus the existing store mock data. Future `client-shopping` may consume the selected store and offer lookup but is not implemented here.
- Out of scope: cart, checkout, orders, sales, payment, stock decrement, supplier comparison/offers, purchasing, invoices, reports, chat, and deployment.
