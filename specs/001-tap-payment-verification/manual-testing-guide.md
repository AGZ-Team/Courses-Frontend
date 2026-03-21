# Manual Testing Guide — Tap Payment Gateway

**Feature**: `001-tap-payment-verification`
**Last updated**: 2026-03-21
**API base**: `https://api.cr-ai.cloud/api`
**Swagger UI**: `https://api.cr-ai.cloud/api/docs/`
**Frontend**: `http://localhost:3000` (or your deployed URL)

---

## Test Credentials

### Tap Payment — Test Cards

| Scenario | Card Number | Expiry | CVV | Expected Result |
|----------|-------------|--------|-----|-----------------|
| Successful payment | `4111 1111 1111 1111` | Any future date | Any 3 digits | Redirects to `/payment/success` |
| Declined card | `4000 0000 0000 0002` | Any future date | Any 3 digits | Redirects to `/payment/failed` |
| 3D Secure flow | `5123 4500 0000 0008` | Any future date | Any 3 digits | Shows 3DS challenge then succeeds |

> **Tap test API key**: `sk_test_YOUR_TAP_TEST_KEY_HERE`
> This key is for testing only. Never use it in production. Never commit it to source code.

### Test User Accounts

Create these manually in the backend before testing:

| Role | Email | Purpose |
|------|-------|---------|
| Student (no purchases) | `student1@test.com` | Test empty states |
| Student (with purchases) | `student2@test.com` | Test `my-content` and payment history |
| Admin / superuser | `admin@test.com` | Test admin orders panel |
| Instructor | `instructor@test.com` | Test instructor content view |

---

## Section 1 — Checkout Flow (End-to-End)

### TC-001: Happy path — successful payment

**Pre-conditions**: Logged in as a student. At least one course added to cart.

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Navigate to `/checkout` | Page loads, shows cart items with titles, images, author names, prices | |
| 2 | Verify "Order Summary" section | All cart items shown, subtotal and total match sum of individual prices | |
| 3 | Verify personal info fields | First name, last name, email pre-filled from user profile | |
| 4 | Select payment method: **Card** | Card method highlighted with blue border and checkmark | |
| 5 | Click "Pay Now" | Loading spinner appears, then redirect to `checkout.tap.company` | |
| 6 | On Tap page: enter card `4111 1111 1111 1111`, any future expiry, any CVV | Card accepted, payment processing shown | |
| 7 | Tap redirects to `/payment/success?tap_id=chg_xxx` | Success page loads with green checkmark animation | |
| 8 | Check success page shows transaction ID | "Transaction ID: chg_xxx" displayed in card | |
| 9 | Navigate to `/checkout` | Empty cart state shown — "Your cart is empty" message | |
| 10 | Navigate to `?view=payments` in dashboard | New order appears in list with correct amount and `paid` status | |
| 11 | Navigate to `?view=my-content` in dashboard | Purchased course(s) appear in the list | |

---

### TC-002: Declined payment — cart persists

**Pre-conditions**: Logged in as a student. At least one course in cart.

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Navigate to `/checkout`, verify cart items shown | Items visible | |
| 2 | Click "Pay Now" → redirected to Tap | Tap hosted page loads | |
| 3 | Enter card `4000 0000 0000 0002`, any expiry, any CVV | Payment declined | |
| 4 | Tap redirects to `/payment/failed?tap_id=chg_yyy` | Failed page loads with red alert icon | |
| 5 | Verify reference ID shown | "Reference ID: chg_yyy" visible in error card | |
| 6 | Verify "Try Again" button present | Button visible and clickable | |
| 7 | Click "Try Again" | Redirected to `/checkout` | |
| 8 | Verify cart items still present | Same courses still in order summary — cart NOT cleared | |

---

### TC-003: 3D Secure flow

