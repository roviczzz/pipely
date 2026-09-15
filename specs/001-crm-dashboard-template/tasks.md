---
description: "Task list for feature implementation: CRM Dashboard Template"
---

# Tasks: CRM Dashboard Template

**Input**: Design documents from `/specs/001-crm-dashboard-template/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/
**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Exact file paths are included in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize Next.js 16.3.5 project with React 19, Tailwind CSS 4, and TypeScript
- [X] T002 [P] Install and configure base `shadcn/ui` and required dependencies (lucide-react, clsx, tailwind-merge)
- [X] T002b [P] Install and configure Vitest and React Testing Library
- [X] T003 [P] Initialize Prisma ORM with SQLite provider
- [X] T004 Create foundational folder structure (`components/ui`, `components/admin`, `components/crm`, `components/auth`, `lib/actions`)
- [X] T005 Create `lib/prisma.ts` for the global database client instance
- [X] T006 [P] Create `lib/utils.ts` for shared UI utilities

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**🚨 CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Define Prisma database schema (`User`, `Contact`, `Company`, `Deal`) in `prisma/schema.prisma`
- [X] T008 Generate Prisma client and create initial database migration (`npx prisma migrate dev --name init`)
- [X] T009 Implement the database seed script in `prisma/seed.ts` to populate the initial demo account and sample data
- [X] T010 Install and configure NextAuth.js (Auth.js v5) with Credentials provider (no route file yet)
- [X] T010b Document required environment variables for SQLite and NextAuth in `.env.example`
- [X] T011 Create base root layout with standard meta tags and global CSS in `app/layout.tsx` and `app/globals.css`
- [X] T012 Setup `middleware.ts` for route protection (redirecting unauthenticated users from `/dashboard` and sub-routes)

**Checkpoint**: Foundation ready - user story implementation can now begin sequentially or in parallel

---

## Phase 3: User Story 1 - Authenticated User Signs In (Priority: P1) 🏆 MVP

**Goal**: Implement email/password authentication using NextAuth.js Credentials provider. Unauthenticated users are redirected to login.

**Independent Test**: Navigate to a protected route and verify redirect to `/login`. Use the login form to authenticate and verify redirect to `/dashboard`.

### Implementation for User Story 1

- [X] T013 [P] [US1] Implement Server Actions for auth (`authenticate`, `register`, `logOut`) matching contracts in `lib/actions/auth.ts`
- [X] T014 [US1] Create Auth route handler in `app/api/auth/[...nextauth]/route.ts`
- [X] T015 [P] [US1] Build Login form component in `components/auth/login-form.tsx`
- [X] T016 [P] [US1] Build Register form component in `components/auth/register-form.tsx`
- [X] T017 [US1] Assemble Login page in `app/(auth)/login/page.tsx` using standard shadcn/ui layouts
- [X] T018 [US1] Assemble Register page in `app/(auth)/register/page.tsx`
- [X] T018b [US1] Write unit tests for auth server actions and forms using Vitest
- [X] T018c [US1] Add error boundaries for auth routes in `app/(auth)/error.tsx`
- [X] T019 [US1] Add a basic global `app/page.tsx` (landing page) that redirects to `/dashboard` or `/login`

**Checkpoint**: User Story 1 is fully functional and auth protects routes.

---

## Phase 4: User Story 2 - Dashboard Overview (Priority: P2)

**Goal**: Provide a primary dashboard view showing total contacts, companies, deals, and recent activity.

**Independent Test**: Login and verify the `/dashboard` route renders metric tiles reflecting seeded database numbers.

### Implementation for User Story 2

- [X] T020 [P] [US2] Build the authenticated Admin layout shell (Sidebar, Header, Breadcrumbs) in `app/(dashboard)/layout.tsx`
- [X] T021 [P] [US2] Create metric card and recent activity components in `components/admin/metric-card.tsx` and `components/admin/recent-activity.tsx`
- [X] T022 [US2] Implement data-fetching logic for dashboard metrics in `app/(dashboard)/dashboard/page.tsx`
- [X] T023 [US2] Assemble Dashboard page in `app/(dashboard)/dashboard/page.tsx`
- [X] T023b [US2] Add loading and error states for the dashboard route in `app/(dashboard)/dashboard/loading.tsx` and `app/(dashboard)/dashboard/error.tsx`
- [X] T023c [US2] Write unit tests for dashboard metric calculations

**Checkpoint**: Dashboard overview renders data independently.

---

## Phase 5: User Story 3 - Manage Contacts (Priority: P3)

**Goal**: View paginated list of contacts, create, edit, and delete contacts.

**Independent Test**: Navigate to `/contacts`, create a contact, edit it, and delete it to verify the full CRUD cycle.

### Implementation for User Story 3

- [X] T024 [P] [US3] Implement Contact Server Actions matching contracts in `lib/actions/contacts.ts`
- [X] T025 [P] [US3] Build Contact form and validation schema in `components/crm/contact-form.tsx`
- [X] T026 [P] [US3] Build Contact data table with pagination controls in `components/crm/contact-table.tsx`
- [X] T027 [US3] Assemble Contacts page in `app/(dashboard)/contacts/page.tsx` integrating table and forms
- [X] T028 [US3] Add loading and error states for the Contacts route in `app/(dashboard)/contacts/loading.tsx` and `app/(dashboard)/contacts/error.tsx`
- [X] T028b [US3] Write unit tests for Contact Server Actions and UI components

**Checkpoint**: Contacts management is fully operational.

---

## Phase 6: User Story 4 - Manage Companies (Priority: P4)

**Goal**: View, create, edit, and delete company records and associate contacts.

**Independent Test**: Navigate to `/companies`, perform full CRUD, and associate a contact to a newly created company.

### Implementation for User Story 4

- [ ] T029 [P] [US4] Implement Company Server Actions matching contracts in `lib/actions/companies.ts`
- [ ] T030 [P] [US4] Build Company form and validation schema in `components/crm/company-form.tsx`
- [ ] T031 [P] [US4] Build Company data table with pagination controls in `components/crm/company-table.tsx`
- [ ] T032 [US4] Assemble Companies page in `app/(dashboard)/companies/page.tsx` integrating table and forms
- [ ] T033 [US4] Update `components/crm/contact-form.tsx` to include an optional Company dropdown selector
- [ ] T034 [US4] Add loading and error states in `app/(dashboard)/companies/loading.tsx` and `app/(dashboard)/companies/error.tsx`
- [ ] T034b [US4] Write unit tests for Company Server Actions and UI components

**Checkpoint**: Companies management is operational and integrates with Contacts.

---

## Phase 7: User Story 5 - Manage Deals (Priority: P5)

**Goal**: Create, view, edit, and delete deals via a Kanban board with stage selectors.

**Independent Test**: Navigate to `/deals`, create a deal, verify its presence on the Kanban board, and change its stage using the dropdown.

### Implementation for User Story 5

- [ ] T035 [P] [US5] Implement Deal Server Actions matching contracts in `lib/actions/deals.ts`
- [ ] T036 [P] [US5] Build Deal creation/edit form in `components/crm/deal-form.tsx`
- [ ] T037 [P] [US5] Build Kanban column and Deal Card components in `components/crm/kanban-board.tsx` and `components/crm/deal-card.tsx` (using CSS Grid/Flexbox)
- [ ] T038 [US5] Implement stage selector dropdown on the Deal Card to trigger `updateDealStage` Action
- [ ] T039 [US5] Assemble Deals page in `app/(dashboard)/deals/page.tsx` rendering the Kanban board
- [ ] T040 [US5] Add loading and error states in `app/(dashboard)/deals/loading.tsx` and `app/(dashboard)/deals/error.tsx`
- [ ] T040b [US5] Write unit tests for Deal Server Actions and UI components

**Checkpoint**: Deals Kanban board is fully operational.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final application improvements and quality assurance.

- [ ] T041 [P] Verify and implement comprehensive `error.tsx` and `not-found.tsx` at the global level
- [ ] T042 Verify all form inputs enforce correct validation schemas and show inline error messages
- [ ] T043 Add/verify metadata config on all user-facing route segments
- [ ] T044 Run `quickstart.md` validation scenarios locally
- [ ] T045 Run `npm run lint` and `npx tsc --noEmit` and resolve any outstanding issues

---

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 1 (Setup)**: Starts immediately
- **Phase 2 (Foundational)**: Depends on Phase 1
- **Phases 3-7 (User Stories)**: Depend on Phase 2
- **Phase 8 (Polish)**: Depends on Phases 3-7 being complete

### User Story Dependencies
- **US1**: Can start independently post-foundation. Blocks actual usage of US2-US5.
- **US2**: Can start independently.
- **US3**: Can start independently.
- **US4**: Integrates slightly with US3 (Contact form update).
- **US5**: Can start independently.

### Parallel Opportunities
- Initialization, Prisma setup, and generic utilities can start simultaneously.
- UI component forms, tables, and Server Actions within a User Story can often be developed in parallel before final assembly in the page route.
- Different User Stories can be developed simultaneously as they deal with relatively distinct entities and route silos.
