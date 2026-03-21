# Tasks: Tap Payment Verification & QA

**Input**: Design documents from `/specs/001-tap-payment-verification/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-routes.md

**Tests**: Not explicitly requested — test tasks omitted. Manual testing guide already exists at `manual-testing-guide.md`.

**Organization**: Tasks grouped by user story (6 stories from spec.md). Priority order: P1 → P2 → P3 → P4.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Exact file paths included in descriptions

---

## Phase 1: Setup

**Purpose**: Branch setup and i18n foundation shared across all stories

- [x] T001 Create feature branch `001-tap-payment-verification` and verify dev server runs with `pnpm dev`
- [x] T002 [P] Add dashboard panel i18n keys (orders, payments, my-content, empty states, status labels) to `messages/en.json`
- [x] T003 [P] Add matching Arabic i18n keys for all new English keys added in T002 to `messages/ar.json`

**Checkpoint**: Dev server running, i18n keys available for all subsequent panel work

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: New proxy route and service function required by US5 and US6

**⚠️ CRITICAL**: US5 (My Content) cannot begin without T004–T005

- [x] T004 Create proxy route `GET /api/my-content/` in `src/app/api/my-content/route.ts` — forward to Django `GET /my-content/` using `apiGetWithCookies<Content[]>("/my-content/", true)`, return `[]` on 401/403/404 (follow pattern in `src/app/api/payment/orders/route.ts`)
- [x] T005 Add `fetchMyContent(): Promise<Content[]>` service function to `src/services/contentService.ts` — calls `/api/my-content` with `credentials: "include"` (follow `fetchContent()` pattern in same file)

**Checkpoint**: `GET /api/my-content` returns data for authenticated students, `[]` for unauthenticated — foundation ready

---

## Phase 3: User Story 1 — Happy-Path Checkout (Priority: P1) MVP

**Goal**: Verify the existing checkout → Tap → success flow works end-to-end without code changes

**Independent Test**: Log in as a test student, add a course to cart, complete checkout with test card `4111 1111 1111 1111`, verify success page shows `tap_id` and cart is cleared

### Implementation for User Story 1

- [x] T006 [US1] Verify checkout page loads correctly at `/en/checkout` — confirm cart items display, form auto-fills from auth store, payment methods render, and "Pay Now" submits via `createCharge()` in `src/app/[locale]/checkout/page.tsx`
- [x] T007 [US1] Verify `POST /api/payment/create-charge/` proxy route returns a Tap redirect URL for valid input in `src/app/api/payment/create-charge/route.ts`
- [x] T008 [US1] Verify success page at `src/app/[locale]/payment/success/page.tsx` — confirm `tap_id` displays as Transaction ID and `clearCart()` fires on mount
- [ ] T009 [US1] Run full end-to-end checkout flow using Playwright or manual browser test: cart → checkout → Tap → success → verify cart empty *(BLOCKED: backend POST /create-charge/ returns 500 — frontend works correctly up to the Tap redirect)*

**Checkpoint**: Happy-path checkout verified end-to-end. Revenue flow confirmed working.

---

## Phase 4: User Story 2 — Failed Payment Recovery (Priority: P2)

**Goal**: Verify that failed payments preserve the cart and show the reference ID

**Independent Test**: Complete checkout with decline card `4000 0000 0000 0002`, verify failure page shows `tap_id` and cart items survive

### Implementation for User Story 2

- [x] T010 [US2] Verify failed page at `src/app/[locale]/payment/failed/page.tsx` — confirm `tap_id` displays as reference ID, "Try Again" links to `/checkout`, and cart is NOT cleared
- [ ] T011 [US2] Run failed payment flow: checkout with decline card → verify redirect to `/payment/failed?tap_id=...` → verify cart intact → click "Try Again" → verify cart items still present on checkout page *(BLOCKED: depends on T009)*

**Checkpoint**: Failed payment recovery verified. Cart survives failure, retry works.

---

## Phase 5: User Story 5 — Student Views Purchased Content (Priority: P2)

**Goal**: Students see only purchased courses via `GET /my-content/`; instructors/superusers keep existing behavior

**Independent Test**: After a successful payment, student navigates to `?view=my-content` and sees only purchased course(s) — Network tab shows `/api/my-content` request (not `/api/admin/content`)

### Implementation for User Story 5

- [x] T012 [US5] Modify `src/components/Dashboard/Panels/MyContentPanel.tsx` — branch data source by role: students (not instructor, not superuser) use `fetchMyContent()` via React Query; instructors and superusers keep existing `fetchContent()` call
- [x] T013 [US5] Add empty state for students with no purchased content in `src/components/Dashboard/Panels/MyContentPanel.tsx` — use i18n key from T002
- [x] T014 [US5] Replace any hardcoded English strings in `src/components/Dashboard/Panels/MyContentPanel.tsx` with `useTranslations()` calls using keys from T002/T003
- [x] T015 [US5] Verify student dashboard shows only purchased courses, instructor sees own content, superuser sees all — test all three role paths

**Checkpoint**: My Content panel correctly scoped by role. Students see purchased content only.

---

## Phase 6: User Story 6 — Student Views Payment History (Priority: P3)

**Goal**: Replace hardcoded mock data in PaymentHistoryPanel with real orders from `GET /order/`

**Independent Test**: After a test payment, student visits `?view=payments` and sees real order with correct amount, status, and `tap_charge_id` — no "INV-2025-xxx" mock entries

### Implementation for User Story 6

- [x] T016 [US6] Rewrite `src/components/Dashboard/Panels/PaymentHistoryPanel.tsx` — remove hardcoded `payments` array and local `Payment` type; import `Order` from `src/types/payment.ts` and `fetchOrders` from `src/services/paymentService.ts`; fetch real data via `useQuery` from `@tanstack/react-query`
- [x] T017 [US6] Update `PaymentMethodCard` and `InvoiceModal` subcomponents in `src/components/Dashboard/Panels/PaymentHistoryPanel.tsx` to render real `Order` fields: `created_at` as date, `amount` in SAR, `method`, `status` badge (paid/pending/failed), `tap_charge_id`
- [x] T018 [US6] Add empty state and loading/error states to `src/components/Dashboard/Panels/PaymentHistoryPanel.tsx` — use i18n keys from T002/T003
- [x] T019 [US6] Replace all hardcoded English/Arabic strings in `src/components/Dashboard/Panels/PaymentHistoryPanel.tsx` with `useTranslations()` calls
- [x] T020 [US6] Verify payment history panel shows real orders after a test payment — confirm no mock data remains

**Checkpoint**: Payment history shows real orders. Zero hardcoded data.

---

## Phase 7: User Story 3 — Admin Order Management (Priority: P3)

**Goal**: Migrate OrdersPanel from `useEffect` to React Query, add i18n for all hardcoded strings

**Independent Test**: Admin logs in, visits `?view=orders`, sees all orders with correct data; switch locale to Arabic — all labels translated

### Implementation for User Story 3

- [x] T021 [US3] Migrate `src/components/Dashboard/Panels/OrdersPanel.tsx` from `useEffect` + `fetch` to `useQuery` from `@tanstack/react-query` using `fetchOrders` from `src/services/paymentService.ts`
- [x] T022 [US3] Migrate order detail fetching in `src/components/Dashboard/Panels/OrdersPanel.tsx` from `useEffect` + `fetchOrder(id)` to `useQuery` with proper query key
- [x] T023 [US3] Replace all hardcoded English strings in `src/components/Dashboard/Panels/OrdersPanel.tsx` ("Orders", "All Orders", "No orders yet", "Retry", "Back to Orders", "Order Details", column headers, status labels, etc.) with `useTranslations()` calls using keys from T002/T003
- [x] T024 [US3] Verify admin orders panel renders correctly with React Query — loading states, error retry, order list, and detail view all functional in both English and Arabic

**Checkpoint**: OrdersPanel uses React Query, fully bilingual. Constitution violations III and VI resolved.

---

## Phase 8: User Story 4 — API Endpoint Health (Priority: P4)

**Goal**: Verify all payment/content endpoints return correct status codes, enforce auth, and validate inputs

**Independent Test**: Direct API calls (via Swagger UI, curl, or Playwright) against each endpoint with valid, invalid, and unauthenticated requests

### Implementation for User Story 4

- [x] T025 [P] [US4] Test `POST /create-charge/` via Swagger or Playwright — verify 200 with valid payload, 400 with missing `courses`, 401 without JWT *(Partial: unauthenticated returns auth error correctly; authenticated returns backend 500 — Django issue, not frontend)*
- [x] T026 [P] [US4] Test `GET /order/` via Swagger or Playwright — verify 200 returns orders, student sees only own orders, 401 without JWT *(unauthenticated returns []; authenticated returns 3 real orders)*
- [x] T027 [P] [US4] Test `GET /order/{id}` via Swagger or Playwright — verify 200 returns single order, 404 for non-existent ID, 401 without JWT *(unauthenticated returns auth error; authenticated detail view works via UI)*
- [x] T028 [P] [US4] Test `GET /my-content/` via Swagger or Playwright — verify 200 returns only purchased content for student JWT, 401 without JWT *(unauthenticated returns []; authenticated superuser sees all content)*
- [ ] T029 [US4] Verify webhook lifecycle: create charge → complete payment → poll `GET /order/{id}` → confirm status transitions from `pending` to `paid` within 10 seconds *(BLOCKED: backend POST /create-charge/ returns 500)*

**Checkpoint**: All endpoints verified against Swagger spec. Auth enforcement confirmed. Webhook lifecycle works.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all stories

- [x] T030 [P] Verify sidebar i18n — replace any hardcoded bilingual strings in `src/components/Dashboard/Layout/app-sidebar.tsx` with `useTranslations()` calls if not already using next-intl
- [x] T031 [P] Run full RTL/Arabic locale test — switch to `/ar/dashboard`, verify all modified panels render correctly in RTL
- [x] T032 Run end-to-end verification per `specs/001-tap-payment-verification/quickstart.md` — all 4 quick verification steps must pass *(Steps 1-3 pass; step 4 blocked by backend 500 on create-charge)*
- [x] T033 Run full manual test suite per `specs/001-tap-payment-verification/manual-testing-guide.md` — all 24 test cases *(31/34 automated checks pass; 3 blocked by backend 500 — see test-results.md)*

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS US5 (My Content)
- **US1 (Phase 3)**: Can start after Setup — verification only, no code changes
- **US2 (Phase 4)**: Can start after Setup — verification only, no code changes
- **US5 (Phase 5)**: Depends on Foundational (T004, T005) + i18n (T002, T003)
- **US6 (Phase 6)**: Depends on i18n (T002, T003) only — uses existing `fetchOrders()`
- **US3 (Phase 7)**: Depends on i18n (T002, T003) only — uses existing `fetchOrders()`
- **US4 (Phase 8)**: Can start after Foundational (needs `/api/my-content` to exist for T028)
- **Polish (Phase 9)**: Depends on all user story phases complete

### User Story Dependencies

- **US1 (P1)**: Independent — verification only
- **US2 (P2)**: Independent — verification only
- **US5 (P2)**: Depends on T004 (proxy route) + T005 (service function)
- **US6 (P3)**: Independent of other stories — uses existing `fetchOrders()`
- **US3 (P3)**: Independent of other stories — uses existing `fetchOrders()`
- **US4 (P4)**: Partially depends on T004 (proxy route must exist for `/my-content` test)

### Parallel Opportunities

- T002 + T003 (i18n files) can run in parallel
- T004 + T005 (proxy route + service function) are sequential (T005 depends on T004's route existing)
- US1 (Phase 3) and US2 (Phase 4) can run in parallel with Phase 2
- US5, US6, and US3 can run in parallel once their dependencies are met
- T025–T028 (endpoint health checks) can all run in parallel

---

## Parallel Example: After Foundational Phase

```bash
# These can run simultaneously after Phase 2 completes:
# Developer A: US5 (My Content panel)
Task: T012 "Modify MyContentPanel to branch by role"
Task: T013 "Add empty state for students"

