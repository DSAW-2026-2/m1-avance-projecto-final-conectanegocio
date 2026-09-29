# Design

## Context

The repository currently runs the M1 prototype from its root `index.html` and has no `package.json`, React source, or React Router installation. The M1 CSS already contains a useful palette, spacing scale, responsive breakpoints, and focus treatment. See `proposal.md` for motivation and `specs/frontend-foundation/spec.md` for observable requirements. The OpenSpec config's present-tense React description is interpreted as the target project state; the actual source remains static M1 code.

## Goals / Non-Goals

**Goals:**

- Give later changes a local, static-buildable React application with clear ownership of the entry point, routes, styling, and component organization.
- Preserve the M1 site exactly while establishing a coherent visual and accessibility baseline for the new app.
- Make foundation routes useful for navigation checks without suggesting that business capabilities already exist.

**Non-Goals:**

- Implement authentication, registration, authorization, role dashboards, product data, carts, sales, inventory, comparisons, orders, invoices, reports, messaging, or persistence of business state.
- Deploy or configure a final GitHub Pages URL or repository-specific absolute asset base.

## Decisions

### 1. Isolate the new application under `frontend/`

The root `index.html`, `pages/`, `css/`, `js/`, and README remain the historical M1 application. Create a second app entry at `frontend/index.html` with its own `package.json`, lockfile, Vite config, and `src/`. Development and build commands run from `frontend/`. This avoids replacing an existing entry file and makes preservation verifiable. Alternatives rejected: converting the root in place would overwrite or relocate M1 files; mounting React inside the M1 pages would couple the new architecture to the old DOM and scripts.

### 2. Use React + Vite + JavaScript, with only required packages

Use the Vite React JavaScript setup, not TypeScript or a full-stack framework. The direct runtime packages are `react`, `react-dom`, and `react-router`; the direct development packages are `vite` and `@vitejs/plugin-react`. Record resolved versions in `frontend/package-lock.json` when installed. The foundation needs only `dev`, `build`, and `preview` scripts plus the component-size check. React matches the course learning objectives; Vite gives a small local development and static build toolchain. Alternatives rejected: Next.js and React Router Framework Mode add server and framework conventions outside the approved scope; TypeScript is not approved; extra state, UI, testing, or lint packages are not needed for the initial shell.

### 3. Use declarative React Router with `HashRouter`

Place the router at the app entry, keep route declarations in `src/routes/AppRoutes.jsx`, and render them through a small `App.jsx`. `HashRouter` keeps route paths in the URL fragment, which a static host does not send to its server; a known route can survive refresh without a rewrite rule. Use `Link`/`NavLink` for internal navigation and a `*` not-found route. Register only `/`, `/login`, and `/products` for now; login and products show explicit unavailable placeholders. Future protected paths fall through to not-found; a later authentication change must add both route guards and matching navigation permissions. Alternatives rejected: `BrowserRouter` would depend on host fallback configuration; Data/Framework Router modes add loaders and conventions the mock-data course app does not need. Configure Vite `base: './'` so this foundation's built assets are relative to its entry page and work under a static URL subpath. A later deployment change may replace this with the final repository-specific base; `HashRouter` alone does not fix asset paths.

### 4. Keep screen and shared-state boundaries simple

Use `src/main.jsx` only for mounting and the router; `App.jsx` coordinates the shell; `AppRoutes.jsx` declares routes; `PublicLayout.jsx` provides header, skip link, main landmark, and footer. A dashboard layout is deferred until a protected route uses it. `AuthContext` later owns `currentUser`, registered users, login/register/logout; `DataContext` later owns shared commercial entities and centralized mutations. Do not create empty providers or fake authentication now. Search, sort, form, and modal state remain local to their eventual owners; cart ownership across routes is decided in the customer-purchase change. Context is sufficient for this course-scale frontend; Redux/Zustand and placeholder global state would add complexity without a current consumer.

Planned organization (create folders only when they contain a useful file):

