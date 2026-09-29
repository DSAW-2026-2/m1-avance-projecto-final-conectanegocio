# ConectaNegocio — frontend

Run these commands from `frontend/`:

```sh
npm install
npm run dev
npm run build
npm run preview
node --test tests/*.test.mjs
```

`dev` serves the local React app. `build` creates static files in `dist/`; `preview` serves that build locally. The historical M1 site remains at the repository root.

The app uses `HashRouter`. Public routes include `/`, `/products`, `/products/:productId`, `/login`, and `/register`. Client routes cover dashboard, catalog, cart, checkout, and orders. Store routes cover sales, inventory, supplier comparison, supplier details, purchase orders, invoices, reports, recommendations, and chat. Distributor routes cover dashboard, catalogue/inventory, incoming orders, status updates, and chat. Vite uses relative asset paths so the static build can be served beneath a URL prefix.

All demo accounts use password `Demo2026!`:

| Role / subrole | Email |
| --- | --- |
| client | `cliente@demo.test` |
| store_admin | `tienda.admin@demo.test` |
| store_employee / cashier | `cajero@demo.test` |
| store_employee / inventory | `tienda.inventario@demo.test` |
| distributor_admin | `distribuidor.admin@demo.test` |
| distributor_employee / sales | `distribuidor.ventas@demo.test` |
| distributor_employee / inventory | `distribuidor.inventario@demo.test` |
| distributor_employee / logistics | `distribuidor.logistica@demo.test` |

Mock company codes: Papelería Central `TIENDA-CENTRAL`, Papelería Norte `TIENDA-NORTE`, Distribuciones Andinas `DIST-ANDINAS`, Suministros Capital `DIST-CAPITAL`, Mayorista Escolar `DIST-ESCOLAR`. Register with a matching organization and code, then log in; registration does not sign you in automatically. Login redirects to the role's dashboard. Logout clears the current account session and cart, but not registered accounts; session-only order history remains scoped to its customer until reload. Direct protected URLs are checked independently of which links appear in navigation.

These accounts, passwords, codes, and route guards are **frontend-only demonstrations, not real authentication or security**. Never enter real personal credentials. The only localStorage keys are `cn-react-auth-v1:registeredUsers` and `cn-react-auth-v1:currentUserId`; they are not a business database. Stored account collisions/corruption are handled defensively. The historical root M1 prototype and its `cn-registered-users` records are separate and are not migrated.

`src/main.jsx` mounts React, the router, `AuthProvider`, and `DataProvider`; `App.jsx` and `routes/` own route composition. `routes/destinations.js` is the single list of implemented destinations and permissions for route guards and navigation. `AuthContext` owns accounts/session; `DataContext` owns in-memory products, offers, inventory, orders, sales, invoices and messages. `data/` holds demo identities and seeds; `utils/` contains pure catalog, shopping, supply-chain, reporting, invoice and messaging rules. `layouts/`, `pages/`, and `components/` keep presentation focused. `styles/` contains frontend-only plain CSS and tokens; it does not import the historical M1 CSS.

`npm run check:components` enforces at most 80 physical lines per JSX file, a deliberately stricter convention than the per-component course rule. It runs during `npm run build`; `node scripts/check-component-size.mjs --self-test` checks the boundary. The skip link focuses `<main>` through a React ref because a native fragment jump would replace the `HashRouter` route. No effect is used for this.
