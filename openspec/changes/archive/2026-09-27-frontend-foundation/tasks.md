# Tasks

## 1. Local React toolchain

- [x] 1.1 Create `frontend/package.json` for JavaScript React with only `react`, `react-dom`, `react-router`, `vite`, and `@vitejs/plugin-react`; install locally and verify `frontend/package-lock.json` exists and `npm ls --depth=0` lists the intended direct packages.
- [x] 1.2 Add `frontend/index.html`, Vite config with relative `base: './'`, `src/main.jsx`, and a minimal `App.jsx`; verify `npm run dev` loads the new entry and `npm run build` produces static assets without a backend.
- [x] 1.3 Add a frontend-local ignore file and concise run instructions for `dev`, `build`, and `preview`; verify those commands work from `frontend/` and Git ignores only generated frontend artifacts, not M1 source.

## 2. Public shell and navigation

- [x] 2.1 Add the centralized ConectaNegocio branding module and a small `PublicLayout` with header, navigation, skip link, main landmark, and footer; set the static HTML bootstrap title without a title-setting effect. Verify the home view shows the intended name, the current navigation destination is identified, and keyboard focus reaches the skip link and main content.
- [x] 2.2 Add only the home view, reusable unavailable-content presentation, and not-found view; verify each view has a clear heading, and the unavailable views contain no working login, product, or purchase controls.
- [x] 2.3 Add `HashRouter` and `AppRoutes` for `/`, `/login`, `/products`, and `*`, using in-app links; verify each known route displays its intended view and an unknown route provides a working link home.
- [x] 2.4 Verify a known foundation route still displays after refresh in local static preview, and direct `/client/*`, `/store/*`, `/distributor/*`, and `/chat` visits show no protected data or controls.

## 3. Styling and accessibility baseline

- [x] 3.1 Add frontend-local plain CSS tokens and base/component styles adapted selectively from the M1 palette; verify the shell does not import root M1 page CSS and text, links, and focus indicators remain readable.
- [x] 3.2 Add mobile-first container and wrapping navigation layout rules; verify at 320 pixels that foundation pages have no horizontal page scrolling, clipped text, or overlapping navigation, and check the hierarchy on a wide viewport.
- [x] 3.3 Check the home, placeholder, and not-found screens using keyboard-only navigation; verify visible focus, skip-link behavior, one page-level heading, meaningful navigation labels, and consistent empty-state wording.

## 4. Component discipline and handoff

- [x] 4.1 Add a dependency-free `check:components` script for all `src/**/*.jsx` files with an 80-physical-line limit and make the build run it; verify the check passes for the foundation and rejects an over-limit sample.
- [x] 4.2 Document the frontend folder boundaries, placeholder routes, deferred providers/data/hooks/utilities, and component-size convention in the frontend run instructions; verify the documented local commands run as written.
- [x] 4.3 Run an integration check with `npm run build` and `npm run preview`; verify foundation navigation, static-route refresh, and narrow-screen layout, then serve the built files locally beneath a URL subpath to confirm JavaScript and CSS load. Confirm tracked M1 files are unchanged and no business feature or backend package was added.
