# Feature Specification: Tap Payment Integration — Verification & QA

**Feature Branch**: `001-tap-payment-verification`
**Created**: 2026-03-21
**Status**: Active
**Input**: Verify that the full Tap Payment Gateway integration (checkout → Tap hosted page → redirect back → order record) is working correctly end-to-end, covering all backend API endpoints visible in the Swagger docs at `https://api.cr-ai.cloud/api/docs/`. Two backend endpoints (`GET /my-content/` and `GET /order/`) are not yet wired to the frontend and must be connected.

---

## Clarifications

### Session 2026-03-21

- Q: What should a regular student see in the "My Content" panel? → A: Only purchased/enrolled content via `GET /my-content/` (replace client-side filter); instructors and superusers keep `GET /content/`.
- Q: How should user-facing payment history work? → A: Connect `PaymentHistoryPanel` to `GET /order/` — backend filters response to the current user's orders automatically.
- Q: Should purchased course lessons open inline or on a new page? → A: Expand lessons inline in the dashboard panel (existing accordion pattern — no new route needed).

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Happy-Path Checkout (Priority: P1)

A logged-in student adds one or more courses to their cart, proceeds to the checkout page, reviews the order summary (course titles, prices, total), fills in their details (auto-filled from their profile), selects a payment method (card / mada / Apple Pay / Samsung Pay), and clicks "Pay Now". They are redirected to the Tap hosted checkout page where they complete payment using test credentials. Tap then redirects them back to the success page, which shows the transaction ID (`tap_id`) and confirms the cart has been cleared.

**Why this priority**: Revenue is the primary business goal. A broken checkout means zero sales. This is the single most critical user path.

**Independent Test**: Tested end-to-end by having a logged-in test user with at least one item in the cart and completing the full checkout flow using Tap's test card number.

**Acceptance Scenarios**:

1. **Given** a logged-in user with 1+ courses in the cart, **When** they visit `/checkout`, **Then** the order summary displays course titles, images, author names, and the correct total price.
2. **Given** a filled checkout form with first name, last name, email, and payment method selected, **When** the user clicks "Pay Now", **Then** a charge request is sent and the user is redirected to the Tap hosted checkout URL.
3. **Given** the user completes payment successfully on the Tap hosted page, **When** Tap redirects to `/payment/success?tap_id=chg_xxx`, **Then** the success page shows the `tap_id` as "Transaction ID" and the cart is empty.
4. **Given** an unauthenticated user, **When** they attempt to submit a charge request, **Then** the API MUST return a 401/403 response and no charge is created.
5. **Given** the checkout page loads before client-side state rehydrates, **When** the component mounts, **Then** there is no flash of empty cart (hydration guard is active).

---

### User Story 2 — Failed Payment Recovery (Priority: P2)

A student goes through checkout but the payment fails at the Tap side (e.g., card declined). Tap redirects them to the failure page with a `tap_id` reference. The student sees a clear failure message and their reference ID for support, and can click "Try Again" to return to checkout with their cart still intact.

**Why this priority**: Handling failure gracefully retains users who would otherwise abandon. Cart persistence across failure is critical for conversion recovery.

**Independent Test**: Tested by using Tap's test decline card through the full checkout flow and asserting the cart survives the failure redirect.

**Acceptance Scenarios**:

1. **Given** a student whose payment is declined by Tap, **When** Tap redirects to `/payment/failed?tap_id=chg_yyy`, **Then** the page displays the reference ID and a "Try Again" option.
2. **Given** the student clicks "Try Again", **When** the checkout page loads, **Then** all previously added cart items MUST still be present (cart is only cleared on success).
3. **Given** a failed payment with a `tap_id`, **When** the student contacts support, **Then** they can provide the reference ID to identify the attempted transaction.

---

### User Story 3 — Admin Order Management (Priority: P3)

An admin can retrieve all orders via the orders API and view individual order details. Each order record includes the Tap charge ID, payment status, amount, payment method, and the associated user. Orders are created when a charge is initiated, and their status reflects the outcome reported by Tap.

**Why this priority**: Without reliable order records there is no audit trail for fulfillment, refunds, or revenue tracking.