```text
frontend/
  index.html
  package.json / package-lock.json
  vite.config.js
  scripts/check-component-size.mjs
  src/
    main.jsx
    App.jsx
    config/branding.js
    routes/AppRoutes.jsx
    layouts/PublicLayout.jsx
    pages/HomePage.jsx, PlaceholderPage.jsx, NotFoundPage.jsx
    components/common/EmptyState.jsx
    styles/tokens.css, base.css, layout.css, components.css
    context/, data/, hooks/, utils/   # future files only when needed
```

### 5. Use plain CSS and selective M1 visual continuity

Keep React CSS scoped to `frontend/src/styles/`; do not import the root M1 page styles. Adapt the existing navy, cream, terracotta, status colors, spacing, radii, and focus treatment into CSS custom properties, checking contrast in the new layout. Start mobile-first at 320 pixels; let navigation wrap rather than adding a JavaScript menu just for the foundation. Scale the container upward. Keep status badges, forms, tables, and dashboard-specific CSS for features that use them. A single branding module supplies the rendered product name and accessible brand labels. The static HTML bootstrap title is the one documented duplicate of the product name; it remains useful before JavaScript loads. Do not add an effect or direct DOM write merely to update a fixed title. Alternatives rejected: Tailwind, Bootstrap, and Material UI are outside the approved stack; wholesale reuse of M1 CSS would bring legacy page selectors and layout assumptions into React.

### 6. Establish accessible and honest shared UI conventions

The public layout uses semantic `header`, `nav`, `main`, and `footer`, a visible-on-focus skip link targeting a focusable main landmark (for example, `tabIndex={-1}`), one page-level heading, meaningful link text, and visible `:focus-visible` states. Mark the current public navigation destination accessibly, for example with `NavLink`'s current-page semantics. A small `EmptyState` supports the intentionally unavailable placeholders; `NotFoundPage` handles unmatched paths and offers a route home. Only build a reusable component when more than one actual foundation screen needs it. Do not show login forms, product cards, protected navigation, or disabled controls that imply completed behavior. Later forms should use labels, inline validation, and announced error text, but no form infrastructure is created now. A global ErrorBoundary is deferred until its recovery behavior is specified and needed.

### 7. Enforce the 80-line component limit with a local check

Add a dependency-free Node script that scans React `.jsx` files under `src/` and fails if any file exceeds 80 physical lines, including comments and blanks. Expose it through an npm script and run it with the build check. This is intentionally stricter than counting component function bodies and keeps compliance easy to inspect. Split future route groups and components into focused files instead of compressing code. No extra lint package is required for this specific rule.

### 8. Keep the foundation frontend-only

The new app makes no backend request and needs no backend process. Business state, company codes, payments, invoice reading, and chat are outside this change. A static build and local preview demonstrate the hosting model without deploying it. The future mock-data approach is retained because the course deliverable is a frontend prototype; adding a server would violate the defined scope.

## Risks / Trade-offs

- **Two app entry points in one repository** → Document that React commands run in `frontend/`; leave the M1 entry untouched and verify its tracked files did not change.
- **Public placeholders may look like finished features** → Label them clearly as unavailable, omit fake forms and product actions, and avoid protected-route registration.
- **M1 tokens may not meet new contrast or responsive needs** → Adapt selectively and check keyboard focus, text contrast, and 320-pixel layout on actual foundation screens.
- **A GitHub Pages repository path may break asset URLs later** → Use relative built asset paths now and verify them under a local URL subpath. The final deployment must still confirm its exact URL/base configuration; `HashRouter` solves route refresh, not asset loading.
- **The 80-line file check is stricter than the rubric's per-component wording** → State the convention in the script and split files rather than weakening the limit.
- **Empty architectural shells create false completeness** → Defer providers, hooks, mock entities, role layouts, and business utilities until a later change needs them.
- **A foundation-only demo does not yet satisfy the full course rubric** → The dynamic `useParams` route, protected redirect, meaningful custom hook with effect cleanup, business transitions, and role/subrole authorization belong to later feature changes; do not invent them here as empty demonstrations.

## Local introduction and recovery

Implementation adds files only under `frontend/` and leaves the M1 application available. Verify local start, static build, preview, route refresh, built assets under a local URL subpath, narrow layout, keyboard navigation, component-size check, and unchanged M1 tracked files. No deployment or Git history operation is part of this change. Because the apps are separate, a foundation failure does not replace the M1 entry point.
