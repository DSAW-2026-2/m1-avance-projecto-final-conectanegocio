# Tasks

## 1. Coherent data and shared store context

- [x] 1.1 Add one product mock catalog (target 15–20 stable IDs) and store-inventory entries linked to the two existing stores; verify a seed audit finds valid references, unique IDs/composite store-product keys, numeric prices/stock, two-store differences, one-store-only offer, low stock, and zero stock.
- [x] 1.2 Add pure offer/availability/category selectors that distinguish invalid store, missing product, missing store offer, and zero stock; verify Node tests cover both-store price/stock changes, no cross-store fallback, empty inventory, and threshold boundaries.
- [x] 1.3 Add the minimal `DataContext` provider and hook owning `selectedStoreId` and guarded `selectStore`, mounted above `AppRoutes` without coupling to `AuthContext`; verify known/invalid store selection behavior with a focused check and confirm the provider wraps the route tree.

## 2. Search and catalog UI

- [x] 2.1 Add `useDebouncedValue(value, delay)` using state, effect dependency array `[value, delay]`, timer, and cleanup; verify rapid typing settles on the final query and cleanup prevents stale updates using a focused check or browser timing test.
- [x] 2.2 Add a labeled native `StoreSelector` reused by list and detail, with an explicit unselected option; verify keyboard selection and that no price/stock appears before a valid choice.
- [x] 2.3 Add labeled name/category controls with page-local input state and pure combined filtering over current-store offers; verify case-insensitive search, category-only, combined results, empty matches, and category reset/current-store recalculation after switching stores.
- [x] 2.4 Add focused `ProductCard` and `ProductList` using shared offer data and genuine detail links; verify each offered product appears once, zero-stock and low-stock labels are correct, and a one-store-only product is absent from the other store.
- [x] 2.5 Compose `ProductsPage` with distinct no-store, empty-store, and no-filter-results messaging and replace the `/products` placeholder mapping; verify public signed-out browsing and each state in the browser without a dummy cart action.

## 3. Dynamic detail and route integration

- [x] 3.1 Add `ProductDetailPage` using `useParams()` and focused presentation; verify it imports/builds and pure lookup tests distinguish known offer, unknown product ID, known-but-not-sold product, and no-store context.
- [x] 3.2 Add `/products/:productId` to central public `destinations` without a menu item or new role policy; verify those four rendered detail states, card navigation, HashRouter refresh/direct route, retained store across in-app navigation, and unchanged protected-route behavior.
- [x] 3.3 Check catalog/detail interaction flow after switching stores, including a detail-store switch; verify price/stock/availability belong to the current store and no data from a previous store appears.

## 4. Presentation and integrated verification

- [x] 4.1 Add catalog-specific plain CSS using existing tokens/components; verify desktop/tablet/mobile layout and no clipping or horizontal page scrolling at 320 px.
- [x] 4.2 Audit catalog/detail headings, native control labels, semantic links, visible focus, empty/error messages, and keyboard-only flow; verify manually in the browser and keep the existing shell's skip link working.
- [x] 4.3 Run the existing component-size check and split any component exceeding 80 lines; verify `npm run check:components` passes without compressed unreadable JSX.
- [x] 4.4 Run existing tests, `npm run build`, lint if a lint script exists, and strict OpenSpec validation; verify all pass, inspect warnings, and confirm no new package, application persistence key, M1 modification, or out-of-scope business action was introduced.
