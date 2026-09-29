# Tasks

## 1. Establish mock identities and pure rules

- [x] 1.1 Add minimal store/distributor seeds with stable IDs and codes, plus eight demo identities covering every required role/subrole combination. Verify every demo ID and trimmed/lowercased email is unique, every organization reference resolves, and the legacy M1 data and scripts remain unchanged.
- [x] 1.2 Add pure registration validation for required fields, globally unique user ID and normalized email across demo/registered users, client password confirmation, organization/code matching, and role-specific subroles. Verify valid client and both employee registrations, case/whitespace email duplicates, ID collision avoidance, wrong-company and invalid codes, mismatched confirmation, and invalid subrole with dependency-free tests.
- [x] 1.3 Add a shared fail-closed role/subrole permission predicate and role-to-dashboard mapping. Verify all role redirects; an inventory-only policy permits the inventory employee but denies the cashier and an admin unless explicitly listed; missing employee subrole, missing required role entry, malformed/empty/unknown subrole values, and malformed policy data deny access.
- [x] 1.4 Add guarded, namespaced helpers for registered-account and session-ID storage only. Verify malformed data and stale IDs recover without a crash; conflicting stored email/ID with demo users or other otherwise valid stored users discards all conflicting persisted records, preserves unrelated valid records, and invalidates a session referencing a conflicted ID. Verify unavailable/throwing storage preserves in-memory use with honest non-persistence feedback.

## 2. Own account and session state in AuthContext

- [x] 2.1 Add the AuthProvider with one-time guarded restoration, `registeredUsers`, a stored session ID, and derived `currentUser`; expose only the documented context API. Verify a valid unique session restores after reload while a stale, malformed, or conflict-referencing session leaves the user signed out without an effect-driven storage loop.
- [x] 2.2 Implement `register()` with immutable state updates and validated, minimal account records. Verify registration never stores the company code, does not sign the new account in automatically, and leaves an existing session unchanged.
- [x] 2.3 Implement `login()` against demo and registered identities and `logout()` for the current session. Verify bad credentials do not change the current user, successful login updates the session, and logout clears the session without deleting registered accounts.
- [x] 2.4 Document the mock-account and session boundary alongside the state module: browser storage is not a secure credential store or general app database, and existing M1 localStorage data is not migrated. Verify the documented keys match the implemented helpers.

## 3. Enforce access at routes and in navigation

- [x] 3.1 Define one small, central catalog of implemented destinations with path, page identifier, authentication requirement, role/subrole policy, and optional navigation metadata. Verify every implemented route resolves one definition, malformed policies deny by default, and future business paths are absent.
- [x] 3.2 Add `ProtectedRoute` consuming the selected central destination policy and shared permission predicate. Verify signed-out visitors go to `/login`, wrong-role or wrong-subrole visitors go to their own dashboard, unresolved/malformed policies render no protected view, and authorized users render without redirect loops.
- [x] 3.3 Register `/register` and protected `/client/dashboard`, `/store/dashboard`, and `/distributor/dashboard` from those definitions under the existing `HashRouter`. Verify direct hash navigation and refresh, preserve `/products` as a placeholder, and keep unregistered future business routes at the not-found boundary.
- [x] 3.4 Add identity-only dashboard placeholders and navigation filtered from the same destination definitions, including logout. Verify the menu and direct-route decisions agree for every role/subrole, hidden links do not bypass the guard, and no sales, inventory, order, invoice, report, or chat behavior appears.

## 4. Present accessible account forms

- [x] 4.1 Replace the login placeholder with a focused login form and a clear demo-account entry point. Verify success, invalid-credential feedback, role-specific redirect, authenticated visitor redirect, labeled controls, and focusable error feedback.
- [x] 4.2 Add the client registration path with name, email, password, and confirmation. Verify missing/invalid input and mismatched confirmation have useful inline feedback, and successful registration leads to login without automatic authentication.
- [x] 4.3 Add role-conditional store/distributor registration fields and employee-only subrole selection. Verify the selected organization and its company code agree, inappropriate fields are not submitted, every required role/subrole can register, and invalid codes or duplicate emails are rejected.
- [x] 4.4 Apply existing plain-CSS tokens to responsive forms, navigation, and dashboard shells. Verify semantic headings, labels, keyboard operation, visible focus, screen-reader-friendly errors, and narrow-viewport layout; keep every React component at or below 80 physical lines.
- [x] 4.5 Update frontend-facing documentation with mock demo credentials, route and registration flows, storage limitations, and the fact that legacy M1 accounts are separate. Verify the examples match the shipped seeds and no production-security claim is made.

## 5. Verify the integrated change

- [x] 5.1 Exercise the specification scenario matrix in the running app: client and employee registration, normalized duplicate emails, unique IDs, all role redirects, denied/malformed role/subrole policies, route/menu agreement, logout, corrupted/ambiguous storage recovery, and responsive/keyboard use. Verify no console errors or premature business features.
- [x] 5.2 Run the repository's build, lint if configured, existing relevant checks, and the component-length gate. Verify no unapproved dependency, direct state mutation, unjustified DOM manipulation or `useEffect`, broken import, or legacy M1 modification; resolve failures within this change's scope.
