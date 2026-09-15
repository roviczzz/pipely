# Pipely CRM

A full-stack CRM (Customer Relationship Management) application built with Next.js 16 App Router. Manage contacts, companies, and deals through a Kanban pipeline — with authentication, a dashboard overview, and full CRUD operations.

## Features

- **Authentication** — Email/password sign-in and registration via NextAuth v5 (Credentials provider)
- **Dashboard** — Metric tiles for contacts, companies, open deals, and pipeline health; recent activity feed
- **Contacts** — Create, edit, and delete contacts; associate with companies; filter by status (Lead / Active / Inactive)
- **Companies** — Full CRUD with industry, website, and size fields; contact association
- **Deals / Kanban** — Deals organized across five pipeline stages (Prospect → Proposal → Negotiation → Closed Won → Closed Lost); stage changes via dropdown; full CRUD

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.3.5 (App Router, Turbopack) |
| UI | React 19.2.8, Tailwind CSS 4 (CSS-first), lucide-react |
| Auth | NextAuth v5 (Auth.js), bcryptjs |
| Database | SQLite via Prisma 7 + `better-sqlite3` adapter |
| Language | TypeScript 5 (strict) |
| Tests | Vitest + React Testing Library |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | SQLite file path, e.g. `file:./dev.db` |
| `AUTH_SECRET` | Random secret for JWT signing — run `npx auth secret` to generate |
| `AUTH_TRUST_HOST` | Set to `true` when running locally over plain HTTP |

### 3. Set up the database

```bash
npx prisma migrate deploy   # apply migrations
npx prisma db seed          # seed demo data
```

The seed creates a demo account:

| Field | Value |
|---|---|
| Email | `demo@example.com` |
| Password | `password123` |

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to `/login`.

## Commands

```bash
npm run dev      # Turbopack dev server on :3000
npm run build    # Production build
npm start        # Production server
npm run lint     # ESLint (must be clean before merge)
npm test         # Vitest test suite
npx tsc --noEmit # TypeScript type-check
```

## Project Structure

```
app/
  (auth)/           # Login and register pages
  (dashboard)/      # Authenticated shell: dashboard, contacts, companies, deals
  api/auth/         # NextAuth route handler
  generated/prisma/ # Auto-generated Prisma client
components/
  admin/            # MetricCard, RecentActivity (Server Components)
  auth/             # LoginForm, RegisterForm (Client Components)
  crm/              # ContactForm/Table, CompanyForm/Table, DealForm, KanbanBoard, DealCard
lib/
  actions/          # Server Actions: auth, contacts, companies, deals
  prisma.ts         # Prisma singleton
  utils.ts          # cn() helper (clsx + tailwind-merge)
  dashboard.ts      # getOpenDealCount, buildRecentActivity
prisma/
  schema.prisma     # Data model: User, Contact, Company, Deal
  seed.ts           # Demo data seed
tests/              # Vitest unit + component tests
specs/              # Feature specifications and implementation plans
```

## Data Model

- **User** — email, passwordHash, displayName
- **Contact** — firstName, lastName, email, phone, status, optional company
- **Company** — name, industry, website, size
- **Deal** — title, value, currency, stage, expectedCloseDate, optional contact and company

All relationships use `SetNull` on delete. Deal stages and contact statuses are enforced at the Server Action layer.

## Architecture Notes

- **Server Components by default.** `"use client"` is applied only at form and interactive-component boundaries — never at page or layout level.
- **Server Actions** handle all mutations. No internal API routes for CRUD.
- **Route protection** is dual-layered: NextAuth `authorized` middleware callback + per-layout `auth()` checks.
- **Tailwind 4** is configured CSS-first in `app/globals.css` — no `tailwind.config.js`.
- **Prisma 7** uses the `prisma-client` generator with the `better-sqlite3` driver adapter, outputting to `app/generated/prisma`.
