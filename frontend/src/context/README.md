# Mock account state

`AuthProvider` owns the registered accounts and current user ID. The current user is derived from the immutable demo users plus valid registered users. Forms keep only their own input state and call `register()` or `login()`; guards and navigation read the same context. `logout()` removes only the session.

Only two localStorage keys are used: `cn-react-auth-v1:registeredUsers` and `cn-react-auth-v1:currentUserId`. Registered records include demo-only plain-text passwords; company codes and password confirmation are never saved with the account. Invalid or colliding stored identities are ignored, and affected sessions are not restored. If browser storage is unavailable, actions still work for the current page session with visible non-persistence feedback. The historical M1 `cn-registered-users` key is neither read nor migrated.

This is a course demonstration, **not real authentication, authorization, or secure credential storage**. Never enter real credentials. Business data does not belong in these keys.

## Catalog, client-shopping, and store-sales context

`DataProvider` exposes product identities, stores, and one in-memory business snapshot for `selectedStoreId`, store inventory, the client cart, customer orders, sales, and shopping feedback. Catalog and detail pages read the same selected store across in-app navigation. A reload resets commercial state, so a direct detail link displays product identity but waits for store selection before showing retail price or stock.

`registerStoreSale()` uses the signed-in store worker's assigned `storeId`, not the public catalog selection. Only store administrators and cashiers may register a sale or view their store's history. Staff and client checkout reuse one pure sale/payment/inventory preparation helper; the store operation commits its sale and stock decrement in one state update, while checkout additionally creates the customer order and clears the cart. Store sale attempts carry a session-only ID to prevent duplicate decrements. The shared `sales` collection includes both channels and is the source for future derived reports, which are not implemented here.

The browsing store is independent of the signed-in account's organization and does not grant administrative access. Inventory entries refer to `productId` and `storeId`; customer-facing price and availability are derived from the selected store's entry. A nonempty cart blocks switching stores until it is explicitly emptied. Checkout validates against current stock and prices, then makes one coherent state transition creating a pending customer order, linked sale and payment, inventory decrement, and empty cart. Failed checkout changes no business records. Cart and history are client-scoped mock views; this is not real payment processing or security. No catalog, cart, order, sale, or selected-store data is written to `localStorage`.
