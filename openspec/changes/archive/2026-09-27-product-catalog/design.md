# Design

## Context

See `proposal.md`. The current Vite/React/JavaScript app uses `HashRouter`, `PublicLayout`, central `destinations`, `AuthProvider`, and mock organizations. `/products` is a placeholder; there is no `DataContext`, product catalog, store inventory, or catalog hook yet. The M1 static prototype is preserved separately. The living foundation spec must change where it promises a products placeholder.

## Goals / Non-Goals

**Goals:** Provide one explainable public browse flow whose retail information always belongs to a selected store; establish a small shared state and ID-based offer lookup reusable by later client shopping. Meet the dynamic-route and custom-hook course examples without duplicating derived state.

**Non-Goals:** Mutable inventory operations, account-based store authorization, cart/checkout, supplier offers, persistence of commercial state, new packages, or a general-purpose data layer.

## Decisions

### Product identity and retail offer

Keep `Product` (`id`, `name`, `category`, `description`) in one product mock file and `StoreInventoryItem` (`id`, `storeId`, `productId`, `quantity`, `minStock`, `salePrice`, `lastPurchasePrice`) in one store-inventory mock file. Store and distributor identities remain in `data/organizations.js`. All IDs are stable strings; inventory references products/stores by IDs, never embeds whole objects. Audit seed references and ensure at most one inventory entry per `(storeId, productId)`. Aim for 15–20 products across two existing stores, with enough inventory to show shared products with different prices/stock, a one-store-only product, low stock, and zero stock. Numeric COP values remain unformatted in source data; render formatting is presentation-only.

One pure offer selector joins `productId` and `storeId` and returns product + matching inventory item, or an explicit absent/invalid outcome. The listing first restricts inventory to the selected store and resolves product IDs, so a missing offer never inherits another store's data. Quantity `0` is out of stock; positive quantity `<= minStock` is low stock; higher quantity is available. Never use `lastPurchasePrice` as a customer price. `SupplierOffer.price` is a distributor-to-store purchasing price for a later capability, not the retail `StoreInventoryItem.salePrice`. A universal `Product.salePrice` would misrepresent the approved business model and is rejected.

### Shared selected-store ownership

Introduce the planned principal `DataContext` with a small provider exposing mock products/inventory as read-only catalog data, `selectedStoreId`, and a guarded `selectStore(id)` operation. It is independent of `AuthContext`; both catalog routes are public, and a browsing store is not inferred from an account's `storeId`. Start with no selection. `selectStore` accepts only IDs present in `stores`; invalid or stale IDs yield no selected store and no commercial offer. Keep selected store in React memory for the current application session, not `localStorage`; full reload/direct-link entry may require reselection. A single provider above `AppRoutes` preserves the choice across catalog/detail navigation. Add no other business mutations in this change; later operations can make inventory stateful behind the same read interface when their own specs approve them, without changing selected-store ownership.

Page-local state fails on route unmount. URL path/query state could support bookmarked store-specific prices, but requires encoding and reconciling the store through every public/future cart route; that is unnecessary for the approved same-session contract. Browser storage would persist commercial context beyond the explicit account/session exception and risks a stale/wrong store. A separate `CatalogContext` would duplicate the designated `DataContext` boundary. Shared Context is the smallest approved solution and leaves `client-shopping` a direct contract: read `selectedStoreId`, read/join inventory by store/product IDs, and require a valid store at cart/checkout boundaries; that later change decides cart-switch behavior and inventory mutations.

### Catalog data flow and debounce

`ProductsPage` owns only input search text and selected category. A `useDebouncedValue(value, delay)` hook keeps its own delayed copy with `useState`; `useEffect` schedules `setTimeout` on `[value, delay]` and returns `clearTimeout(timer)` as cleanup. The effect is justified because it synchronizes a timed external callback with changing input, not because filtering needs an effect. On fast typing, cleanup cancels the preceding timer and only the latest value settles after a short fixed delay (e.g. 250 ms). Any valid delay is nonnegative; the page uses one stable constant.

