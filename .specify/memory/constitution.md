<!--
SYNC IMPACT REPORT
==================
Version change: [unversioned scaffold] → 1.0.0
Added sections:
  - Core Principles (15 Next.js best practices, fully populated)
  - Tech Stack & Constraints
  - Development Workflow
  - Governance
Modified principles: N/A (initial population from blank scaffold)
Removed sections: N/A
Deferred TODOs:
  - RATIFICATION_DATE set to 2026-09-14 (today, first adoption)
-->

# Pipely Constitution

## Core Principles

### I. App Router & Server Components by Default

Pages and layouts MUST be React Server Components (RSC) unless the component
requires state, event handlers, effects, or browser-only APIs. Add `"use client"`
only at the narrowest boundary that actually needs it — never at the page or layout
level without a documented justification.

**Rationale**: RSCs eliminate client-side JavaScript for pure rendering, improving
Time to First Byte and reducing bundle size.

### II. File-System Routing Discipline

All routes MUST be defined exclusively through the `app/` directory using Next.js
App Router conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`,
`not-found.tsx`, `route.ts`). Parallel routes (`@slot`) and intercepting routes
(`(.)path`) MUST only be introduced when the UX explicitly requires them.

**Rationale**: Consistency in routing prevents accidental route collisions and keeps
navigation logic discoverable.

### III. Co-location of Route-Specific Code

UI components, hooks, and utilities that are used by a single route MUST live in or
adjacent to that route's directory. Only extract to a shared location (e.g.,
`components/`, `lib/`) when two or more independent routes consume the same artifact.

**Rationale**: Premature abstraction creates indirection without benefit; co-location
keeps the cost of change local.

### IV. Typed Data Contracts

Every API route handler (`route.ts`), Server Action, and data-fetching function MUST
define explicit TypeScript input and output types. `any` is prohibited; `unknown`
requires a type guard before use. Zod (or equivalent) MUST validate external input
at the API boundary.

**Rationale**: Type safety at data boundaries prevents entire classes of runtime
errors and makes refactoring safe.

### V. Metadata as First-Class Concern

Every route segment that is user-visible MUST export a `metadata` object or a
`generateMetadata` function covering at minimum: `title`, `description`, and Open
Graph tags. Metadata MUST NOT be duplicated — inherit from the nearest parent layout
and override only what changes.

**Rationale**: SEO and social sharing are non-negotiable for production apps; missing
metadata is a regression, not a feature gap.

### VI. Image & Font Optimization

All images MUST use `next/image` with explicit `width`, `height` (or `fill` +
`sizes`), and a meaningful `alt`. Remote image hostnames MUST be explicitly
allow-listed in `next.config`. Fonts MUST be loaded via `next/font` (Google or
local); no `<link>` or `@import` font loading.

**Rationale**: Prevents layout shift (CLS), reduces bandwidth, and avoids
render-blocking resources.

### VII. Data Fetching at the Lowest Possible Level

Data MUST be fetched as close to the component that needs it as possible — in the
Server Component itself, not hoisted to a parent and threaded down as props. Use
`fetch` with Next.js caching semantics (`cache`, `next.revalidate`, `next.tags`).
Client-side fetching with SWR/React Query is permitted only for truly dynamic,
user-specific data that cannot be SSR'd.

**Rationale**: Avoids prop-drilling, enables per-component cache granularity, and
keeps waterfalls local.

### VIII. Streaming & Suspense for Progressive Rendering

Slow server operations (DB queries, third-party API calls) MUST be wrapped in
`<Suspense>` with a meaningful `fallback`. Use `loading.tsx` for route-level
skeletons. Never block the entire page render on a slow operation.

**Rationale**: Streaming improves perceived performance without adding client-side
complexity.

### IX. Server Actions for Mutations

All form submissions and data mutations MUST use Next.js Server Actions (`"use
server"` functions) rather than client-side `fetch` calls to internal API routes.
Server Actions MUST validate all inputs and return structured results. They MUST NOT
expose internal error messages to the client.

**Rationale**: Server Actions reduce round-trips, keep secrets server-side, and
simplify optimistic UI patterns with `useActionState`.

### X. Environment Variable Hygiene

Secrets and server-only values MUST use `process.env.VAR_NAME` without the
`NEXT_PUBLIC_` prefix. Values that must reach the browser MUST use `NEXT_PUBLIC_`
and MUST NOT include secrets. `.env.local` MUST be in `.gitignore`. All required
variables MUST be documented in `.env.example`.

**Rationale**: Accidental secret exposure via `NEXT_PUBLIC_` is a critical security
failure that is easy to prevent at the convention level.

### XI. Error Boundaries & Error UX

