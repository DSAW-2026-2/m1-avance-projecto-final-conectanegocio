# Design

## Context

The React app already uses declarative `HashRouter` routes, a public layout, plain CSS, centralized branding, and a build-time limit of 80 physical lines per JSX file. `/login` and `/products` are placeholders; no `AuthContext`, user seeds, or protected route exists. The root M1 site's `cn-registered-users` record and two-role registration script belong to the preserved historical prototype, not this React app. See `proposal.md` and the two delta specs for behavior.

## Goals / Non-Goals

**Goals:**

- Put one understandable source of account/session state and one reusable permission decision behind login, registration, visible navigation, and direct-route protection.
- Make all five roles and valid employee subroles demonstrable with coherent organization IDs, accessible forms, and honest mock-security language.
- Keep existing public routing, styling, static-host behavior, and M1 files intact while replacing only the login placeholder.

**Non-Goals:**

- Production identity, server authorization, password recovery, email verification, organization administration, or an encrypted credential store.
- Implementing commercial dashboards or data, chat, catalog, dynamic resource routes, or future role-restricted business actions.
- Using browser storage as a sales, inventory, or order database, or syncing sessions across tabs/devices.

## Decisions

### 1. One small AuthContext owns shared account state

`AuthProvider` owns `registeredUsers` and `currentUserId` state, exposing a `currentUser` derived from the combined immutable demo users and registered users plus `login()`, `register()`, and `logout()`. The provider validates preconditions and updates state immutably; forms own only their input values, touched/submitted flags, and displayed errors. Identity and organization seed files are read-only; `DataContext` is not created in this change. Context fits the few cross-route consumers (forms, navigation, guards, landing pages) already approved by the constitution. Alternatives rejected: prop drilling across routes, Redux/Zustand, and duplicating user state in each page. Split storage, validation, and permission helpers from the provider so JSX files remain under 80 lines; `useAuth()` is a thin access hook, not a contrived replacement for the course's later effect-with-cleanup hook.

State transitions are explicit: form input → `login()` or `register()` → `AuthContext` state → derived `currentUser` → `ProtectedRoute` decision → rendered route. Login sets the user ID and then the page navigates to the role dashboard. Registration appends an account, reports success, and navigates to login without setting a session. Logout clears the ID and sends the user to a public route. Neither forms nor routes edit the registered-user array directly.

### 2. Keep persistence narrow, namespaced, and defensive

Use two versioned keys distinct from M1, for example `cn-react-auth-v1:registeredUsers` and `cn-react-auth-v1:currentUserId`. Persist the registered-user array and only the current user's ID for the session; do not store a second session copy of the user or store submitted company codes. Initialize from storage once with guarded reads, parsing, and shape/role/subrole/organization validation. Reject a malformed collection as a whole; ignore individually invalid records without losing unrelated valid records. Before admitting otherwise valid persisted accounts, compare trimmed/lowercased emails and IDs against the immutable demo users and each other. Discard every persisted record involved in an ID or normalized-email conflict, rather than choosing a first or last winner. Keep demo records canonical. Restore a stored session ID only if it is not an ID involved in a conflict and resolves to exactly one admitted demo or registered account; otherwise start signed out. This deliberately sacrifices recovery of an ambiguous account rather than guessing which person it represents.

Login/register/logout perform their storage writes in their event-driven operations, not a `useEffect`. If storage throws, keep the app usable in memory and visibly say the affected change may not survive reload. No storage listener or cross-tab synchronization is required. This is defensive mock-state handling, not tamper-proof browser security or a general database.

Alternatives rejected: persisting all business data, mirroring context state to storage in an effect, and migrating M1's incompatible `cn-registered-users` records. The same-origin browser may expose both apps' keys later, so namespacing matters even when local dev ports differ.

### 3. Seed only identity and organization data needed for this change

Use approximately eight demo users so each role/subrole combination has a test identity: client; store admin; store cashier and inventory employees; distributor admin; distributor sales, inventory, and logistics employees. Seed two stores and three distributors with stable IDs, names, and mock company codes, aligning with the project's eventual data scale. These organization records become the canonical references later; do not duplicate them in form options or dashboards. Registration stores `storeId` or `distributorId`, never an organization name or submitted code on the user. Document fake credentials/codes for local demonstration and warn users not to enter real credentials.

Normalize email by trimming and lowercasing for lookup/uniqueness across demo and admitted registered accounts; do not silently alter passwords. Reject registration when that email already exists. Generate each registered user ID so it cannot collide with any demo or registered ID, and verify uniqueness before appending. Validate required fields, simple email shape, a basic minimum-eight-character password with a letter and digit, selected organization type and matching code, and the employee subrole set. Follow the requested field list literally: password confirmation is required for clients; business roles are not assigned an extra confirmation field. Trim and consistently normalize mock codes for comparison. On a role switch, clear inapplicable organization/subrole inputs in the local form. Prefer straightforward synchronous validation helpers over a form package.

### 4. Share one destination policy between links and guards, but keep checks distinct

