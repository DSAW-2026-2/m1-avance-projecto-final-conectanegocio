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

The app uses `HashRouter`. `/` and `/products` are public; `/products/:productId` shows store-specific product detail. `/login` and `/register` provide mock account flows. `/client/dashboard`, `/client/cart`, and `/client/orders` are client-only; store and distributor dashboards remain identity-only. Client checkout records a session-only customer order, linked sale/payment, and inventory decrement. Other business paths still show not-found. Vite uses relative asset paths so the static build can be served beneath a URL prefix; the final GitHub Pages base is a later deployment decision.

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

`src/main.jsx` mounts React, the router, `AuthProvider`, and `DataProvider`; `App.jsx` and `routes/` own route composition. `routes/destinations.js` is the single list of implemented destinations and permissions for route guards and navigation. `AuthContext` owns accounts/session; `DataContext` owns in-memory selected store and commercial state. `data/` holds demo identities, organizations, products, and inventory seeds; `utils/` contains pure catalog, shopping, validation, policy, and storage helpers. `layouts/`, `pages/`, and `components/` keep presentation focused. `config/branding.js` supplies rendered product naming, while `index.html` retains a static bootstrap title. `styles/` contains frontend-only plain CSS and tokens; it does not import the M1 CSS.

`npm run check:components` enforces at most 80 physical lines per JSX file, a deliberately stricter convention than the per-component course rule. It runs during `npm run build`; `node scripts/check-component-size.mjs --self-test` checks the boundary. The skip link focuses `<main>` through a React ref because a native fragment jump would replace the `HashRouter` route. No effect is used for this.
