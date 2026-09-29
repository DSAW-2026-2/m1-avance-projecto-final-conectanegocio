# Proposal

## Why

The React foundation can navigate but has no account state, working login, registration, or protected route. Mock authentication and a shared permission boundary are needed before later role-specific capabilities can safely connect their navigation and screens.

## What Changes

- Replace the `/login` placeholder with mock credential login and add `/register` for the five defined roles and employee subroles. Validate business registrations against canonical mock stores/distributors and their company codes.
- Introduce `AuthContext` for demo and registered users, the current session, and `login()`, `register()`, and `logout()`. Limit browser persistence to registered accounts and the current session.
- Add protected, identity-only landing pages at `/client/dashboard`, `/store/dashboard`, and `/distributor/dashboard`; redirect after login by role and enforce dashboard access independently of navigation visibility.
- Show only accessible, implemented destinations in navigation. Clearly label demo credentials and company codes as mock data, with no claim of production security.
- Update the living `frontend-foundation` requirements that currently describe `/login` as unavailable and all protected paths as unimplemented. Keep `/products` as an unavailable placeholder.
- Leave catalog, cart, sales, inventory, orders, invoices, reports, chat, dynamic product routes, and business-data authorization to later changes. Do not import or overwrite the historical M1 registration implementation.

## Capabilities

### New Capabilities

- `authentication-role-access`: Mock account registration, login/logout, session recovery, role/subrole policy, protected dashboard access, and permission-aware navigation.

### Modified Capabilities

- `frontend-foundation`: Revise the public-route and honest-placeholder requirements so login is functional, registration and protected identity dashboards exist, and the product placeholder remains clearly unavailable.

## Impact

- Extends only the new `frontend/` React application; root M1 files and its separate localStorage registration records remain unchanged.
- Uses the existing React, React Router, JavaScript, and plain CSS stack. No additional package, backend, database, remote identity provider, or deployment is planned.
- Affects `client`, `store_admin`, `store_employee` (`cashier`, `inventory`), `distributor_admin`, and `distributor_employee` (`sales`, `inventory`, `logistics`). Store and distributor accounts retain organization IDs for later data scoping.
- All permission checks are demonstrative frontend rules, not security against a person who can inspect or alter browser code and storage.