**Pre-conditions**: Logged in as a student. At least one course in cart.

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Go through checkout, click "Pay Now" | Redirected to Tap | |
| 2 | Enter card `5123 4500 0000 0008` | 3DS challenge screen appears | |
| 3 | Complete the 3DS challenge (test environment usually auto-passes) | Redirected to success page | |
| 4 | Verify `tap_id` on success page | Transaction ID shown correctly | |

---

### TC-004: Empty cart state

**Pre-conditions**: Logged in. Cart is empty.

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Navigate directly to `/checkout` | Empty cart state shown (shopping bag icon + message) | |
| 2 | Verify "Pay Now" button is absent or disabled | No payment button accessible | |
| 3 | Verify "Browse Courses" link present | Link goes to `/courses` page | |

---

### TC-005: Unauthenticated checkout attempt

**Pre-conditions**: Not logged in.

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Navigate to `/checkout` | Either redirected to login OR page shows with no auto-filled fields | |
| 2 | If form is accessible, submit it | Frontend or API must return 401/403 — payment MUST NOT be created | |

---

### TC-006: Payment method selection

**Pre-conditions**: Logged in. At least one course in cart.

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | On `/checkout`, click **Mada** method | Mada highlighted, card method deselected | |
| 2 | Click **Apple Pay** | Apple Pay highlighted | |
| 3 | Click **Samsung Pay** | Samsung Pay highlighted | |
| 4 | Click **Card** again | Card highlighted | |
| 5 | Submit form with Card selected | Charge request includes `"method": "card"` (verify in browser network tab) | |

---

## Section 2 — API Endpoint Testing (via Swagger UI)

**Setup**: Open `https://api.cr-ai.cloud/api/docs/`

### Step 0: Authorize

1. Click the **Authorize** button (top right in Swagger UI)
2. Get a JWT: expand `POST /auth/jwt/create/`, click "Try it out", enter valid credentials, execute
3. Copy the `access` token from the response
4. In the Authorize dialog, paste `Bearer <your_token>` into the `jwtAuth` field
5. Click **Authorize** then **Close**

---

### TC-007: POST /create-charge/ — valid payload

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Expand `POST /create-charge/` in Swagger | Endpoint visible | |
| 2 | Click "Try it out" | Input fields enabled | |
| 3 | Enter valid body: `{"first_name": "Test", "last_name": "User", "email": "test@test.com", "method": "card", "courses": [1]}` | — | |
| 4 | Click Execute | Response: **200**, body contains `{"url": "https://checkout.tap.company/..."}` | |

---

### TC-008: POST /create-charge/ — missing fields

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Enter body with no `courses`: `{"first_name": "Test", "last_name": "User", "email": "test@test.com", "method": "card"}` | — | |
| 2 | Execute | Response: **400**, descriptive error message | |
| 3 | Enter body with empty courses array: `{"first_name": "Test", ..., "courses": []}` | — | |
| 4 | Execute | Response: **400** | |

---

### TC-009: POST /create-charge/ — invalid course IDs

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Enter body: `{"first_name": "Test", "last_name": "User", "email": "test@test.com", "method": "card", "courses": [99999]}` | — | |
| 2 | Execute | Response: **400** or **404**, not 200 | |

---

### TC-010: POST /create-charge/ — unauthenticated

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Click Authorize → Logout (clear token) | Token cleared | |
| 2 | Execute `POST /create-charge/` with valid body | Response: **401** or **403** | |
| 3 | Re-authorize for subsequent tests | — | |

---

### TC-011: GET /order/ — admin view

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Authorize with admin JWT | — | |
| 2 | Expand `GET /order/`, click "Try it out", Execute | Response: **200**, array of order objects | |
| 3 | Verify each order has: `id`, `amount`, `tap_charge_id`, `status`, `method`, `user`, `created_at` | All fields present | |
| 4 | Verify at least one order from the test payment in TC-001 is present | Order with correct `tap_id` found | |

---

### TC-012: GET /order/ — student view (scoped to own orders)

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Authorize with student JWT (not admin) | — | |
| 2 | Execute `GET /order/` | Response: **200**, array containing ONLY this student's orders | |
| 3 | Verify no orders belonging to other users appear | User IDs in response all match the current student's ID | |

