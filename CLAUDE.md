# CRAI Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-21

## Active Technologies

- TypeScript ^5.5 (strict mode) + Next.js ^16.x (App Router), React 19, TanStack React Query ^5.x, Zustand ^5.x, next-intl ^4.5.5, Zod ^4.x, Tailwind CSS 4, shadcn/ui (001-tap-payment-verification)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript ^5.5 (strict mode): Follow standard conventions

## Recent Changes

- 001-tap-payment-verification: Added TypeScript ^5.5 (strict mode) + Next.js ^16.x (App Router), React 19, TanStack React Query ^5.x, Zustand ^5.x, next-intl ^4.5.5, Zod ^4.x, Tailwind CSS 4, shadcn/ui

<!-- MANUAL ADDITIONS START -->
## Speckit Workflow

Speckit is the feature-development workflow system for this project. All slash commands live in `.claude/commands/speckit.*.md`.

### Command Reference

| Command | Purpose |
|---------|---------|
| `/speckit.specify <description>` | Create or update `specs/<feature>/spec.md` from a natural language description |
| `/speckit.clarify` | Ask up to 5 targeted questions to resolve ambiguities in the spec |
| `/speckit.plan` | Generate `specs/<feature>/plan.md` with implementation strategy and design artifacts |
| `/speckit.checklist` | Generate a requirements checklist for the feature |
| `/speckit.tasks` | Produce a dependency-ordered `specs/<feature>/tasks.md` from plan artifacts |
| `/speckit.analyze` | Cross-artifact consistency and quality check across spec, plan, and tasks (read-only) |
| `/speckit.implement` | Execute tasks in `tasks.md` phase by phase |
| `/speckit.taskstoissues` | Convert tasks into dependency-ordered GitHub Issues |
| `/speckit.constitution` | Create or update the project constitution; keeps all dependent templates in sync |

### Standard Feature Lifecycle

```
/speckit.specify  →  /speckit.clarify  →  /speckit.plan  →  /speckit.checklist
                                                ↓
                                         /speckit.tasks  →  /speckit.analyze  →  /speckit.implement
```

### Artifacts per Feature

All artifacts live under `specs/<feature-id>/`:
- `spec.md` — requirements and acceptance criteria
- `plan.md` — technical plan and design decisions
- `tasks.md` — ordered implementation tasks
- `checklists/requirements.md` — QA checklist
- `contracts/api-routes.md` — API contract
- `data-model.md` — data shapes and schema
- `manual-testing-guide.md` — manual QA steps
- `test-results.md` — recorded test outcomes
- `quickstart.md` — fast-path setup for QA/dev

### Naming Convention

Feature branches and spec folders follow `NNN-kebab-description` (e.g. `001-tap-payment-verification`).

### Secrets Policy

Never commit real API keys to spec docs. Use `sk_test_YOUR_TAP_TEST_KEY_HERE` or similar placeholders in documentation. Real keys go in `.env.local` only.
<!-- MANUAL ADDITIONS END -->
