# Research: Tap Payment Verification & QA

**Feature**: `001-tap-payment-verification`
**Date**: 2026-03-21

---

## R1: Missing `GET /my-content/` Proxy Route

**Decision**: Create a new Next.js API proxy route at `src/app/api/my-content/route.ts` that forwards to the Django `GET /my-content/` endpoint with JWT auth.

**Rationale**: The backend already implements `GET /my-content/` (confirmed in Swagger) that returns only content purchased by the authenticated user. The frontend `MyContentPanel` currently calls `GET /content/` (all content) and filters client-side by role — this is incorrect for students who should see only purchased courses. A proper proxy route follows the constitution's API-First principle (Principle I).

**Alternatives considered**:
- Keep client-side filtering: Rejected — leaks all content data to the client, cannot enforce purchase-gating.
- Call Django directly from the client: Rejected — violates constitution (no direct `fetch` outside `src/lib/` helpers).

**Implementation pattern**: Follow the existing proxy pattern in `src/app/api/payment/orders/route.ts` — use `apiGetWithCookies<Content[]>("/my-content/", true)` and return `NextResponse.json(data)`.

---

## R2: `PaymentHistoryPanel` Uses Hardcoded Mock Data

**Decision**: Replace the entire hardcoded `payments` array in `PaymentHistoryPanel.tsx` with real API calls using the existing `fetchOrders()` service function from `paymentService.ts`. Use TanStack React Query for data fetching (constitution Principle VI).

**Rationale**: `PaymentHistoryPanel` currently has 8 hardcoded mock payments (INV-2025-001 through INV-2025-008) with fake card numbers. The `OrdersPanel` already proves that `fetchOrders()` → `GET /api/payment/orders` → `GET /order/` works correctly. The backend scopes `GET /order/` to the current user for non-admin users (confirmed assumption).

**Alternatives considered**:
- Create a new `GET /order/my/` endpoint: Rejected — the existing `GET /order/` already scopes by user on the backend; no need for a second endpoint.
- Reuse `OrdersPanel` for students: Rejected — `OrdersPanel` has admin-oriented UI (shows User ID column); `PaymentHistoryPanel` has a better student UX with invoice modals and payment card visuals.

---

## R3: `MyContentPanel` Role-Based Data Source

**Decision**: Branch the data source inside `MyContentPanel` based on user role:
- **Students** (not instructor, not superuser): Use a new `fetchMyContent()` service function → `GET /api/my-content/` → Django `GET /my-content/`.
- **Instructors**: Keep current `fetchContent()` call filtered by `creator === user.id`.
- **Superusers**: Keep current `fetchContent()` call (all content).

**Rationale**: `GET /my-content/` only returns purchased content, not creator-owned content. Instructors need to see content they've created (which they may not have purchased), so they should continue using `GET /content/`. Superusers see everything.

**Alternatives considered**:
- Use `GET /my-content/` for all roles: Rejected — instructors would lose visibility into their own unpurchased/draft content.

---

## R4: OpenAPI Schema Findings

### `POST /create-charge/`
- **Schema gap**: The Swagger docs define NO request or response body (just `200: No response body`). However, the frontend implementation confirms the shape:
  - Request: `{ first_name, last_name, email, method, courses: number[] }`
  - Response: `{ url: string }` (Tap hosted checkout URL)
- These types are already correctly defined in `src/types/payment.ts`.

### `GET /order/` and `GET /order/{id}`
- **Order schema** (from OpenAPI):
  ```
  id: integer (read-only)
  amount: number (double)
  tap_charge_id: string | null (maxLength: 255)
  status: "pending" | "paid" | "failed"
  created_at: string (date-time, read-only)
  method: string (maxLength: 20)
  user: integer
  ```
- Matches the existing `Order` TypeScript interface in `src/types/payment.ts` exactly.

### `GET /my-content/`
- Returns `Content[]` — same schema as `GET /content/`:
  ```
  id: integer (read-only)
  name: string (maxLength: 255)
  description: string
  price: string (decimal, pattern: ^-?\d{0,6}(?:\.\d{0,2})?$)
  is_published: boolean
  subcategory: integer
  creator: integer
  ```
- **Note**: The `price` field is a decimal string in the backend, but the existing `Content` TypeScript interface has `price: number`. The existing `fetchContent()` service already handles this without issue (JSON.parse coerces).
- **Note**: The backend `Content` schema does NOT include `creator_name` — that's added by a separate serializer or annotation. `GET /my-content/` may or may not include it; needs testing.

---

## R5: Webhook Endpoint Status

**Decision**: No frontend work required for the webhook. The webhook is a backend-only endpoint (Tap calls the backend directly). However, we must verify it works by testing the order status lifecycle.

**Rationale**: Tap sends a POST to the backend when payment status changes. This endpoint is NOT in the Swagger docs (intentionally or accidentally). The frontend relies on the order status being updated by this webhook — if it doesn't work, `GET /order/{id}` will show `"pending"` forever.

**Verification approach**: After completing a test payment, poll `GET /order/{id}` and confirm status transitions from `"pending"` → `"paid"` or `"failed"` within 10 seconds.

---

## R6: i18n Keys Status

**Existing keys** (both locales): All `payment.*`, `cart.*`, and `dashboard.*` keys are already bilingual and complete for the current checkout/success/failed flows.

**New keys needed**:
- `dashboard.orders` — currently hardcoded as "Orders" / "الطلبات" in sidebar
- `dashboard.contentManagement` — hardcoded as "Content Management" / "إدارة المحتوى"
- `dashboard.lessonManagement` — hardcoded as "Lesson Management" / "إدارة الدروس"
- `dashboard.myContent` — hardcoded as "My Content" / "محتواي"
- `payment.noTransactions` / `payment.noTransactionsDescription` — for empty state in PaymentHistoryPanel
- Any hardcoded English strings in `OrdersPanel.tsx` (e.g., "Orders", "All Orders", "No orders yet", "Retry", "Back to Orders", "Order Details", etc.)

---

## R7: Existing Violations Found

### Constitution Principle I (API-First): VIOLATION
- `MyContentPanel` fetches all content and filters client-side — must be replaced with `GET /my-content/` for students.

### Constitution Principle III (Bilingual-First): VIOLATION
- `OrdersPanel.tsx` has hardcoded English strings ("Orders", "All Orders", "No orders yet", etc.)
- `PaymentHistoryPanel.tsx` has hardcoded English strings ("Payment history", "Transactions", etc.)
- `app-sidebar.tsx` has some hardcoded bilingual strings (inline conditionals) instead of using `next-intl`

### Constitution Principle VI (Performance): VIOLATION
- `OrdersPanel.tsx` uses raw `useEffect` + `fetch` pattern instead of TanStack React Query
- `PaymentHistoryPanel.tsx` doesn't fetch at all (hardcoded data)

### Constitution Principle II (Type Safety):
- `PaymentHistoryPanel.tsx` defines its own `Payment` type with fake card numbers — must be replaced with the real `Order` type from `src/types/payment.ts`
