# Research: CRM Dashboard Template

## Shadcn UI vs Shadcn Admin Integration

**Context**: The user requested to "use shadcn admin for the dashboard and normal shadcn for the landing/login pages". We need to determine how to integrate both seamlessly in a Next.js App Router project using Tailwind CSS 4.

- **Decision**: Use `shadcn/ui` components for all unauthenticated routes (login, registration, landing page) and integrate the layout patterns and specific components from `shadcn-admin` (often a community extension or template based on shadcn/ui) for the authenticated dashboard routes (`/dashboard`, `/contacts`, `/companies`, `/deals`). Both will share the underlying Tailwind CSS 4 configuration and `shadcn` base variables.
- **Rationale**: Keeps the marketing/auth pages lightweight and bespoke using standard primitives, while leveraging the pre-built, admin-focused layouts (sidebar, header, breadcrumbs, data tables) for the CRM dashboard views, fulfilling the user request and accelerating development.
- **Alternatives considered**: Building the admin layout entirely from scratch using only base `shadcn/ui` components (rejected because it ignores the user's specific request for "shadcn admin" and takes longer).

## Database & ORM (Prisma + SQLite)

**Context**: The specification requires Prisma ORM with SQLite for zero-infrastructure setup.

- **Decision**: Use Prisma with SQLite provider. The database file will be stored locally (e.g., `prisma/dev.db`). We will provide a seed script (`prisma/seed.ts`) to populate the initial demo account and CRM data.
- **Rationale**: Meets the FR-006 criteria of running locally with just `npm install && npx prisma migrate dev && npm run dev` without requiring external database services like PostgreSQL or MySQL.
- **Alternatives considered**: Postgres/Vercel Postgres (rejected due to explicit requirement for SQLite zero-infrastructure template).

## Authentication (NextAuth.js / Auth.js v5)

**Context**: Needs email/password credentials authentication and multiple accounts.

- **Decision**: Implement NextAuth.js (Auth.js v5) using the `Credentials` provider. Use `bcrypt` or `argon2` for password hashing before storing in the SQLite database. Define the session strategy as `jwt`.
- **Rationale**: Complies with the specification requirement for NextAuth.js Credentials provider.
- **Alternatives considered**: NextAuth with OAuth providers (rejected per spec), Supabase Auth (rejected, strictly NextAuth).

## Kanban Board for Deals

**Context**: Deals must be displayed on a Kanban board with one column per stage, but drag-and-drop is explicitly out of scope. Stage changes happen via a stage selector on the deal card.

- **Decision**: Build a CSS Grid/Flexbox layout for the Kanban columns. Render Deal cards in each column based on their `stage` property. Provide a `<select>` or dropdown menu component on each card to trigger a Server Action that updates the deal's stage.
- **Rationale**: Exactly matches the spec constraints (no drag-and-drop required) and keeps the implementation simple, relying on Server Actions and standard HTML inputs.
- **Alternatives considered**: `dnd-kit` or `hello-pangea/dnd` (rejected as explicitly out of scope).
