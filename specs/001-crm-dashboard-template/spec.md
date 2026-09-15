# Feature Specification: CRM Dashboard Template

**Feature Branch**: `feature/crm-dashboard-template`

**Created**: 2026-09-14

**Status**: Draft

**Input**: User description: "I want to build a CRM production-ready template app. Simple dashboard that can operate CRUD functions, include core crm features, add user auth. this is only a template/demo project."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Authenticated User Signs In (Priority: P1)

A new or returning user arrives at the app and must log in before accessing any CRM data. They enter their credentials, are verified, and land on the main dashboard. If credentials are wrong, they see a clear error message. On success, their session persists across page refreshes until they explicitly sign out.

**Why this priority**: Authentication is the gate to every other feature. Without it, no other user story is accessible or meaningful.

**Independent Test**: Can be fully tested by visiting the login page, submitting credentials, and verifying the dashboard renders — or verifying an error message appears on bad credentials.

**Acceptance Scenarios**:

1. **Given** an unauthenticated visitor, **When** they access any protected route, **Then** they are redirected to the login page.
2. **Given** a user on the login page, **When** they submit valid credentials, **Then** they are redirected to the dashboard and their name/role is visible in the header.
3. **Given** a user on the login page, **When** they submit invalid credentials, **Then** an inline error message appears and they remain on the login page.
4. **Given** an authenticated user, **When** they click "Sign Out", **Then** their session is destroyed and they are redirected to the login page.
5. **Given** an authenticated user who refreshes the page, **When** the page reloads, **Then** they remain logged in and see the same dashboard view.

---

### User Story 2 - Dashboard Overview (Priority: P2)

After signing in, a user sees a summary dashboard showing key CRM metrics at a glance: total contacts, total companies, open deals, and recent activity. This gives the user a quick snapshot of the pipeline health without navigating to detail pages.

**Why this priority**: The dashboard is the primary landing screen and orientates users. It demonstrates the value of the template immediately.

**Independent Test**: Can be tested by signing in and verifying the dashboard displays metric tiles and a recent-activity feed with seeded demo data.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they view the dashboard, **Then** they see metric summary tiles (Contacts, Companies, Deals, and Recent Activity).
2. **Given** no data exists yet, **When** the dashboard loads, **Then** each metric tile shows zero or an empty state with a prompt to add records.
3. **Given** records exist, **When** the dashboard loads, **Then** counts reflect the actual stored data without manual refresh.

---

### User Story 3 - Manage Contacts (Priority: P3)

A user can view a paginated list of contacts, create a new contact, edit an existing contact's details, and delete a contact. Each contact has a name, email, phone, company association, and status (e.g., Lead, Active, Inactive).

**Why this priority**: Contacts are the core entity of any CRM. CRUD on contacts is the minimum viable CRM feature.

**Independent Test**: Can be tested by navigating to /contacts, creating a new contact via the form, editing it, verifying it appears in the list, then deleting it and confirming it disappears.

**Acceptance Scenarios**:

1. **Given** an authenticated user on the Contacts page, **When** it loads, **Then** all contacts are listed in a table with name, email, company, and status columns.
2. **Given** a user who clicks "New Contact", **When** they fill in required fields and submit, **Then** the new contact appears in the list.
3. **Given** a contact in the list, **When** the user clicks "Edit", **Then** a form pre-filled with existing values allows updates and saves correctly.
4. **Given** a contact in the list, **When** the user clicks "Delete" and confirms, **Then** the contact is removed from the list.
5. **Given** a user who submits the form with missing required fields, **When** the form is submitted, **Then** inline validation messages highlight each missing field.

---

### User Story 4 - Manage Companies (Priority: P4)

A user can view, create, edit, and delete company records. Each company has a name, industry, website, and size category. Contacts can be associated with a company.

**Why this priority**: Companies are the second core entity in a B2B CRM. Associating contacts to companies is a standard CRM pattern.

**Independent Test**: Can be tested by navigating to /companies, creating a company, then editing and deleting it to confirm full CRUD works end-to-end.

