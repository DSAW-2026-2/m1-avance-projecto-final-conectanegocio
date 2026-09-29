# frontend-foundation Specification

## Purpose

Provide a locally usable, accessible frontend shell that later capabilities can extend while preserving the existing M1 prototype and making unfinished business routes unmistakable.

## Requirements

### Requirement: Separate local frontend
The project SHALL provide a frontend that can be started locally and built into static assets without altering the existing M1 prototype.

#### Scenario: Start the new frontend
- **WHEN** a developer starts the frontend using its documented local command
- **THEN** the new application loads in a browser without requiring a backend service

#### Scenario: Preserve the M1 prototype
- **WHEN** the new frontend is added to the repository
- **THEN** the existing root M1 entry page, internal pages, scripts, styles, and README remain available and unchanged

#### Scenario: Load built assets beneath a URL subpath
- **WHEN** the built frontend is served locally from a URL prefix rather than the domain root
- **THEN** its entry page, JavaScript, and CSS load without broken asset paths

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
The product catalog SHALL display only mock store-specific offer information; implemented client shopping and store sales/payments SHALL be identified as session-only mock behavior, while other unimplemented business functions SHALL remain unmistakably unavailable. Mock account forms and protected identity dashboards SHALL NOT imply production authentication, real payment processing, or completed business capabilities beyond the implemented client-shopping and store-sales workflows. Unimplemented business routes SHALL NOT display business data or controls.

#### Scenario: Open a planned public feature placeholder
- **WHEN** a visitor opens `/products`
- **THEN** store-contextual catalog browsing is available; only a signed-in client with a purchasable offer sees the implemented mock shopping entry point, not a misleading real-payment action

#### Scenario: Open a future protected path
- **WHEN** a visitor navigates directly to a store, distributor, client, or chat business path that has not been implemented
- **THEN** no business dashboard, data, or controls are shown

#### Scenario: Open an implemented account dashboard
- **WHEN** an authorized user opens their role's protected dashboard
- **THEN** the view identifies the current mock account and organization without showing invented commercial activity; a client may see genuine session shopping links, while a permitted store administrator or cashier may see a genuine session sales link

### Requirement: Accessible responsive shell
The foundation SHALL present a page structure with a main landmark, one page-level heading per view, keyboard-reachable navigation, a skip-to-content control, visible keyboard focus, and usable layout on narrow and wide screens.

#### Scenario: Navigate with a keyboard
- **WHEN** a visitor uses only the keyboard from the top of a foundation page
- **THEN** the skip link appears on focus and moves focus to the main content, and every navigation action is reachable with visible focus

#### Scenario: View on a narrow screen
- **WHEN** a visitor views a foundation page at a 320-pixel-wide viewport
- **THEN** the page has no horizontal scrolling and its text and navigation remain visible without clipping or overlap

### Requirement: Consistent identity and empty-state presentation
Foundation, account, and catalog views SHALL use the ConectaNegocio identity and consistent public navigation, while empty catalog results, unfinished content, and missing routes SHALL remain clearly distinguished.

#### Scenario: Compare foundation views
- **WHEN** a visitor moves among home, login, registration, products, product detail, dashboard, and not-found views that are available to that visitor
- **THEN** the same product name and navigation conventions appear, while catalog empty states, unfinished features, and missing routes use distinct and accurate explanations
