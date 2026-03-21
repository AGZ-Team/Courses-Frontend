# Implementation Plan: Tap Payment Verification & QA

**Branch**: `001-tap-payment-verification` | **Date**: 2026-03-21 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-tap-payment-verification/spec.md`

## Summary

Verify and complete the Tap Payment Gateway integration by:
1. Wiring the missing `GET /my-content/` backend endpoint to the frontend (new proxy route + service function + panel update)
2. Replacing hardcoded mock data in `PaymentHistoryPanel` with real orders from `GET /order/`
3. Migrating `OrdersPanel` from `useEffect` to React Query for constitution compliance
4. Adding missing i18n keys for dashboard panels (currently hardcoded English/Arabic)
5. Running end-to-end verification of the full payment flow (checkout → Tap → success/failed → dashboard)

## Technical Context

**Language/Version**: TypeScript ^5.5 (strict mode)
**Primary Dependencies**: Next.js ^16.x (App Router), React 19, TanStack React Query ^5.x, Zustand ^5.x, next-intl ^4.5.5, Zod ^4.x, Tailwind CSS 4, shadcn/ui
**Storage**: Django REST Framework (backend) via `https://api.cr-ai.cloud`; client-side cart via Zustand + localStorage
**Testing**: Playwright (browser E2E), manual Swagger API testing, webhook lifecycle verification
**Target Platform**: Web (Next.js SSR + client), Docker (Nginx + Node)
**Project Type**: Web application (frontend only — backend is separate Django project)
**Performance Goals**: Checkout-to-success flow < 2 minutes; order status update via webhook < 10 seconds
**Constraints**: No new dependencies (all tools already in stack); backend is owned by separate team (we can verify endpoints but not modify them)
**Scale/Scope**: 5 files modified, 1 new file, 2 i18n files updated; ~400 lines changed

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-design check

| # | Principle | Status | Notes |
|---|-----------|--------|-------|
| I | API-First Frontend | ⚠ VIOLATION → FIX | `MyContentPanel` fetches all content and filters client-side. Must switch students to `GET /my-content/`. |
| II | Type Safety | ⚠ VIOLATION → FIX | `PaymentHistoryPanel` defines its own `Payment` type with fake data. Must use `Order` from `src/types/payment.ts`. |
| III | Bilingual-First | ⚠ VIOLATION → FIX | `OrdersPanel.tsx`, `PaymentHistoryPanel.tsx`, and sidebar have hardcoded English strings. Must use `next-intl`. |
| IV | Component Composition | ✅ Pass | All panels use `src/components/ui/` primitives (Card, Badge, Button, Sheet). No raw Radix imports. |
| V | Authentication & Security | ✅ Pass | All API routes use `credentials: 'include'`; auth enforced via `apiGetWithCookies(..., true)`. |
| VI | Performance & UX | ⚠ VIOLATION → FIX | `OrdersPanel` uses raw `useEffect` + `fetch`. Must migrate to TanStack React Query. |
| VII | Simplicity | ✅ Pass | No new abstractions introduced. Reusing existing patterns (proxy routes, service functions, React Query). |

### Post-design re-check

All violations have fix plans:
- **Principle I**: New `GET /api/my-content/` proxy route + `fetchMyContent()` service function for students.
- **Principle II**: Remove `Payment` type; use `Order` from `src/types/payment.ts`.
- **Principle III**: Add i18n keys to both `en.json` and `ar.json` for all hardcoded strings in affected panels.
- **Principle VI**: Migrate `OrdersPanel` to `useQuery` from `@tanstack/react-query`.

**Gate result**: ✅ PASS (all violations have justified fixes within this plan)

## Project Structure

### Documentation (this feature)

```text
specs/001-tap-payment-verification/
├── plan.md                          # This file
├── spec.md                          # Feature specification
├── research.md                      # Phase 0 research findings
├── data-model.md                    # Entity definitions and relationships
├── quickstart.md                    # Quick verification steps
├── manual-testing-guide.md          # 24-case manual test suite
├── checklists/
│   └── requirements.md              # Spec quality checklist
└── contracts/
    └── api-routes.md                # API route contracts
```

### Source Code (files to create/modify)

```text
src/
├── app/
│   └── api/
│       └── my-content/
│           └── route.ts             # NEW: proxy → GET /my-content/
├── services/
│   └── contentService.ts            # ADD: fetchMyContent()
├── components/
│   └── Dashboard/
│       └── Panels/
│           ├── MyContentPanel.tsx    # MODIFY: branch by role
│           ├── PaymentHistoryPanel.tsx # REWRITE: real data from fetchOrders()
│           └── OrdersPanel.tsx       # MODIFY: React Query + i18n
messages/
├── en.json                          # ADD: dashboard panel i18n keys
└── ar.json                          # ADD: dashboard panel i18n keys
```

**Structure Decision**: Single Next.js project, frontend-only changes. Backend is external (Django REST at `api.cr-ai.cloud`). All changes are within the existing `src/` tree following established patterns.

## Complexity Tracking

No complexity violations. All changes follow existing patterns:
- New proxy route follows `src/app/api/payment/orders/route.ts` pattern
- New service function follows `fetchContent()` pattern in `contentService.ts`
- Panel data fetching follows `MyContentPanel`'s existing React Query usage
- i18n follows existing `useTranslations()` + `messages/*.json` pattern