**Independent Test**: After a test payment (success or failure), query `GET /order/` and `GET /order/{id}` to verify the record exists with all required fields populated.

**Acceptance Scenarios**:

1. **Given** a completed charge attempt, **When** an authenticated admin calls `GET /order/`, **Then** the response MUST include an entry with `tap_charge_id`, `status`, `amount`, `method`, and `user`.
2. **Given** a known order ID, **When** an admin calls `GET /order/{id}`, **Then** the response MUST return the single order record with all fields.
3. **Given** a successful Tap payment, **When** the order record is inspected, **Then** `status` MUST be `"paid"` and `tap_charge_id` MUST match the `tap_id` from the success redirect.
4. **Given** an unauthenticated user, **When** they call `GET /order/` or `GET /order/{id}`, **Then** the API MUST return 401/403.

---

### User Story 4 — API Endpoint Health (Priority: P4)

All payment-related backend endpoints (`POST /create-charge/`, `GET /order/`, `GET /order/{id}`, `GET /my-content/`) respond with correct HTTP status codes, enforce authentication, and return proper validation errors for bad inputs.

**Why this priority**: Endpoint correctness is a prerequisite for all other stories. Misconfigured auth or missing validation silently breaks the flow.

**Independent Test**: Each endpoint tested in isolation via direct API calls — no browser flow required.

**Acceptance Scenarios**:

1. **Given** a request to `POST /create-charge/` with missing required fields (e.g., no `courses`), **When** submitted, **Then** the API MUST return 400 with a descriptive error.
2. **Given** a request to `POST /create-charge/` with invalid (non-existent) course IDs, **When** submitted, **Then** the API MUST return 400 or 404.
3. **Given** `GET /order/` called with a valid JWT belonging to a non-admin user, **When** the response arrives, **Then** it MUST return only that user's own orders (not all users').
4. **Given** any payment endpoint called with an expired or missing JWT, **When** the request arrives, **Then** the API MUST return 401 with a clear error message.
5. **Given** `GET /my-content/` called with a valid student JWT, **When** the response arrives, **Then** it MUST return only the content records the student has purchased.

---

### User Story 5 — Student Views Purchased Content (Priority: P2)

A student who has completed a payment can navigate to the "My Content" section of their dashboard and see only the courses they have purchased. Each course expands inline to reveal its lessons (accordion pattern). Students do NOT see content they haven't paid for. Instructors and superusers continue to use the full content management view.

**Why this priority**: This is the core post-purchase value delivery — if students can't access what they bought, the purchase has no utility.

**Independent Test**: After completing a successful test payment, the student logs into their dashboard, navigates to "My Content", and verifies only their purchased course(s) appear, expandable with lessons.

**Acceptance Scenarios**:

1. **Given** a student who has purchased at least one course, **When** they visit the "My Content" dashboard panel, **Then** the panel MUST call `GET /my-content/` and display only courses linked to their completed orders.
2. **Given** a purchased course displayed in the panel, **When** the student clicks the expand chevron, **Then** the lessons inside that course expand inline in an accordion, identical to the existing expand pattern.
3. **Given** a student who has purchased no courses, **When** they visit "My Content", **Then** an empty state MUST be shown (no courses yet, not an error).
4. **Given** an instructor or superuser, **When** they visit "My Content", **Then** the panel MUST continue to use `GET /content/` (full content list) rather than `GET /my-content/`.
5. **Given** an unauthenticated user attempts to call `GET /my-content/`, **When** the request arrives, **Then** the API MUST return 401/403.

---

### User Story 6 — Student Views Payment History (Priority: P3)

A student can view their own real payment history in the dashboard's "Payments" panel. The panel currently shows hardcoded mock data; it must be connected to the real orders API so students see their actual transactions (date, amount, method, status, Tap charge ID). Each transaction is viewable in detail.

**Why this priority**: Students need to verify their purchase, get receipts, and trust the platform's transaction records. Mock data erodes that trust.

**Independent Test**: After a test payment, a student opens the "Payments" dashboard panel and sees at least one real order entry matching the Tap charge they just completed.

**Acceptance Scenarios**:

