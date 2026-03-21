<!--
  Sync Impact Report
  ───────────────────
  Version change     : N/A → 1.0.0 (initial adoption)
  Last validated     : 2026-03-21 (no-change validation pass)
  Modified principles: N/A
  Added sections     : N/A
  Removed sections   : N/A
  Templates checked  :
    - .specify/templates/plan-template.md        ✅ compatible
    - .specify/templates/spec-template.md        ✅ compatible
    - .specify/templates/tasks-template.md       ✅ compatible
    - .specify/templates/checklist-template.md   ✅ compatible
    - .specify/templates/agent-file-template.md  ✅ compatible (generic, no agent-specific refs)
  Stack verified vs package.json (2026-03-21):
    - Next.js ^16.0.3  ✅  React ^19.2.0        ✅
    - Zustand ^5.0.9   ✅  TanStack Query ^5.90  ✅
    - Zod ^4.1.12      ✅  motion ^12.23.24      ✅
    - Tailwind CSS ^4  ✅  next-intl ^4.5.5      ✅
    - TypeScript ^5.5  ✅  pnpm lockfile         ✅
  Follow-up TODOs: none — all placeholders resolved, no deferred items
-->

# CRAI Constitution

## Core Principles

### I. API-First Frontend Architecture

The frontend MUST NOT own business logic. All data mutations and
authoritative reads flow through the Django REST API. The
Next.js layer is responsible only for rendering, client-side
state, and routing.

- Every data operation MUST call a typed service function in
  `src/services/` that delegates to `src/lib/api.ts` or
  `src/lib/apiWithCookies.ts`.
- Direct `fetch` calls outside the `src/lib/` helpers are
  prohibited.
- API response shapes MUST be declared as TypeScript interfaces
  in `src/types/` and shared across components, services, and
  stores.
- Backend endpoint changes MUST be reflected in the
  corresponding service file and type definition before any
  component work begins.

**Rationale**: A single, typed API boundary prevents silent
contract drift between Django and Next.js and keeps the frontend
replaceable.

### II. Type Safety (NON-NEGOTIABLE)

TypeScript strict mode (`"strict": true`) MUST remain enabled.
No escape hatches are permitted without explicit, documented
justification.

- `any` is forbidden. Use `unknown` with narrowing or proper
  generics.
- Every component prop MUST have an explicit type or interface;
  inline object types are acceptable only for one-off internal
  components.
- Zod schemas (`zod`) are the single source of truth for
  runtime validation. Form data, API payloads, and environment
  variables MUST be validated through Zod before use.
- `@ts-ignore` and `@ts-expect-error` require a comment
  referencing an issue number or a reason that is reviewable.

**Rationale**: Strict types are the primary defense against
regressions in a bilingual, multi-role application.

### III. Bilingual-First (i18n & RTL)

Every user-visible string MUST come from `next-intl` message
files (`messages/en.json`, `messages/ar.json`). Hard-coded UI
text is prohibited.

- New keys MUST be added to **both** locale files in the same
  commit/PR.
- Layout components MUST respect the `dir` attribute (`rtl` /
  `ltr`) set in the locale layout. Tailwind directional
  utilities (`ms-`, `me-`, `start`, `end`) MUST be used instead
  of `ml-` / `mr-` / `left` / `right` for spacing and
  positioning.
- Font loading MUST use the existing Cairo (Arabic) / Jost
  (Latin) strategy defined in the locale layout. Adding new
  font families requires constitution amendment.

**Rationale**: CRAI targets a Saudi audience; Arabic and English
parity is a product requirement, not an afterthought.

### IV. Component Composition & UI Consistency

All presentational primitives MUST come from the project's
`src/components/ui/` directory (shadcn/ui + Radix UI). Direct
import of raw Radix primitives in feature components is
prohibited — wrap them in `ui/` first.

- Feature components live under `src/components/<Feature>/` and
  MUST be client components (`'use client'`) only when they
  need browser APIs, state, or event handlers.
- Server Components are the default. A component MUST NOT be
  marked `'use client'` unless it uses hooks, browser APIs, or
  event handlers.
- Tailwind CSS 4 is the only styling system. Inline `style`
  attributes are prohibited except for truly dynamic values
  (e.g., calculated positions, canvas).
- Motion/animation MUST use the `motion` library already in the
  dependency tree. Adding alternative animation libraries
  requires constitution amendment.

**Rationale**: Consistent primitives reduce visual drift and
keep the bundle lean.

### V. Authentication & Security

Authentication MUST use the existing HttpOnly-cookie JWT flow.
Tokens MUST NOT be stored in localStorage, sessionStorage, or
any client-accessible JavaScript variable.

- The `useAuth` context and `useAuthStore` Zustand store are
  the only sanctioned sources of auth state in components.