Keep one small, static definition for each implemented destination: `path`, page/destination identifier, `requiresAuth`, `allowedRoles`, optional `allowedSubRoles`, and optional navigation label/visibility. Include public destinations and the three implemented dashboards only; future business routes are absent. The router registers those destinations and passes the destination's policy to `ProtectedRoute`; navigation filters those same definitions for visibility and permission. Neither consumer keeps a second role/subrole list. This is a plain JavaScript array or object, not a route framework or dynamic permission engine. A visible link and its direct URL therefore cannot drift because of separately declared role lists, although the guard still evaluates authorization independently when the URL is entered manually.

Represent `allowedSubRoles`, when present, as a map keyed by allowed employee role, such as `{ store_employee: ['inventory'] }`. A single pure `canAccess(user, policy)` validates the user's role/subrole and the destination policy before deciding. When `allowedSubRoles` is absent, all *valid* subroles of an allowed employee role may enter an unrestricted dashboard. When it is present, it must be a well-formed map with nonempty arrays of valid subroles for the relevant employee roles; an employee role lacking an explicit permitted set is denied, as is a user with no valid subrole. Unknown keys, wrong-family or undefined values, an empty set, or other malformed policy data fail closed rather than becoming unrestricted. An administrator is allowed only when explicitly included in a well-formed `allowedRoles`; there is no implicit bypass. `getDashboardPath(role)` maps client → `/client/dashboard`, either store role → `/store/dashboard`, and either distributor role → `/distributor/dashboard`.

`ProtectedRoute` runs the selected destination's policy on every render: signed out → `/login`; wrong role/subrole → the user's own dashboard; allowed → child route. Redirects replace history and the safe destination must itself admit that user to avoid loops. If no valid destination policy can be resolved, no protected view is rendered; the app uses a safe not-found or denied state instead of granting access. Only three identity-only dashboards are registered now. `/products` stays a placeholder; unimplemented sales, inventory, chat, and other paths remain not-found with no business data. A future change must add its route and navigation metadata to the same definitions and use the same predicate for its actions. A pure policy check can be tested now with a hypothetical subrole-restricted destination without adding a fake business page.

The layout renders links only for implemented destinations whose navigation metadata is visible and whose shared policy `canAccess` permits, plus appropriate public links; signed-in users see their dashboard and logout instead of login/register. Link hiding improves clarity but is not authorization: a typed URL still reaches `ProtectedRoute`. Alternatives rejected: duplicated route/menu permission lists, role-only checks, subrole checks scattered among components, hidden-link-only protection, and pre-registering every future business route as a dummy page. Retain `HashRouter` and use React Router navigation rather than assigning `window.location`.

### 5. Keep account UI accessible and components focused

Replace `PlaceholderPage` only for `/login`; retain it for `/products`. Compose a small `LoginPage`, `RegisterPage`, shared labeled field primitive, conditional organization/subrole fields, and one identity-only role dashboard. Reuse the existing header, skip link, footer, CSS tokens, and `EmptyState`; extract navigation if extending `PublicLayout` would exceed 80 lines. Keep validation messages adjacent to labeled fields with `aria-invalid` and `aria-describedby`, provide submission status feedback, use suitable `autocomplete`, and retain visible focus and responsive wrapping at 320 pixels. No title-setting effect, DOM query, extra UI library, or decorative inactive business controls are needed.

## Risks / Trade-offs

- **Client-side access can be bypassed by editing JS or localStorage** → Describe accounts, passwords, company codes, and permission gates as demonstrations only; never request real credentials or claim production security. A client-side hash would not create a trusted security boundary.
- **A stale or hand-edited session can create impossible account state** → Resolve by ID against validated demo/registered accounts and fail closed to signed out when invalid; discard all conflicting persisted records and invalidate sessions referencing conflicted IDs rather than selecting an arbitrary account. Never trust a stored role without validation.
- **A malformed destination/subrole policy can accidentally widen access** → Validate policy shape and subrole values; deny when a required permission cannot be demonstrated. Derive route and menu decisions from the same small destination definitions.
- **Organization seeds may diverge from later business data** → Give stores/distributors stable IDs now and require later DataContext seed changes to reuse these records, not copy them.
- **Role-based redirects can loop or expose another account view** → Keep the dashboard mapping total for valid roles, use a safe fallback for invalid records, and test direct URL entry and history/back behavior.
- **Storage can be unavailable or exceed quota** → Catch reads/writes and report non-persistence while allowing an in-memory demo session; do not silently promise recovery.
- **Subrole-specific business pages are not yet present** → Test the policy with subrole-restricted cases, but do not claim those features or navigation links are implemented.
- **Eight demo identities and conditional fields can push components over 80 lines** → Keep seed data outside JSX, split form sections and pure helpers, and run the existing component-size/build check.

## Local introduction and recovery

Implement only under `frontend/` and update its run/demo notes. Verify role and subrole matrix cases, registration validation, persistence/reload, logout, direct URL guards, keyboard/form feedback, 320-pixel layout, and static `HashRouter` refresh. The existing M1 entry and files remain untouched. No deployment, remote Git operation, or history change is part of this plan.