1. **Given** a logged-in student, **When** they visit `?view=payments` in the dashboard, **Then** the panel MUST call `GET /order/` (backend scopes to current user) and display only that student's orders.
2. **Given** at least one real order exists for the student, **When** the panel loads, **Then** each order MUST display: date, amount (SAR), payment method, status badge (paid / pending / failed), and Tap charge ID.
3. **Given** the student clicks "View" on an order, **When** the detail modal opens, **Then** it MUST show all real order fields — no hardcoded placeholder data.
4. **Given** a student with no orders, **When** the panel loads, **Then** an empty state MUST be shown (no transactions yet).
5. **Given** a new successful payment is completed, **When** the student refreshes the payments panel, **Then** the new order MUST appear with `status = "paid"`.

---

### Edge Cases

- What happens when the cart contains a course ID that no longer exists on the backend?
- What happens if the user closes the browser on the Tap hosted page without completing or declining?
- What happens if Tap sends a webhook for an already-`paid` order (duplicate webhook / retry)?
- What happens when the user has the checkout page open in two browser tabs simultaneously?
- What is the behavior when `POST /create-charge/` succeeds but the backend fails to create the order record?
- Is there a minimum or maximum number of courses allowed per charge request?
- What happens when a user submits the checkout form multiple times quickly (double-submit)?
- What happens when `GET /my-content/` returns content the student purchased but that content has since been unpublished?
- What happens if the student's order status is `pending` (payment in-flight) when they check "My Content"?

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST accept a charge request containing first name, last name, email, payment method, and at least one valid course ID, and MUST return a Tap-hosted checkout URL.
- **FR-002**: The success page MUST display the `tap_id` received from the Tap redirect URL parameter as the "Transaction ID".
- **FR-003**: The success page MUST clear the user's cart upon load so purchased courses are no longer listed.
- **FR-004**: The failure page MUST display the `tap_id` as a support reference and MUST NOT clear the cart.
- **FR-005**: The orders API (`GET /order/` and `GET /order/{id}`) MUST return order records containing `tap_charge_id`, `status`, `amount`, `method`, and `user`.
- **FR-006**: All payment and content endpoints MUST enforce authentication — unauthenticated requests MUST be rejected with 401 or 403.
- **FR-007**: The checkout page MUST pre-fill first name, last name, and email from the authenticated user's profile when available.
- **FR-008**: If no courses are in the cart and no `?courses=` URL param is present, the checkout page MUST display an empty-cart state and the Pay button MUST NOT be accessible.
- **FR-009**: The system MUST support four payment methods — card, mada, Apple Pay, Samsung Pay — and the selected method MUST be included in the charge request.
- **FR-010**: The order status MUST transition from `pending` → `paid` after a successful payment and `pending` → `failed` after a declined payment.
- **FR-011**: A webhook endpoint MUST exist on the backend to receive Tap's server-to-server payment status callbacks and update the corresponding order record accordingly.
- **FR-012**: The student-facing "My Content" dashboard panel MUST call `GET /my-content/` to retrieve only the courses the current user has purchased; it MUST NOT show content from other users' purchases. Instructors and superusers MUST continue to use `GET /content/`.
- **FR-013**: Purchased courses in the "My Content" panel MUST expand inline (accordion) to display their associated lessons — no separate page navigation required.
- **FR-014**: The student-facing "Payments" dashboard panel MUST call `GET /order/` (scoped by the backend to the current user) and display real transaction records; the hardcoded mock data MUST be removed. Each record MUST show date, amount, method, status, and Tap charge ID.

### Key Entities

