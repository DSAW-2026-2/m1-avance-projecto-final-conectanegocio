# Spec Delta

## Purpose

Provide honest, frontend-only account flows and a consistent role/subrole access boundary so later ConectaNegocio capabilities can add protected screens without duplicating permission decisions.

## ADDED Requirements

### Requirement: Role-aware mock registration
The application SHALL register accounts for `client`, `store_admin`, `store_employee`, `distributor_admin`, and `distributor_employee` with the fields defined for each role. A client SHALL provide name, email, password, and password confirmation. A store account SHALL provide name, email, password, a selected store, and its matching company code; a distributor account SHALL provide the analogous distributor fields. Employee accounts SHALL additionally provide a valid subrole for their own primary role. Every demo and registered user SHALL have a globally unique user ID and an email unique after trimming and lowercasing. Successful registration SHALL create a registered account but SHALL NOT sign it in automatically.

#### Scenario: Register a client
- **WHEN** a visitor submits a valid client name, unused email, password, and matching password confirmation
- **THEN** a client account is registered and the visitor is directed to login with success feedback, without an active session

#### Scenario: Register a store employee with a valid company code
- **WHEN** a visitor chooses `store_employee`, selects a known store, provides that store's matching mock company code, selects `cashier` or `inventory`, and submits otherwise valid fields
- **THEN** the registered account has `storeId` and the selected store subrole, and the visitor is directed to login without an active session

#### Scenario: Register a distributor employee with a valid company code
- **WHEN** a visitor chooses `distributor_employee`, selects a known distributor, provides that distributor's matching mock company code, selects `sales`, `inventory`, or `logistics`, and submits otherwise valid fields
- **THEN** the registered account has `distributorId` and the selected distributor subrole, and the visitor is directed to login without an active session

#### Scenario: Register a business administrator
- **WHEN** a visitor chooses `store_admin` or `distributor_admin` and submits valid common fields plus a known organization of the matching type and its company code
- **THEN** an administrator account is registered with that organization's ID and no employee subrole

#### Scenario: Reject an invalid company code
- **WHEN** a business registrant provides a missing code or a code that does not match the selected store or distributor
- **THEN** registration is rejected with field-level feedback and no account or session is created

#### Scenario: Reject an invalid subrole
- **WHEN** an employee registration omits its subrole or submits a subrole from the wrong role family
- **THEN** registration is rejected and no account is created

#### Scenario: Reject duplicate or invalid identity fields
- **WHEN** registration uses an email that matches a demo or registered account after trimming and lowercasing, omits a required field, or submits a client password confirmation that does not match
- **THEN** registration is rejected with relevant feedback and existing account data remains unchanged

#### Scenario: Generate an unambiguous registered identity
- **WHEN** a valid registration succeeds
- **THEN** its generated user ID differs from every demo and registered user ID, and its normalized email differs from every demo and registered email

### Requirement: Mock credential login and role destination
The application SHALL match login credentials against demo and registered accounts, set the current user only for a successful match, and navigate to the dashboard for that account's primary role.

#### Scenario: Successful login
- **WHEN** a visitor submits the email and password of a demo or registered account
- **THEN** that account becomes the current user and its protected dashboard is shown

#### Scenario: Invalid credentials
- **WHEN** a visitor submits credentials that do not match any account
- **THEN** an error is presented without revealing which field was wrong, and the current session is not changed

#### Scenario: Role-specific redirect after authentication
- **WHEN** login succeeds for a `client`, a store administrator/employee, or a distributor administrator/employee
- **THEN** the destination is respectively `/client/dashboard`, `/store/dashboard`, or `/distributor/dashboard`

#### Scenario: Authenticated user opens account entry pages
- **WHEN** a signed-in user opens `/login` or `/register`
- **THEN** the user is returned to their own dashboard instead of a second account form

### Requirement: Limited account and session persistence
The application SHALL keep registered accounts and the current mock session across reloads using browser storage only for those purposes. It SHALL validate persisted account shapes and roles, normalize emails for identity comparison, and prevent persisted records from introducing duplicate IDs or emails relative to demo users or other valid persisted records. Conflicting persisted records SHALL be discarded safely; a session reference to a conflicted ID SHALL not be restored. It SHALL reject unusable stored account or session data safely and SHALL not treat storage as a trusted authorization source or general application database.

#### Scenario: Recover a valid session
- **WHEN** the app reloads after a registered account has been saved and a valid account has signed in
- **THEN** the registered account remains available for login and the current user is restored to the same permitted dashboard