- Protected routes MUST use the `ProtectedRoute` wrapper or an
  equivalent server-side redirect; ad-hoc auth checks in page
  components are prohibited.
- Role-gating (`is_instructor`, `is_staff`, `is_superuser`)
  MUST be read from the Zustand store's getter methods, never
  derived with custom logic in components.
- All API requests requiring authentication MUST include
  `credentials: 'include'` (already enforced by `apiRequest`).

**Rationale**: A single auth path prevents token-leak vectors
and role-check inconsistencies across the app.

### VI. Performance & User Experience

Pages visible to unauthenticated users (home, about, courses
listing) MUST be statically generated or ISR where possible.

- Images MUST use the Next.js `<Image>` component with explicit
  `width`/`height` or `fill` to prevent layout shift.
- Client-side data fetching MUST use `@tanstack/react-query`
  for caching, deduplication, and background refetching.
  Raw `useEffect` + `fetch` patterns are prohibited for data
  loading.
- Bundle size: adding a new dependency whose minified+gzipped
  size exceeds 50 KB requires documented justification in the
  PR description.
- Loading and error states MUST be handled for every async
  operation visible to the user (skeleton, spinner, or toast).

**Rationale**: The platform serves users in regions with varying
network quality; perceived speed is a competitive advantage.

### VII. Simplicity & Incremental Change

Prefer the simplest solution that satisfies requirements. New
abstractions (custom hooks, HOCs, context providers) MUST solve
a repeated problem in at least two places before being
introduced.

- YAGNI: features not in the current spec MUST NOT be
  pre-built.
- File-per-concern: a single file SHOULD NOT exceed ~300 lines.
  If it does, extract a logical sub-module.
- Folder structure follows the existing Next.js App Router
  conventions under `src/app/[locale]/`. New top-level route
  segments MUST mirror the pattern of existing siblings.
- State management hierarchy: React local state → Zustand
  store → React Query server cache. Escalate only when the
  simpler layer is insufficient.

**Rationale**: Complexity is the primary cost driver in a
growing codebase; every abstraction must earn its place.

## Technology Stack Constraints

| Layer | Technology | Version / Notes |
|-------|-----------|----------------|
| Framework | Next.js (App Router) | ^16.x, React 19 |
| Language | TypeScript | strict mode, ^5.5 |
| Backend API | Django REST Framework | owned by backend team |
| State (client) | Zustand (persisted) | ^5.x |
| Server cache | TanStack React Query | ^5.x |
| Styling | Tailwind CSS 4 + shadcn/ui | utility-first only |
| i18n | next-intl | en + ar, RTL |
| Validation | Zod | ^4.x |
| Auth | JWT HttpOnly cookies | via Django |
| Animation | motion | ^12.x |
| Package mgr | pnpm | lockfile committed |
| Deployment | Docker (Nginx + Node SSR) | Netlify for preview |
| Node runtime | 20 LTS (Alpine) | per Dockerfile |

Adding, removing, or upgrading a major dependency MUST be
discussed and approved before implementation. The constitution
MUST be amended if a technology layer changes.

## Development Workflow

1. **Branch naming**: `<###>-<feature-slug>` (e.g.,
   `001-course-catalog`). Spec-Kit feature branches follow
   this convention automatically.
2. **Commit messages**: follow Conventional Commits
   (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`).
3. **PR requirements**:
   - MUST pass `next build` without errors.
   - MUST pass `eslint` with zero warnings.
   - MUST include both locale message keys when adding UI text.
   - MUST not introduce `any` types.
4. **Code review**: at least one approval required before merge
   to `main`.
5. **Testing**: write tests when the spec explicitly requests
   them. At minimum, Zod schemas and service functions SHOULD
   have unit tests for critical paths.
6. **Spec-Kit workflow**: for new features, follow the
   `/speckit.specify` → `/speckit.plan` → `/speckit.tasks` →
   `/speckit.implement` sequence. The constitution is checked
   at plan time.

## Governance

This constitution supersedes ad-hoc decisions in all
specification, planning, and implementation phases. The AI agent
and all contributors MUST verify compliance with these
principles before approving work.

- **Amendments** require: (1) a written proposal describing the
  change and rationale, (2) team discussion, and (3) an update
  to this file with an incremented version number.
- **Versioning** follows Semantic Versioning:
  - MAJOR: principle removal or backward-incompatible
    redefinition.
  - MINOR: new principle or materially expanded guidance.
  - PATCH: clarification, wording, or typo fix.
- **Compliance review**: every `/speckit.plan` output MUST
  include a "Constitution Check" section that maps each
  principle to the plan's approach and flags violations.
- **Conflict resolution**: if a spec requirement contradicts a
  principle, the principle wins unless an amendment is ratified
  first.

**Version**: 1.0.0 | **Ratified**: 2026-03-02 | **Last Amended**: 2026-03-02
