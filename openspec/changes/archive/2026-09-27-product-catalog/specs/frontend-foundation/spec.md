# Spec Delta

## MODIFIED Requirements

### Requirement: Navigable foundation routes
The frontend SHALL display a home view identifying ConectaNegocio, working mock account-entry routes at `/login` and `/register`, and an implemented public catalog at `/products` with product detail at `/products/:productId`. Navigation among implemented public routes SHALL work within the application, and an unknown route SHALL display a not-found message with a way back home.

#### Scenario: Visit a known foundation route
- **WHEN** a visitor opens `/`, `/login`, `/register`, or `/products` in the new application
- **THEN** the home view identifies ConectaNegocio, login and registration present mock account forms to signed-out visitors, and products presents store-contextual catalog browsing rather than an unavailable placeholder

#### Scenario: Refresh a foundation route
- **WHEN** a visitor refreshes a known foundation route, including a product detail URL, while served as static files
- **THEN** the route remains available without a server-side route handler, subject to the visitor's current account and selected-store state; if the store was not retained across reload, commercial information waits for store selection

#### Scenario: Visit an unknown route
- **WHEN** a visitor opens a route not provided by the current application
- **THEN** a not-found message and a working way back to the home view are displayed

### Requirement: Honest feature boundaries
The product catalog SHALL display only mock store-specific offer information; cart, checkout, and other unimplemented business functions SHALL remain unmistakably unavailable. Mock account forms and protected identity dashboards SHALL NOT imply production authentication or completed business capabilities. Unimplemented business routes SHALL NOT display business data or controls.

#### Scenario: Open a planned public feature placeholder
- **WHEN** a visitor opens `/products`
- **THEN** store-contextual catalog browsing is available without a misleading purchase or checkout action

#### Scenario: Open a future protected path
- **WHEN** a visitor navigates directly to a store, distributor, client, or chat business path that has not been implemented
- **THEN** no business dashboard, data, or controls are shown

#### Scenario: Open an implemented account dashboard
- **WHEN** an authorized user opens their role's protected dashboard
- **THEN** the view identifies the current mock account and organization without showing invented commercial activity

### Requirement: Consistent identity and empty-state presentation
Foundation, account, and catalog views SHALL use the ConectaNegocio identity and consistent public navigation, while empty catalog results, unfinished content, and missing routes SHALL remain clearly distinguished.

#### Scenario: Compare foundation views
- **WHEN** a visitor moves among home, login, registration, products, product detail, dashboard, and not-found views that are available to that visitor
- **THEN** the same product name and navigation conventions appear, while catalog empty states, unfinished features, and missing routes use distinct and accurate explanations
