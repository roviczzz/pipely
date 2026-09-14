<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Guidance

## Stack

- Next.js 16.3.5 (App Router), React 19.2.8, TypeScript 5 (strict), Tailwind CSS 4.
- `dev` runs Turbopack. `npm run lint` runs ESLint 9 flat-config (`eslint.config.mjs`). No test runner yet — add Vitest as part of the feature that needs it.
- `@/*` path alias resolves to the repo root.

## Commands

```
npm run dev      # Turbopack dev server on :3000
npm run lint     # ESLint — must be green before merge
npm run build    # Required for routing / config / prod-behavior changes
npm start        # Production server
```

No `typecheck` script — run `npx tsc --noEmit` manually when needed (constitution requires zero TS errors).

## Key Conventions (from `.specify/memory/constitution.md`)

- **Server Components by default.** Add `"use client"` only at the narrowest boundary that needs it — never at page or layout level without a documented reason.
- **No `tailwind.config.js`.** Tailwind 4 is configured CSS-first in `app/globals.css` and `postcss.config.mjs`.
- **Images**: always `next/image` with explicit dimensions or `fill`+`sizes`. No `<link>` / `@import` fonts — use `next/font`.
- **Mutations**: Server Actions (`"use server"`), not client-side fetch to internal routes.
- **Secrets**: no `NEXT_PUBLIC_` prefix for server-only values. Document all env vars in `.env.example`. `.env.local` must be gitignored.
- **Files > 200 lines**: extract sub-components or hooks. Pure utilities go in `lib/`.
- **Route co-location**: keep route-specific UI adjacent to its route; extract to `components/` or `lib/` only when two or more routes share it.
- **Every user-visible route** must export `metadata` (title, description, OG tags).
- **Every route segment** must have an `error.tsx` (Client Component).
- **Slow operations** must be wrapped in `<Suspense>` with a meaningful fallback.
- **No `// eslint-disable` or `@ts-ignore`** without an explanation and issue reference.
- **Constitution is non-negotiable.** Read `.specify/memory/constitution.md` before architectural decisions.

## Speckit Feature Workflow

This repo uses [Speckit](https://github.com/anomalyco/speckit) via OpenCode slash commands in `.opencode/commands/`. Scripts are PowerShell-only (`.specify/scripts/powershell/`). The canonical flow:

```
/speckit.specify <feature description>   # creates specs/<NNN>-<name>/spec.md
/speckit.clarify                         # optional — resolves ambiguities
/speckit.plan                            # generates plan.md, research.md, data-model.md, contracts/, quickstart.md
/speckit.tasks                           # generates tasks.md
/speckit.analyze                         # read-only consistency check (run after tasks)
/speckit.implement                       # executes tasks.md phase by phase
```

**Important Speckit details:**
- Feature directories land under `specs/` with sequential numbering (`001-name`, `002-name`, …). Numbering is set by `feature_numbering: "sequential"` in `.specify/init-options.json`.
- Each command starts by running a PowerShell prerequisite script (e.g., `check-prerequisites.ps1 -Json`) from the repo root and parsing its JSON output for `FEATURE_DIR` and `AVAILABLE_DOCS`. Use absolute paths for all filesystem operations.
- `tasks.md` task format is strict: `- [ ] T001 [P] [US1] Description with/exact/file/path.ts`. Missing any component (checkbox, ID, story label, path) is invalid.
- Completed tasks must be marked `[X]` in `tasks.md` as they finish.
- `/speckit.analyze` is **read-only** — never modifies files. Constitution violations are always CRITICAL.
- `/speckit.implement` checks `checklists/` before executing; incomplete checklists require explicit user approval to proceed.
- `.specify/extensions.yml` (if present) controls before/after hooks for each command — check it before and after each command phase.

## App Structure

```
app/
  layout.tsx   # root layout, Geist fonts, metadata (currently placeholder — update for real features)
  page.tsx     # / route (bare shell)
  globals.css  # Tailwind 4 CSS-first config
public/        # static assets — reference via root-relative URL, never import directly
```

No `components/`, `lib/`, or `specs/` directories exist yet — create them when the feature warrants it.

## `CLAUDE.md`

`CLAUDE.md` contains only `@AGENTS.md` — it delegates everything here. Keep it that way.