Flow: input -> page `search` state -> render -> hook timer -> `debouncedSearch` -> pure offer filtering -> render. Derive visible offers from selected-store inventory, resolved products, trimmed/lowercased debounced name query, and category; never store `filteredProducts` separately or use `useEffect` to calculate it. Derive category choices from products offered by the current store. The store-selection handler resets the page-local category to All while leaving search text intact; this avoids an invalid old-store category and makes remaining no-results states truthful. Search and category are AND conditions. Distinguish no store, empty inventory, and no filter matches. No API or network request is involved.

### Routing, detail and resource states

Extend the existing `destinations` array with public `/products/:productId` (no navigation item); change the `products` page mapping from `PlaceholderPage` to `ProductsPage` and map detail to `ProductDetailPage`. Keep `HashRouter` and the central route/navigation policy; do not make a separate router. `ProductDetailPage` uses `const { productId } = useParams()` and resolves product identity first. Unknown ID: product-not-found with catalog link, even if no store selected. Known ID with no valid selected store: show identity and a store selector but no commercial fields. Known ID with valid store and no inventory entry: not-sold-by-this-store message, with no price or borrowed stock. Matching entry: show description, category, store name, numeric-derived availability, retail price, and stock. A store selector on both listing and detail lets changes take effect immediately. An out-of-stock item remains browsable but has no purchase action.

`/products` is the only top-level product navigation item. Existing protected dashboards and their permission logic remain untouched. On refresh, the hash route still resolves, but the in-memory store resets: the catalog prompts for selection, and detail can show identity without offer until selection. This is transparent and avoids implying bookmarked price persistence.

### Components, styles, accessibility

`ProductsPage` coordinates selectors and states; `StoreSelector` renders a labeled native select; `ProductFilters` owns labeled search/category controls (or a small `SearchBar` if it keeps the component under 80 lines); `ProductList` renders the grid/empty result; `ProductCard` presents concise offer info and a real detail link; `ProductDetailPage` resolves the route and delegates substantial presentation to a focused detail component if needed. A small catalog-specific message component may distinguish selection, no-results, not-sold, and not-found states. Reuse foundation typography, `form-field`, links, tokens, layout, and focus patterns. Do not reuse the current `EmptyState` unchanged because its hardcoded “En preparación” and home link would falsely label a working catalog; either make that primitive genuinely configurable without breaking prior callers or use a focused catalog message component. No decorative nonfunctional cart button.

Use plain CSS in a catalog-specific stylesheet on top of existing tokens. A responsive grid collapses to one column; controls wrap/stack at narrow widths without horizontal scrolling at 320 px. Preserve one `h1` per page, main landmark and skip link from `PublicLayout`, labeled native controls, semantic links, visible focus, and understandable empty/error wording. Product cards use a heading below page level. Audit every React component with the existing 80-line check, splitting responsibilities rather than compressing JSX. No direct DOM manipulation or new dependency.

### Verification strategy

Add focused pure-helper/hook tests where feasible with existing tools, and browser-check public routing, direct detail URL, store switching, search debounce, filter combinations, invalid ID, no-store/not-sold/zero-stock states, keyboard operation, and mobile layout. Run existing build/component-size check and any available lint/test scripts; validate OpenSpec. Do not add a test framework merely for this change. No authentication requirement is added.

## Risks / Trade-offs

- In-memory store selection is lost on reload or fresh deep link -> show product identity/selection prompt without price or stock; never silently default.
- Mock records can contain duplicate `(storeId, productId)` or missing references -> seed audit and pure-selector tests; do not arbitrarily pick a conflicting offer.
- A rapid store switch while a search timer is pending -> filtering always joins the current store and latest debounced query; no prior-store price can linger.
- `minStock` is a display threshold, not a purchasing/recommendation policy -> use it only for low-stock labeling here.
- Large page/card components or a wrongly generalized empty-state primitive -> split focused components and reuse CSS; enforce the existing 80-line script.
- This is publicly visible mock catalog data, not live inventory -> identify demo context and avoid claims of real-time availability.

## Migration Plan

During later implementation, replace only the React `/products` placeholder, add the public detail route and catalog files, then validate the delta before archiving/syncing it. Existing M1 pages and auth routes remain unchanged. There is no deployment or persistent-data migration in this change.