#### Scenario: Reject stale or malformed stored state
- **WHEN** stored account data is malformed or the stored current-user reference no longer resolves to a valid demo or registered account
- **THEN** the app remains usable, does not show a protected dashboard for that reference, and treats the visitor as signed out

#### Scenario: Ignore a persisted identity that conflicts with a demo account
- **WHEN** a stored registered account has the same normalized email or user ID as a demo account
- **THEN** the persisted account is not admitted, the demo identity remains unchanged, and a session reference to a conflicted ID is not restored

#### Scenario: Reject ambiguous persisted accounts
- **WHEN** two otherwise valid persisted accounts share a normalized email or user ID
- **THEN** neither conflicting account is admitted, unaffected valid accounts remain usable, and a session reference to a conflicted ID is not restored

#### Scenario: Browser storage cannot persist a change
- **WHEN** the browser refuses an account or session storage operation
- **THEN** the app does not claim that the affected account or session will survive a reload and presents honest feedback without crashing

### Requirement: Protected role and subrole access
The application SHALL authorize implemented protected destinations from the current user's primary role and, where a destination declares a subrole restriction, the corresponding valid employee subrole. Route protection and navigation SHALL derive their authorization policy from the same central definition of each implemented destination, rather than independently maintained role lists. An unauthenticated visitor SHALL be sent to login; an authenticated visitor lacking permission SHALL be sent to that user's own safe dashboard. Authorization SHALL be checked on direct URL visits as well as in-app navigation. Malformed or ambiguous authorization policies SHALL deny access rather than grant it.

#### Scenario: Unauthenticated protected-route access
- **WHEN** a signed-out visitor opens an implemented protected dashboard URL directly
- **THEN** the visitor is redirected to `/login` and no protected account view is rendered

#### Scenario: Authenticated but unauthorized role access
- **WHEN** a signed-in client opens a store or distributor dashboard URL, or a store account opens a distributor dashboard URL
- **THEN** the user is redirected to their own dashboard and no other role's account view is rendered

#### Scenario: Subrole restriction
- **WHEN** a protected destination declares `store_employee/inventory` access and a signed-in `store_employee/cashier` requests it
- **THEN** permission is denied, while a matching inventory employee or a store administrator permitted by that destination's role policy is allowed

#### Scenario: Fail closed on an incomplete subrole policy
- **WHEN** a destination requires subrole restriction but its subrole policy is malformed, lacks an explicit permitted subrole for the requesting employee role, names an invalid subrole, or the employee has no valid subrole
- **THEN** access is denied and the destination's protected view is not rendered; no missing or ambiguous permission is treated as an allow

#### Scenario: Use the same policy for route access and navigation
- **WHEN** a destination's centrally defined role or subrole policy changes
- **THEN** its visible navigation link and its direct-route access reflect that same policy; hiding a link alone does not replace the direct-route check

#### Scenario: Authorized dashboard access
- **WHEN** a signed-in user opens the dashboard assigned to their role
- **THEN** an identity-only landing view for that user and organization is shown, without fabricated business metrics or actions

### Requirement: Permission-aware navigation and logout
Navigation SHALL expose only implemented destinations allowed to the current user, using the same permission rules as protected routes. Logout SHALL end the current mock session and remove protected access without deleting registered accounts.

#### Scenario: Navigation visibility by permission
- **WHEN** a user signs in with a role or employee subrole
- **THEN** navigation shows only implemented destinations permitted to that identity and hides other roles' dashboards and unfinished business links

#### Scenario: Hidden navigation does not grant access
- **WHEN** a user directly enters the URL of another role's implemented dashboard despite its link being absent
- **THEN** the protected-route decision still denies access and redirects to the user's own dashboard

#### Scenario: Logout
- **WHEN** a signed-in user logs out
- **THEN** the current session is cleared, login and registration become available, and a later direct visit to a protected dashboard redirects to login

### Requirement: Accessible and honest account interface
Account forms SHALL provide labels, applicable field errors, keyboard-reachable controls, and visible status feedback. The UI SHALL identify demo accounts and company codes as mock data and SHALL warn against entering real credentials.

#### Scenario: Correct a registration error
- **WHEN** a visitor submits missing or invalid registration fields and then corrects them
- **THEN** the relevant fields identify their errors and the corrected submission can proceed using the keyboard

#### Scenario: Read the demo limitation
- **WHEN** a visitor views login or registration guidance
- **THEN** the page explains that accounts, codes, and permissions are frontend-only demonstrations rather than real security or an external authentication service
