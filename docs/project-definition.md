# Project definition — ConectaNegocio React prototype

## Status and purpose

This document defines the planned React project. The existing `README.md`, HTML pages, CSS, and JavaScript document and implement the earlier M1 static prototype; they are historical project assets to preserve. This document is the source of truth for the new frontend scope and does not claim that the React application has already been built.

ConectaNegocio is a fully functional frontend prototype for small retail stores, initially modeled around a stationery store. Retailers currently use fragmented tools for sales and inventory, while comparing suppliers, purchasing, processing invoices, and analyzing the business require substantial manual work. The product centralizes customers, stores, distributors, products, supplier offers, both sides' inventory, sales and payments, customer and supplier orders, invoices, reports, recommendations, and messaging.

“Fully functional” means that each primary interaction produces a visible, coherent change in the current application session. All external integrations are simulated and must be described honestly. There is no backend, database, production authentication, real payment processing, OCR, AI analysis, or real-time messaging service. Commercial mock state may reset on reload; `localStorage` is reserved for specific justified needs, such as demo registered users and the current user.

## Users and permissions

The five primary roles are `client`, `store_admin`, `store_employee`, `distributor_admin`, and `distributor_employee`. Store employees have `cashier` or `inventory` subroles; distributor employees have `sales`, `inventory`, or `logistics` subroles. Scope store and distributor data to the account's `storeId` or `distributorId`.

| Role / subrole | Allowed work | Explicit limits |
| --- | --- | --- |
| `client` | Browse catalog and details; cart, checkout, own orders, relevant chat | No store or distributor administration |
| `store_admin` | Full store dashboard, sales, inventory, supplier comparison, purchase orders, invoices, reports, chat | Only their store's business data |
| `store_employee/cashier` | Register sales, view necessary store inventory, relevant chat | No complete reports or unrestricted inventory administration |
| `store_employee/inventory` | Manage store inventory, compare suppliers, create purchase orders, upload/analyze demo invoices, relevant chat | No complete reports unless the specification changes |
| `distributor_admin` | Distributor dashboard, catalog, inventory, incoming orders and status, chat | Only their distributor's data |
| `distributor_employee/sales` | View and confirm applicable incoming orders, chat | No inventory or logistics administration |
| `distributor_employee/inventory` | Manage distributor catalog and inventory, chat | No order status administration |
| `distributor_employee/logistics` | View incoming orders, mark applicable orders shipped or delivered, chat | No catalog or inventory administration |

Navigation and protected routes must enforce the same permissions. Unauthenticated visitors to protected routes go to login; authenticated users without permission are redirected safely to an allowed destination.

## Core business flows

1. **Store sale:** validate stock, create a sale, record one or more payments (`cash`, `card`, `nequi`), reduce store inventory, and update dependent views and reports. The payment model supports split payments even if most sales use one method.
2. **Customer purchase:** catalog → detail → cart → checkout → payment → order. A successful checkout creates a customer order and corresponding sale, reduces store inventory, and clears the cart.
3. **Supplier comparison:** compare offers for the same `productId` by price, distributor stock, and delivery time. Provide factual sorting and filtering; never invent a universal “best supplier.”
4. **Store purchase order:** store → distributor. Supplier order states are `pending`, `confirmed`, `shipped`, `delivered`, and `cancelled`. Creation does not add store stock. The first transition to `delivered` adds stock exactly once.
5. **Customer order:** states are `pending`, `confirmed`, `ready`, `completed`, and `cancelled`. Distinguish customer and supplier orders with `orderType`.
6. **Invoice analysis:** select a predefined demo invoice/file; match it to mock metadata for supplier, products, quantities, costs, and total. Combine these costs with sales and inventory for analysis. Unknown files receive an honest demo-mode message. No arbitrary PDF reading, OCR, or AI is implied.
7. **Reporting:** derive revenue, estimated gross profit, sale count, payment totals, top/low selling products, low/out-of-stock products, supplier spending, purchase recommendations, and low-rotation products from source state using transparent JavaScript calculations.
8. **Chat:** customer ↔ store and store ↔ distributor. Sending a message updates shared React state and the UI in the current session; there is no cross-device synchronization or WebSocket connection.

## Planned routes

Use React Router with `HashRouter` for eventual static hosting unless a documented constraint justifies another router. Use `useParams` for the resource routes.

| Access | Routes |
| --- | --- |
| Public | `/`, `/login`, `/register`, `/products`, `/products/:productId` |
| Client | `/client/dashboard`, `/client/cart`, `/client/orders`, `/chat` |
| Store | `/store/dashboard`, `/store/sales`, `/store/inventory`, `/store/suppliers`, `/store/suppliers/:supplierId`, `/store/orders`, `/store/invoices`, `/store/reports`, `/chat` |
| Distributor | `/distributor/dashboard`, `/distributor/catalog`, `/distributor/inventory`, `/distributor/orders`, `/chat` |

`/chat` is one shared protected route whose accessible conversations depend on the current role and organization. Employee subroles receive only the routes and actions permitted above.

## Data contracts and scale

Use stable string IDs (for example `u001`, `p001`, `s001`, `d001`, `ord001`). Product definitions exist once; related data refers to `productId`. Relationships use IDs such as `userId`, `storeId`, `distributorId`, `orderId`, and `conversationId`. Store money as numeric COP values, not formatted strings, and dates as ISO-compatible strings.

| Entity | Representative fields |
| --- | --- |
| User | `id`, `name`, `email`, `password` (demo only), `role`, `subRole`, `storeId`, `distributorId` |
| Store | `id`, `name`, `companyCode` |
| Distributor | `id`, `name`, `companyCode`, `deliveryDays` |
| Product | `id`, `name`, `category`, `description` |
| SupplierOffer | `id`, `productId`, `distributorId`, `price`, `stock`, `deliveryDays` |
| StoreInventoryItem | `id`, `storeId`, `productId`, `quantity`, `minStock`, `salePrice`, `lastPurchasePrice` |
| Sale | `id`, `storeId`, `createdBy`, `date`, `items[]`, `payments[]`, `total` |
| Order | `id`, `orderType`, `storeId`, `distributorId`, `customerId`, `items[]`, `status`, `createdBy`, `createdAt` |
| Invoice | `id`, `fileName`, `supplierId`, `storeId`, `items[]`, `totalCost`, `date` |
| Message | `id`, `conversationId`, `senderId`, `text`, `timestamp` |

No universal product price exists: a store's sale price belongs to its inventory entry, while a distributor's price belongs to its offer. Demo passwords and company codes are mock values only; never ask users to enter real credentials into the prototype.

Aim for approximately 8–10 users, 2 stores, 3 distributors, 15–20 products, 30+ offers, 15–20 inventory entries, 15+ sales, 8–10 orders, 3–5 invoices, 3–5 conversations, and 15+ messages. Deviations should have a documented reason. All seeded IDs and references must resolve coherently.

## Course and presentation outcomes

The implementation must have at least three routes, a dynamic route using `useParams`, an unauthenticated protected-route redirect, and a custom hook with a dependency array and cleanup. No React component may exceed 80 lines; prefer focused components of roughly 30–60 lines. Team members must be able to explain state transitions such as search → state update → rerender, login → context → route access, and sale → inventory → reports.

The final interface should use plain CSS with consistent spacing, typography, controls, forms, cards, status badges, tables, dashboard navigation, responsive layouts, accessible labels, visible focus, empty states, and validation feedback. Aim for a restrained modern commerce-management aesthetic. Keep the product name centralized and replaceable. GitHub Pages is an eventual delivery target, not an action to take during current planning.