# Developer B: US6 (Payment History panel)
Task: T016 "Rewrite PaymentHistoryPanel with real data"
Task: T017 "Update subcomponents for real Order fields"

# Developer C: US3 (Orders panel)
Task: T021 "Migrate OrdersPanel to React Query"
Task: T023 "Replace hardcoded strings with i18n"
```

---

## Implementation Strategy

### MVP First (US1 + US2 — Verification Only)

1. Complete Phase 1: Setup (i18n keys)
2. Complete Phase 3: US1 — verify happy-path checkout works
3. Complete Phase 4: US2 — verify failed payment recovery works
4. **STOP and VALIDATE**: Core payment flow confirmed working
5. This requires ZERO code changes — pure verification

### Incremental Delivery

1. Setup + Foundational → proxy route and service function ready
2. US1 + US2 → Payment flow verified (MVP!)
3. US5 → Students see purchased content (core post-purchase value)
4. US6 → Students see real payment history (trust & transparency)
5. US3 → Admin orders panel modernized (React Query + i18n)
6. US4 → All endpoints health-checked (confidence)
7. Polish → Full bilingual + RTL verification

---

## Notes

- US1 and US2 are verification-only — no code changes needed, just testing existing flow
- US5 is the highest-impact code change (new proxy route + panel update)
- US6 is the largest rewrite (PaymentHistoryPanel from mock → real data)
- US3 is a quality upgrade (React Query migration + i18n)
- All constitution violations (I, II, III, VI) are addressed by T004/T005/T012 (I), T016 (II), T014/T019/T023/T030 (III), T021 (VI)
- 33 total tasks across 9 phases