**Acceptance Scenarios**:

1. **Given** an authenticated user on the Companies page, **When** it loads, **Then** all companies are listed with name, industry, and contact count.
2. **Given** a user who creates a company, **When** they associate a contact with it, **Then** the contact count on the company record increments.
3. **Given** a company record, **When** the user edits and saves it, **Then** updated values are reflected immediately in the list.
4. **Given** a company record, **When** the user deletes it, **Then** the company is removed; associated contacts retain their record but show no company.

---

### User Story 5 - Manage Deals (Priority: P5)

A user can create, view, edit, and delete deals. Each deal has a title, associated contact/company, value, stage (e.g., Prospect, Proposal, Negotiation, Closed Won, Closed Lost), and expected close date. Deals are displayed on a Kanban board with one column per stage; a user can move a deal to a new stage by clicking a stage selector on the deal card (no drag-and-drop required).

**Why this priority**: Deals represent the revenue pipeline — a distinguishing CRM feature beyond a simple address book.

**Independent Test**: Can be tested by creating a deal through the form, moving it through stages, and confirming values persist correctly.

**Acceptance Scenarios**:

1. **Given** an authenticated user on the Deals page, **When** it loads, **Then** deals are displayed on a Kanban board with one column per stage, showing title, value, and close date on each card.
2. **Given** a user who creates a new deal and assigns it a stage, **When** they save it, **Then** the deal card appears in the correct stage column on the board.
3. **Given** a deal card on the board, **When** the user selects a new stage via the stage selector, **Then** the deal moves to the new stage column immediately.
4. **Given** a deal, **When** the user deletes it, **Then** it disappears from the board and the dashboard deal count decrements.

---

### Edge Cases