- **Order**: A payment transaction record. Key attributes: id, amount (SAR), tap_charge_id (Tap's charge reference), status (pending / paid / failed), method (card / mada / apple / samsung), user (user ID), created_at.
- **Charge Request**: The payload sent to initiate a payment. Attributes: first_name, last_name, email, method, courses (array of course IDs).
- **Charge Response**: The result of successful charge creation. Attributes: url (Tap-hosted checkout URL).
- **Cart Item**: A course held client-side pending purchase. Attributes: id (course ID), title, image, price, author.
- **My Content Item**: A course the student has purchased and is entitled to access. Returned by `GET /my-content/`. Shares structure with Content but scoped to the authenticated user's completed orders.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A logged-in user with at least one course in the cart can complete the full checkout-to-success flow using Tap's test environment without any errors.
- **SC-002**: 100% of charge requests with valid inputs return a redirect URL — no silent failures allowed.
- **SC-003**: After a successful payment, the user's cart is empty upon loading the success page — verified in every test run.
- **SC-004**: All 5 payment and content API endpoints (`POST /create-charge/`, `GET /order/`, `GET /order/{id}`, `GET /my-content/`, and any webhook endpoint) return correct HTTP status codes for both authenticated and unauthenticated requests.
- **SC-005**: Failed payments do NOT clear the cart — 100% of retry attempts from the failure page return to checkout with original cart items intact.
- **SC-006**: Every successful Tap payment produces an order record with `status = "paid"` and a non-null `tap_charge_id` within 10 seconds of the redirect.
- **SC-007**: The checkout form pre-fills user name and email from the authenticated profile in 100% of cases where that data is available.
- **SC-008**: All API endpoint health checks (auth enforcement, validation errors, correct response shapes) pass with zero failures against the Swagger specification.
- **SC-009**: A student who has completed a purchase sees only their purchased courses in the "My Content" panel — verified by confirming the panel calls `GET /my-content/` and shows zero courses from other users.
- **SC-010**: The student "Payments" panel shows zero hardcoded entries — all displayed orders come from `GET /order/` and match real database records.

---

## Testing Strategy

> This section describes the recommended approach for verifying this QA feature. Included here because the entire feature is a verification initiative.

### Tap Test Credentials (Test Environment Only)

| Scenario | Card Number | Notes |
|----------|-------------|-------|
| Success | `4111111111111111` | Any future expiry, any CVV |
| Decline | `4000000000000002` | Triggers failed payment flow |
| 3D Secure | `5123450000000008` | Triggers 3DS challenge |

> **Security note**: The test API key MUST be stored in environment variables only — never committed to source code.

### Recommended Testing Approach

**Layer 1 — End-to-End Browser Tests (Playwright)**

Full user journey from cart to post-payment dashboard views:
1. Log in as a test student
2. Add a course to cart → visit `/checkout` → assert items, totals, auto-filled fields
3. Submit form → assert redirect to Tap hosted page
4. Fill test card → assert redirect to `/payment/success?tap_id=...`
5. Assert success page shows `tap_id` and cart is empty
6. Navigate to `?view=payments` → assert real order appears (not mock data)
7. Navigate to `?view=my-content` → assert purchased course appears
8. Repeat steps 3–5 with decline card → assert cart survives → retry works

**Layer 2 — API Endpoint Tests via Swagger UI**

Contract test of each endpoint:
1. Authorize with admin JWT → test `GET /order/`, `GET /order/{id}`
2. Authorize with student JWT → test `GET /my-content/` (only own purchases)
3. Test `POST /create-charge/` with valid, missing-field, and invalid-ID payloads
4. Clear token → retry all endpoints → verify 401/403 returned

**Layer 3 — Webhook Lifecycle Verification**

1. Create a test charge → note `tap_id` → verify order `status = "pending"`
2. Complete payment → poll `GET /order/{id}` → verify `status = "paid"` within 10s
3. If status never updates, webhook handler is broken

### Critical Gap: Webhook Endpoint Not in Swagger

The Swagger docs expose **no webhook endpoint**. Tap sends a server-to-server POST to update order status. This MUST be verified to exist on the backend and to correctly handle Tap's signature verification.

---

## Assumptions

1. The backend is configured with the Tap test secret key in its test environment — stored as an environment variable, not in source code.
2. Tap's test environment redirects to the configured success/failed URLs set during charge creation.
3. Order status transitions (`pending` → `paid` / `failed`) are driven by a Tap webhook, not by the frontend redirect alone.
4. `GET /order/` scopes results to the current user when called by a non-admin; admin users see all orders.
5. `GET /my-content/` returns only content records associated with the current user's paid orders.
6. Course enrollment after payment is handled server-side when an order transitions to `paid`.
7. The `courses` array in the charge request maps to valid course/content IDs in the backend database.
8. No dedicated webhook endpoint was found in Swagger — assumed intentionally undocumented but must be verified to exist and function correctly.