Every route segment MUST have an `error.tsx` that renders a graceful recovery UI and
logs the error. The global `app/error.tsx` is the minimum; add nested `error.tsx`
files for independently recoverable segments. Error components MUST be Client
Components (`"use client"`).

**Rationale**: Unhandled RSC errors crash the entire page subtree; error boundaries
contain the blast radius.

### XII. Clean & Modular Code Structure

Components MUST follow the single-responsibility principle: one component, one clear
purpose. Files MUST NOT exceed 200 lines; extract sub-components or hooks when
approaching this limit. Barrel files (`index.ts`) MAY be used for public module APIs
but MUST NOT create circular dependencies. Utility functions MUST live in `lib/` and
MUST be pure (no side effects) unless explicitly documented otherwise.

**Rationale**: Modularity enables parallel development, easier testing, and faster
code review.

### XIII. Performance Budgets & Bundle Discipline

Dynamic imports (`next/dynamic`) MUST be used for heavy third-party libraries or
components that are not needed on initial render. `next/dynamic` with `ssr: false`
is only permitted for genuinely browser-only components. The production bundle
MUST be reviewed with `@next/bundle-analyzer` before any dependency that exceeds
50 kB (gzipped) is added.

**Rationale**: Unchecked bundle growth degrades Core Web Vitals silently over time.

### XIV. Accessibility (a11y) as Non-Negotiable

All interactive elements MUST be keyboard-operable and have visible focus styles.
Images MUST have descriptive `alt` text (empty string only for decorative images).
Color contrast MUST meet WCAG 2.1 AA. Forms MUST use `<label>` associated with
inputs. ARIA attributes MUST only be used when native HTML semantics are
insufficient.

**Rationale**: Accessibility is a legal requirement in many jurisdictions and a
baseline quality standard, not an enhancement.

### XV. Lint, Type-Check, and Build Gates

All code changes MUST pass `npm run lint` (ESLint with `eslint-config-next`) and
TypeScript strict mode (`tsc --noEmit`) with zero errors before merge. Changes that
affect routing, metadata, configuration, or production behavior MUST also pass
`npm run build`. No `// eslint-disable` or `@ts-ignore` comments without an
accompanying explanation and issue reference.

**Rationale**: Automated gates prevent regressions from reaching production and
make code review faster by eliminating mechanical feedback.

## Tech Stack & Constraints

- **Framework**: Next.js 16.3.5 (App Router) — consult `node_modules/next/dist/docs/`
  before using any API that may differ from prior Next.js versions.
- **Language**: TypeScript 5 in strict mode. No `allowJs` without explicit approval.
- **Styling**: Tailwind CSS 4 via CSS-first configuration in `app/globals.css` and
  `postcss.config.mjs`. No legacy `tailwind.config.js`.
- **React**: 19.2.8. Use React 19 APIs (Actions, `use()`, etc.) where appropriate.
- **Path alias**: `@/*` resolves to the repository root. Prefer it over relative
  `../` chains that cross directory boundaries.
- **No test runner currently exists**: When adding logic with meaningful branching,
  add Vitest (or equivalent) as part of the feature, not as a follow-up.

## Development Workflow

- **Dev**: `npm run dev` — hot-reloads with Turbopack.
- **Lint**: `npm run lint` — MUST be green before any PR merge.
- **Build**: `npm run build` — run for routing, config, or production-behavior changes.
- **Start**: `npm start` — production server, used for final verification.
- Static assets go in `public/`; never import from `public/` using relative paths —
  use the root-relative URL (`/filename.ext`).
- Preserve the `<!-- BEGIN:nextjs-agent-rules -->` block in `AGENTS.md`; `next dev`
  regenerates it and removing it only creates an uncommitted diff.

## Governance

This constitution supersedes all ad-hoc conventions and verbal agreements. It applies
to every contributor, human or AI agent, working in this repository.

**Amendment procedure**:
1. Propose the change in a PR with a description of what changes and why.
2. Bump `CONSTITUTION_VERSION` according to semantic versioning rules (see below).
3. Update `LAST_AMENDED_DATE` to the merge date.
4. The PR description MUST reference which principle(s) are affected.

**Versioning policy**:
- MAJOR: Removal or redefinition of an existing principle in a backward-incompatible way.
- MINOR: New principle added or existing principle materially expanded.
- PATCH: Wording clarification, typo fix, non-semantic refinement.

**Compliance**: All PR reviewers MUST verify that the submitted code complies with
the active constitution. Non-compliance blocks merge; exceptions require a documented
waiver and a follow-up issue to remediate.

**Guidance file**: Refer to `AGENTS.md` for runtime agent guidance during development.

**Version**: 1.0.0 | **Ratified**: 2026-09-14 | **Last Amended**: 2026-09-14