---

### TC-013: GET /order/{id} — retrieve single order

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | From TC-011 results, note a real order `id` | — | |
| 2 | Expand `GET /order/{id}`, enter the ID, Execute | Response: **200**, single order object with all fields | |
| 3 | Verify `tap_charge_id` matches the `tap_id` from the test payment | IDs match | |
| 4 | Try a non-existent ID (e.g., 99999) | Response: **404** | |

---

### TC-014: GET /order/{id} — unauthenticated

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Clear authorization token | — | |
| 2 | Execute `GET /order/{id}` with a real ID | Response: **401** or **403** | |

---

### TC-015: GET /my-content/ — purchased content

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Authorize with a student JWT who has completed at least one payment | — | |
| 2 | Expand `GET /my-content/`, Execute | Response: **200**, array of content objects | |
| 3 | Verify returned content corresponds to courses paid for by this student | Only purchased courses in response | |
| 4 | Authorize with a student who has made no purchases, Execute | Response: **200**, empty array `[]` | |
| 5 | Clear token, Execute | Response: **401** or **403** | |

---

## Section 3 — Dashboard Panel Testing

### TC-016: My Content panel — student with purchases

**Pre-conditions**: Student has completed at least one successful test payment (TC-001).

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Navigate to `?view=my-content` in dashboard | Panel loads showing purchased courses | |
| 2 | Open browser Network tab, filter by `my-content` | Request to `GET /my-content/` (or `/api/my-content/`) visible | |
| 3 | Verify only purchased courses shown | No courses from other students; no unpurchased courses | |
| 4 | Click the expand chevron on a course | Lessons expand inline in accordion — no page navigation | |
| 5 | Click a lesson's eye icon | Lesson details sheet slides in from the right | |

---

### TC-017: My Content panel — student with no purchases

**Pre-conditions**: Student has NOT completed any payment.

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Navigate to `?view=my-content` | Panel loads, calls `GET /my-content/`, receives empty array | |
| 2 | Verify empty state UI shown | No courses displayed; friendly empty message shown (not an error) | |

---

### TC-018: My Content panel — instructor view

**Pre-conditions**: Logged in as an instructor.

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Navigate to `?view=my-content` | Panel loads | |
| 2 | Open Network tab | Request is to `GET /content/` (NOT `GET /my-content/`) | |
| 3 | Verify instructor sees their own created courses | Content filtered by `creator === user.id` | |

---

### TC-019: Payments panel — real data (no mocks)

**Pre-conditions**: Student has completed at least one test payment.

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Navigate to `?view=payments` | Panel loads | |
| 2 | Open browser Network tab | Request to `GET /order/` (or proxy route) visible | |
| 3 | Verify panel shows real orders | No hardcoded "INV-2025-xxx" IDs; real order IDs from database shown | |
| 4 | Verify each row shows: date, amount (SAR), method, status badge | All columns populated with real data | |
| 5 | Click "View" on an order | Detail modal opens with real Tap charge ID, not placeholder data | |
| 6 | Verify `tap_charge_id` in modal | Matches the `tap_id` from the original test payment redirect | |

---

### TC-020: Orders panel — admin

**Pre-conditions**: Logged in as admin/superuser.

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Navigate to `?view=orders` | Orders panel loads | |
| 2 | Verify ALL users' orders shown (not just current user's) | Multiple `user` IDs visible across rows | |
| 3 | Click "View" on any order | Detail view shows Order ID, User ID, Amount (SAR), Method, Date, Tap Charge ID | |
| 4 | Verify status badges: paid (green), pending (amber), failed (red) | Correct color coding | |

---

## Section 4 — Webhook & Order Status Verification

