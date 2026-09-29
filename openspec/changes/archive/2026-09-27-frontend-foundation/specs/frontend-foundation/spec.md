# Spec Delta

## Purpose

Provide a locally usable, accessible frontend shell that later capabilities can extend while preserving the existing M1 prototype and making unfinished business routes unmistakable.

## ADDED Requirements

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
The frontend SHALL display a home view identifying ConectaNegocio and clearly labeled placeholders for the planned public login and product routes. Navigation among these foundation routes SHALL work within the application, and an unknown route SHALL display a not-found message with a way back home.

#### Scenario: Visit a known foundation route
- **WHEN** a visitor opens `/`, `/login`, or `/products` in the new application
- **THEN** the home view identifies ConectaNegocio, while the login and products views explicitly state that those features are not yet available

#### Scenario: Refresh a foundation route
- **WHEN** a visitor refreshes a known foundation route while served as static files
- **THEN** the same view remains available without a server-side route handler

#### Scenario: Visit an unknown route
- **WHEN** a visitor opens a route not provided by the foundation
- **THEN** a not-found message and a working way back to the home view are displayed

### Requirement: Honest feature boundaries
Foundation placeholders SHALL NOT imply that authentication, catalog browsing, or role-protected business functions are operational. Unimplemented protected routes SHALL NOT display role-specific data or controls.

#### Scenario: Open a planned public feature placeholder
- **WHEN** a visitor opens the login or products placeholder
- **THEN** the view identifies the feature as not yet available and offers no misleading working submission or purchase action

#### Scenario: Open a future protected path
- **WHEN** a visitor navigates directly to a store, distributor, client, or chat path not yet implemented
- **THEN** no protected dashboard or business data is shown

### Requirement: Accessible responsive shell
The foundation SHALL present a page structure with a main landmark, one page-level heading per view, keyboard-reachable navigation, a skip-to-content control, visible keyboard focus, and usable layout on narrow and wide screens.

#### Scenario: Navigate with a keyboard
- **WHEN** a visitor uses only the keyboard from the top of a foundation page
- **THEN** the skip link appears on focus and moves focus to the main content, and every navigation action is reachable with visible focus

#### Scenario: View on a narrow screen
- **WHEN** a visitor views a foundation page at a 320-pixel-wide viewport
- **THEN** the page has no horizontal scrolling and its text and navigation remain visible without clipping or overlap

### Requirement: Consistent identity and empty-state presentation
Foundation views SHALL use the ConectaNegocio identity and the same public navigation and unavailable-content presentation across routes.

#### Scenario: Compare foundation views
- **WHEN** a visitor moves between the home, placeholder, and not-found views
- **THEN** the same product name and navigation appear, and the two feature placeholders use the same unavailable-content pattern
