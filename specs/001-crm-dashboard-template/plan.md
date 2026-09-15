# Implementation Plan: CRM Dashboard Template

**Branch**: `001-crm-dashboard-template` | **Date**: 2026-09-14 | **Spec**: `/specs/001-crm-dashboard-template/spec.md`

**Input**: Feature specification from `/specs/001-crm-dashboard-template/spec.md`

## Summary

Build a CRM production-ready template application featuring a dashboard, contacts, companies, and deals management. The app will use `shadcn-admin` templates/components for the authenticated dashboard routes and standard `shadcn/ui` components for the landing/login pages. It uses NextAuth.js for credentials authentication and Prisma with SQLite for zero-infrastructure database management.

## Technical Context

**Language/Version**: TypeScript 5 (Strict Mode)

**Primary Dependencies**: Next.js 16.3.5 (App Router), React 19.2.8, Tailwind CSS 4, Prisma ORM, NextAuth.js (Auth.js v5), shadcn/ui, shadcn-admin components

**Storage**: SQLite (via Prisma)

**Testing**: Vitest (to be added during implementation)

**Target Platform**: Web application (Desktop & Mobile responsive)

**Project Type**: Next.js Web App

**Performance Goals**: Dashboard loads < 3s, CRUD operations complete and reflect in UI < 2s

**Constraints**: Zero external infrastructure, local SQLite db file, strict Next.js App router conventions, no drag-and-drop for Kanban

**Scale/Scope**: Template/demo project for single user role evaluations

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **App Router & Server Components by Default**: Yes. We will use RSCs primarily, only adding `"use client"` on specific interactive form/button components.
- **File-System Routing Discipline**: Yes. All routing will be in `app/`.
- **Typed Data Contracts**: Yes. All NextAuth callbacks, Prisma queries, and Server Actions will be strongly typed.
- **Server Actions for Mutations**: Yes. All CRUD operations will be Server Actions.
- **Environment Variable Hygiene**: Yes. SQLite path and NextAuth secrets will be strictly documented in `.env.example`.
- **Lint, Type-Check, and Build Gates**: Yes. We will ensure zero TypeScript errors and a clean build.
- **Feature Branch Workflow**: Yes, operating on `001-crm-dashboard-template`.

*All gates passed.*

## Project Structure

### Documentation (this feature)

```text
specs/001-crm-dashboard-template/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── actions.md       # Server Action definitions
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
├── (dashboard)/
│   ├── layout.tsx         # shadcn-admin layout
│   ├── dashboard/
│   │   └── page.tsx
│   ├── contacts/
│   │   └── page.tsx
│   ├── companies/
│   │   └── page.tsx
│   └── deals/
│       └── page.tsx
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts
├── page.tsx               # Landing page (normal shadcn/ui)
└── layout.tsx             # Root layout

components/
├── ui/                    # Base shadcn/ui components
├── admin/                 # shadcn-admin specific layouts/components
├── auth/                  # Login/Register forms
└── crm/                   # Domain-specific components (Kanban, Forms, Tables)

lib/
├── actions/               # Server Actions (CRUD)
├── prisma.ts              # Database client
└── utils.ts               # Shared utilities

prisma/
├── schema.prisma          # Data model
└── seed.ts                # Seed script for demo data
```

**Structure Decision**: A monolithic Next.js App Router structure. We use Route Groups (`(auth)` and `(dashboard)`) to apply different layouts (standard UI vs Admin UI) without affecting the URL path. Components are organized by UI primitives (`ui/`), admin layouts (`admin/`), and domain logic (`crm/`).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No violations.*