- What happens when a user tries to delete a company that has associated contacts? (Company is deleted; contacts remain but their company field is cleared.)
- What happens if the session expires mid-use? (User is redirected to login; any unsaved form data is lost with a clear notification.)
- What happens when a required field is left blank on any CRUD form? (Inline validation blocks submission and highlights the offending field.)
- What happens if two users edit the same record simultaneously? (Last write wins for this template; no optimistic concurrency control is required.)
- What happens when the contacts or deals list is empty? (An empty-state illustration with a call-to-action button to create the first record is shown.)
- What happens if a non-existent route is accessed? (A 404 not-found page is shown with a link back to the dashboard.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST require authentication before any CRM data is accessible; unauthenticated requests MUST redirect to the login page.
- **FR-002**: System MUST allow users to register a new account with an email address and password. A pre-seeded demo account MUST also be available for evaluators who want to skip registration.
- **FR-003**: System MUST provide full CRUD operations (create, read, update, delete) for Contact records.
- **FR-004**: System MUST provide full CRUD operations for Company records.
- **FR-005**: System MUST provide full CRUD operations for Deal records.
- **FR-006**: System MUST display a dashboard summary page showing aggregate counts for contacts, companies, and deals, plus a recent-activity feed.
- **FR-007**: System MUST validate all form inputs on submission; required fields MUST be enforced and clearly communicated to the user.
- **FR-008**: System MUST support deal stage tracking with a predefined set of stages: Prospect, Proposal, Negotiation, Closed Won, Closed Lost. Deals MUST be displayed on a Kanban board with one column per stage; stage changes are made via a stage selector on the deal card (drag-and-drop is out of scope).
- **FR-009**: System MUST associate contacts with companies (optional relationship — a contact may exist without a company).
- **FR-010**: System MUST associate deals with a contact and/or a company.
- **FR-011**: System MUST allow users to sign out and have their session invalidated.
- **FR-012**: System MUST display paginated or scrollable lists for contacts, companies, and deals when record counts exceed a reasonable threshold.
- **FR-013**: System MUST include a not-found page for invalid routes and an error boundary for unexpected runtime errors.
- **FR-014**: System MUST be navigable via a persistent sidebar or top navigation, with clear active-state indicators for the current section.

### Key Entities

- **User**: Represents an authenticated person. Key attributes: email, hashed password (managed by NextAuth.js Credentials provider), display name, created date. Multiple user accounts are supported; each user registers with their own email and password.
- **Contact**: Represents an individual person in the CRM. Key attributes: first name, last name, email, phone, status (Lead / Active / Inactive), associated company (optional), created date, last updated date.
- **Company**: Represents an organisation. Key attributes: name, industry, website URL, size category (1–10, 11–50, 51–200, 200+), created date. Has zero-to-many associated contacts.
- **Deal**: Represents a sales opportunity. Key attributes: title, monetary value, currency, stage, expected close date, associated contact (optional), associated company (optional), created date, last updated date.
- **Activity** (derived): Recent changes surfaced on the dashboard — not a separate stored entity for v1; derived from created/updated timestamps on Contact, Company, and Deal records.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new evaluator can complete the end-to-end flow (sign up → create a contact → create a company → create a deal → view dashboard) in under 5 minutes without any documentation.
- **SC-002**: All CRUD operations complete and reflect updated data on screen within 2 seconds under normal conditions.
- **SC-003**: 100% of CRUD forms prevent submission with missing required fields and display a clear error message identifying the problem.
- **SC-004**: The application loads the dashboard in under 3 seconds on a standard broadband connection.
- **SC-005**: Every protected route redirects unauthenticated users to the login page — no CRM data is visible to unauthenticated sessions.
- **SC-006**: The template can be cloned and running locally with `npm install && npx prisma migrate dev && npm run dev` (plus setting required environment variables), requiring no external infrastructure beyond Node.js — SQLite is the database and runs as a local file.
- **SC-007**: All interactive elements are keyboard-operable and meet WCAG 2.1 AA colour-contrast requirements, making the template a compliant starting point.

## Clarifications

### Session 2026-09-14

- Q: Which authentication provider should this template use to handle user login and session management? → A: NextAuth.js (Auth.js v5) with Credentials provider
- Q: Should this template support multiple simultaneous user accounts, or is a single shared demo account sufficient? → A: Multiple accounts with real registration (email + password signup)
- Q: Should the Deals page display deals primarily as a Kanban-style pipeline board or as a sortable table list? → A: Kanban board — stage columns, click-to-change stage, no drag-and-drop required
- Q: Which database and ORM should this template use to persist CRM data? → A: Prisma ORM + SQLite — zero infrastructure, single file database
- Q: When a new evaluator clones the template, should the seed script populate data for all registered users or only for the single pre-seeded demo account? → A: Seed data tied to one pre-seeded demo account; new registrants start with an empty dataset

## Assumptions

- This is a template/demo project; production-grade scalability (e.g., thousands of concurrent users) is out of scope. The template should demonstrate correct patterns, not maximise throughput.
- A single user role (authenticated user) is sufficient for v1. Role-based access control (admin vs. read-only) is out of scope for this template.
- Authentication is implemented via NextAuth.js (Auth.js v5) using the Credentials provider (email + password). No external auth service is required to run the template locally. Social login (Google, GitHub, etc.) is out of scope for this template.
- Demo seed data is tied to a single pre-seeded demo account (fixed credentials documented in `.env.example`). New registrants start with an empty dataset, which demonstrates the empty-state UX. The seed script creates the demo user and all associated demo records in a single `prisma db seed` run.
- Mobile responsiveness is in scope at a basic level (usable on tablet and phone), but mobile-first optimisation is not a primary goal.
- Internationalisation (i18n) and localisation are out of scope for this template.
- File attachments (e.g., documents on deals) are out of scope for v1.
- Email sending (e.g., contacting leads directly from the CRM) is out of scope for this template.
- All CRM data (contacts, companies, deals) is shared across all authenticated users in this template — there is no per-user data isolation or multi-tenant partitioning. Any logged-in user can view and edit all records. The pre-seeded demo data is visible to all users once they log in.
- The template will use the project's existing Next.js and Tailwind CSS stack. Data persistence uses Prisma ORM with a SQLite database (single local file, no external database service required). Schema migrations are managed via Prisma Migrate.
