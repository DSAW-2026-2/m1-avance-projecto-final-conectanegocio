# Proposal

## Why

The repository contains the M1 static prototype but no React application, package manifest, or React Router setup. A small, separately housed frontend foundation is needed so later OpenSpec changes can add business capabilities without overwriting M1 work or inventing infrastructure independently.

## What Changes

- Establish a runnable and buildable React + Vite JavaScript application under `frontend/`, preserving the existing root `index.html`, pages, CSS, JavaScript, and M1 README.
- Provide declarative client-side navigation with `HashRouter`, a public layout, a small set of clearly labeled foundation placeholders, and a not-found route. Keep built asset paths usable when the static app is hosted beneath a URL subpath.
- Establish plain CSS design tokens and responsive, accessible shell conventions informed by the M1 visual language, with centralized ConectaNegocio branding.
- Establish the initial `src/` organization and a dependency-free check for the 80-line React component limit. Add shared components only when used by the foundation screens.
- Deliberately leave authentication, registration, catalog behavior, customer purchases, sales, inventories, supplier comparison, orders, invoices, reports, chat, and their data mutations for later changes. No protected business route will pretend to be authorized before authentication exists.

## Capabilities

### New Capabilities

- `frontend-foundation`: The locally runnable frontend shell, accessible responsive presentation, honest placeholder navigation, and preservation of the M1 prototype.

### Modified Capabilities

None. The project has no existing OpenSpec capability specifications.

## Impact

- Adds a new `frontend/` application with its own package manifest and lockfile; the M1 application remains in place.
- Planned runtime dependencies: `react`, `react-dom`, `react-router`. Planned development dependencies: `vite`, `@vitejs/plugin-react`. No backend or external service is introduced.
- All current roles remain unchanged. Foundation placeholders expose no role-specific functions or privileged data; role/subrole authorization is deferred to a later authentication change.
- This change does not publish, deploy, commit, push, or modify remotes.
