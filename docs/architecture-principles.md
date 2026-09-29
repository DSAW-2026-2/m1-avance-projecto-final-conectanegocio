# Architecture principles — ConectaNegocio React prototype

Read [project-definition.md](project-definition.md) for roles, flows, routes, and data contracts. These principles govern OpenSpec planning and later implementation. The M1 HTML/CSS/JavaScript prototype is existing work to preserve; changes to it require an explicit specification or request.

## Approved implementation scope

Use Vite, React, JavaScript, JSX, plain CSS, React Router, `useState`, props, React Context, `useParams`, justified `useEffect`, one understandable custom hook (prefer `useDebouncedValue`), and related mock data. Keep the work at a basic-to-intermediate level that the undergraduate team can explain.

Do not add TypeScript, Next.js, Redux, Zustand, React Query, Firebase, Supabase, Node/Express backend, databases, Tailwind, Bootstrap, Material UI, additional state-management packages, OCR, payment SDKs, AI APIs, or WebSockets without an explicit architecture decision and user approval. A dependency required by the approved stack must still be justified in its OpenSpec change.

## Shared state and operations

Use two principal contexts:

- `AuthContext`: `currentUser`, `registeredUsers`, `login()`, `register()`, `logout()`.
- `DataContext`: products, inventory, sales, orders, invoices, messages, supplier offers, and the business operations that change them.

Context is sufficient for this frontend-only course scope and avoids Redux's extra concepts. Keep local interaction state in the page or component that owns it: search, category, payment selection, form values, modal state, file selection, sorting, and message input. Avoid turning every local value into global state.

Centralize cross-feature mutations in named operations such as `registerStoreSale()`, `checkoutCustomerOrder()`, `createPurchaseOrder()`, `updateOrderStatus()`, `updateInventory()`, `updateDistributorStock()`, `addInvoice()`, and `sendMessage()`. A form gathers inputs and calls an operation; it does not directly coordinate sales, inventory, and orders. This prevents duplicated logic and makes state transitions traceable during the oral defense. Validate preconditions before making a coherent change. Never mutate React state directly.

Compute reports, totals, filtered lists, availability, and recommendations from source state. Do not mirror `totalRevenue`, filtered products, or similar derived values in independent React state unless a documented reason exists. This avoids synchronization bugs and unnecessary rerenders.

Use `useEffect` for synchronization or lifecycle behavior when appropriate, not for ordinary calculations during render. The preferred `useDebouncedValue(value, delay)` hook uses `useState`, `useEffect`, `setTimeout`, dependency array `[value, delay]`, and `clearTimeout(timer)` cleanup. The team must be able to explain every dependency and the cleanup. Avoid direct DOM manipulation (`document.querySelector`, `getElementById`, `innerHTML`) except for a documented exception.

## Data integrity and simulated behavior

Treat product, user, store, and distributor catalogs as single sources of truth, linked by stable IDs. Do not duplicate product definitions in pages, sales, reports, or unrelated mock files. Keep money numeric in COP and dates ISO-compatible.

Use mock data because the deliverable is a frontend prototype. Mocking should preserve realistic state changes and never suggest a real service exists. `localStorage` should be used only for a justified persistence requirement; the initial plan permits demo registered users and `currentUser`, while commercial state may reset on reload. Demo authentication is not production security. Do not use real personal credentials in seeds or examples.

For invoice analysis, match only known demo invoice metadata or filenames and clearly label the result as simulated. OCR and arbitrary PDF understanding are outside scope. For reports and recommendations, use transparent JavaScript calculations rather than AI predictions.

## Navigation and permissions

Prefer `HashRouter` because GitHub Pages and similar static hosts do not generally route arbitrary application paths to the SPA entry point. `ProtectedRoute` must check authentication and the relevant role/subrole permission. Hide unavailable navigation and block direct URL access to the same destination. Scope data and operations to the account's organization. Never rely on a hidden button as the only permission check.

## Components and presentation

Pages coordinate screens; focused components render one responsibility; utilities calculate reusable business results. Keep every React component at or below 80 lines, ideally 30–60. Extract behavior or subcomponents instead of compressing unreadable code to meet the limit. Reuse CSS tokens and components for a consistent, responsive, accessible interface. Important buttons and forms must produce coherent state transitions, useful validation, and feedback; a screen that merely renders does not complete a feature.

## Architectural invariants

| ID | Rule |
| --- | --- |
| INV-01 | Never directly mutate React state. |
| INV-02 | Maintain single sources of truth; relate entities by stable IDs. |
| INV-03 | Calculate derived values from source state unless a documented need requires storage. |
| INV-04 | No React component exceeds 80 lines. |
| INV-05 | Do not introduce technologies outside the approved stack without an architecture decision and user approval. |
| INV-06 | Never present mocked behavior as a real external integration. |
| INV-07 | Put business-state mutations in centralized operations, not arbitrary presentation components. |
| INV-08 | A feature's primary interactions must cause coherent state transitions. |
| INV-09 | Enforce authorization in both navigation and protected-route access. |
| INV-10 | Keep this development phase local: no remote Git operations. |

## Planning and delivery discipline

Use OpenSpec's `spec-driven` schema: proposal → specs → design → tasks before application implementation. Each change should state behavior, acceptance criteria, state transitions, permission impacts, data relationships, and any deviation from these documents. Design notes should explain major choices and rejected alternatives where relevant. Preserve existing M1 work. Do not commit, push, change remotes, create pull requests, or deploy without a later explicit request.