### TC-021: Order status lifecycle — success

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Complete a charge via `POST /create-charge/` (note the returned URL) | `url` returned | |
| 2 | Immediately call `GET /order/` (admin) | New order exists with `status: "pending"` | |
| 3 | Open the Tap checkout URL, complete payment with success card | Payment confirmed by Tap | |
| 4 | Wait up to 10 seconds, then call `GET /order/{id}` | `status` MUST be `"paid"` and `tap_charge_id` non-null | |
| 5 | If status is still `"pending"` after 30 seconds | **FAIL** — webhook handler is broken or not configured | |

---

### TC-022: Order status lifecycle — decline

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Create a charge, open URL, use decline card | Payment declined | |
| 2 | Wait up to 10 seconds, call `GET /order/{id}` | `status` MUST be `"failed"` | |

---

## Section 5 — Regression / Bilingual Check

### TC-023: Arabic locale checkout

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Switch locale to Arabic (`/ar/checkout`) | Page loads in Arabic, RTL layout applied | |
| 2 | Verify all text is translated | No English strings visible in the AR locale | |
| 3 | Complete full checkout flow | Works identically to EN flow | |
| 4 | Success/failed pages in Arabic | All messages translated | |

---

### TC-024: Success/Failed pages without tap_id param

| Step | Action | Expected Result | Pass/Fail |
|------|--------|-----------------|-----------|
| 1 | Navigate directly to `/payment/success` (no `?tap_id=`) | Page loads — no "Transaction ID" row shown | |
| 2 | Navigate directly to `/payment/failed` (no `?tap_id=`) | Page loads — no "Reference ID" row shown | |
| 3 | Verify no JavaScript error in console | Console is clean | |

---

## Test Results Summary

| Test Case | Description | Status | Notes |
|-----------|-------------|--------|-------|
| TC-001 | Happy path payment | | |
| TC-002 | Declined card + cart persists | | |
| TC-003 | 3D Secure flow | | |
| TC-004 | Empty cart state | | |
| TC-005 | Unauthenticated checkout | | |
| TC-006 | Payment method selection | | |
| TC-007 | POST /create-charge/ valid | | |
| TC-008 | POST /create-charge/ missing fields | | |
| TC-009 | POST /create-charge/ invalid IDs | | |
| TC-010 | POST /create-charge/ unauthenticated | | |
| TC-011 | GET /order/ admin view | | |
| TC-012 | GET /order/ student scoped | | |
| TC-013 | GET /order/{id} single record | | |
| TC-014 | GET /order/{id} unauthenticated | | |
| TC-015 | GET /my-content/ purchased content | | |
| TC-016 | My Content panel — with purchases | | |
| TC-017 | My Content panel — no purchases | | |
| TC-018 | My Content panel — instructor view | | |
| TC-019 | Payments panel — real data | | |
| TC-020 | Orders panel — admin | | |
| TC-021 | Webhook — success lifecycle | | |
| TC-022 | Webhook — decline lifecycle | | |
| TC-023 | Arabic locale checkout | | |
| TC-024 | Success/Failed pages — no tap_id | | |

---

## Common Failure Patterns & Fixes

| Symptom | Likely Cause | Where to Check |
|---------|-------------|----------------|
| Checkout shows empty cart even after adding courses | Zustand hydration not waited for | `mounted` state in `checkout/page.tsx` |
| `POST /create-charge/` returns 500 | Backend Tap API key misconfigured or missing | Backend env vars |
| Order status stays `pending` indefinitely | Webhook not hitting backend | Backend webhook handler + Tap dashboard webhook config |
| `GET /my-content/` returns 404 | Frontend proxy route not created | `src/app/api/my-content/route.ts` missing |
| `PaymentHistoryPanel` still shows mock data | Not connected to real API | `PaymentHistoryPanel.tsx` still using hardcoded `payments` array |
| `GET /order/` returns all users' orders for a student | Backend not scoping by user | Backend order list view permissions |
| Arabic layout breaks on checkout | Non-directional Tailwind classes used | Replace `ml-`/`mr-` with `ms-`/`me-` |
