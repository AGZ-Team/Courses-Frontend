# Payment Manual Test Checklist

**Feature**: Tap Payment Gateway
**Date**: 2026-03-21
**Frontend**: `http://localhost:3000`
**Backend**: `https://api.cr-ai.cloud`
**Swagger**: `https://api.cr-ai.cloud/api/docs/`

---

## Before You Start

```bash
git checkout 001-tap-payment-verification
pnpm install
pnpm dev
```

### Test Cards

| Card | Number | Result |
|------|--------|--------|
| Success | `4111 1111 1111 1111` | Redirects to `/payment/success` |
| Decline | `4000 0000 0000 0002` | Redirects to `/payment/failed` |
| 3D Secure | `5123 4500 0000 0008` | Shows 3DS challenge, then succeeds |

> Expiry: any future date. CVV: any 3 digits.

### Test Accounts

| Role | Username | Password | What They See |
|------|----------|----------|---------------|
| Admin/Superuser | `admin` | `123456` | All orders, all content, full sidebar |
| Student | *(create one)* | — | Only purchased content, own orders only |
| Instructor | *(create one)* | — | Own created content, no admin panels |

---

## Test 1: Checkout Happy Path (Success Card)

> **Goal**: Complete a purchase and verify everything updates.

| Step | Action | Expected | Pass? |
|------|--------|----------|-------|
| 1.1 | Log in as a student account | Dashboard loads | |
| 1.2 | Go to `/en/courses`, click **Add to Cart** on any course | Cart badge shows "1" in header | |
| 1.3 | Click the Cart icon in header | Cart drawer opens, shows course with title, price, remove button | |
| 1.4 | Click **Proceed to Checkout** | Navigates to `/en/checkout` | |
| 1.5 | Verify personal info auto-fills | First name, last name, email filled from profile | |
| 1.6 | Verify **Order Summary** section | Course title, price, subtotal, total all correct | |
| 1.7 | Verify **Credit Card** is selected by default | Blue border + checkmark on Card option | |
| 1.8 | Click **Pay Now** | Loading spinner appears, then redirect to `checkout.tap.company` | |
| 1.9 | On Tap page: enter `4111 1111 1111 1111`, future expiry, any CVV | Payment processes | |
| 1.10 | Tap redirects back | URL: `/en/payment/success?tap_id=chg_xxxxx` | |
| 1.11 | Verify success page | Green checkmark, "Payment Successful!" heading | |
| 1.12 | Verify Transaction ID | Shows "Transaction ID: chg_xxxxx" (from URL param) | |
| 1.13 | Verify links | "Go to My Courses" and "Back to Home" buttons work | |
| 1.14 | Go to `/en/checkout` | Shows "Your cart is empty" (cart was cleared on success) | |
| 1.15 | Go to `/en/dashboard?view=payments` | New order appears with `paid` status and correct amount | |
| 1.16 | Click **View invoice** on the new order | Modal shows Order ID, amount, method, Tap Charge ID, status | |
| 1.17 | Go to `/en/dashboard?view=my-content` | Purchased course now appears in the list | |

**Result**: ______ / 17 steps passed

---

## Test 2: Checkout Failed Path (Decline Card)

> **Goal**: Verify failed payments preserve the cart and show the reference ID.

| Step | Action | Expected | Pass? |
|------|--------|----------|-------|
| 2.1 | Add a course to cart, go to `/en/checkout` | Cart items visible, Pay Now enabled | |
| 2.2 | Fill form, click **Pay Now** | Redirects to Tap | |
| 2.3 | Enter decline card `4000 0000 0000 0002`, any expiry/CVV | Payment declined | |
| 2.4 | Tap redirects back | URL: `/en/payment/failed?tap_id=chg_yyyyy` | |
| 2.5 | Verify failed page | Red alert icon, "Payment Failed" heading | |
| 2.6 | Verify Reference ID | Shows "Reference ID: chg_yyyyy" | |
| 2.7 | Verify buttons | "Try Again" + "Back to Home" + "Contact Support" | |
| 2.8 | Click **Try Again** | Navigates to `/en/checkout` | |
| 2.9 | Verify cart items still present | Same course(s) in order summary, NOT cleared | |

**Result**: ______ / 9 steps passed

---

## Test 3: Payment Method Selection

> **Goal**: Verify all 4 payment methods can be selected.

| Step | Action | Expected | Pass? |
|------|--------|----------|-------|
| 3.1 | On `/en/checkout` with items in cart | Credit Card selected by default | |
| 3.2 | Click **Mada** | Mada highlighted, Card deselected | |
| 3.3 | Click **Apple Pay** | Apple Pay highlighted | |
| 3.4 | Click **Samsung Pay** | Samsung Pay highlighted | |
| 3.5 | Click **Credit Card** | Card highlighted again | |
| 3.6 | Open browser Network tab, click **Pay Now** | Request body shows `"method": "card"` | |

**Result**: ______ / 6 steps passed

---

## Test 4: Empty Cart & Edge Cases

| Step | Action | Expected | Pass? |
|------|--------|----------|-------|
| 4.1 | Go directly to `/en/checkout` with empty cart | "Your cart is empty" message + shopping bag icon | |
| 4.2 | Verify no Pay Now button visible | Button is absent or disabled | |
| 4.3 | Verify "Browse Courses" link | Links to `/en/courses` | |
| 4.4 | Go to `/en/payment/success` (no `?tap_id=`) | Page loads, no "Transaction ID" row, no JS error | |
| 4.5 | Go to `/en/payment/failed` (no `?tap_id=`) | Page loads, no "Reference ID" row, no JS error | |
| 4.6 | Log out, go to `/en/checkout` | No auto-filled fields, or redirected to login | |

**Result**: ______ / 6 steps passed

---

## Test 5: Admin Orders Panel

> **Goal**: Verify admin can see ALL users' orders.

| Step | Action | Expected | Pass? |
|------|--------|----------|-------|
| 5.1 | Log in as `admin` | Dashboard loads with full sidebar | |
| 5.2 | Verify sidebar has: Users, Categories, Subcategories, Orders, Content Mgmt, Lesson Mgmt, My Content | All 7 items visible under Management Hub | |
| 5.3 | Click **Orders** | Orders panel loads | |
| 5.4 | Verify table headers | Order ID, User, Amount, Method, Status, Date, Actions | |
| 5.5 | Verify status summary badges | Shows counts for Paid / Pending / Failed | |
| 5.6 | Verify real data shown | Real order IDs from DB (not mock data) | |
| 5.7 | Click **View** on any order | Detail view opens with: Order ID, User ID, Amount (SAR), Method, Date, Tap Charge ID | |
| 5.8 | Verify status badge color | Paid = green, Pending = amber, Failed = red | |
| 5.9 | Click **Back to Orders** | Returns to order list | |

**Result**: ______ / 9 steps passed

---

## Test 6: Student Payment History

> **Goal**: Verify student sees only their own payment history with real data.

| Step | Action | Expected | Pass? |
|------|--------|----------|-------|
| 6.1 | Log in as a student who has made a payment | Dashboard loads | |
| 6.2 | Click **Payment History** in sidebar | Payment History panel loads | |
| 6.3 | Verify table columns | Date, Order ID, Amount, Method, Status, Actions | |
| 6.4 | Verify real data | No "INV-2025-xxx" mock IDs; real order IDs from database | |
| 6.5 | Verify amounts in SAR | e.g., "SAR 100.00" | |
| 6.6 | Click **View invoice** on an order | Invoice modal opens | |
| 6.7 | Verify modal fields | Order ID, Amount, Method, Status, Date, Tap Charge ID | |
| 6.8 | Click **Close** on modal | Modal closes | |
| 6.9 | Verify student only sees own orders | No orders from other users (compare with admin view) | |

**Result**: ______ / 9 steps passed

---

## Test 7: Student My Content (Purchased Only)

> **Goal**: Students see only courses they purchased, not all content.

| Step | Action | Expected | Pass? |
|------|--------|----------|-------|
| 7.1 | Log in as a student with at least 1 purchase | Dashboard loads | |
| 7.2 | Click **My Content** in sidebar | Panel loads | |
| 7.3 | Verify heading | "Available Content" (not "All Content") | |
| 7.4 | Open browser Network tab, filter by `my-content` | Request goes to `/api/my-content` (NOT `/api/admin/content`) | |
| 7.5 | Verify only purchased courses shown | No unpurchased courses visible | |
| 7.6 | Click expand chevron on a course | Lessons accordion expands | |
| 7.7 | Log in as student with NO purchases | Panel loads | |
| 7.8 | Verify empty state | Friendly message shown, not an error | |

**Result**: ______ / 8 steps passed

---

## Test 8: Superuser My Content (All Content)

> **Goal**: Superuser sees all content in the system.

| Step | Action | Expected | Pass? |
|------|--------|----------|-------|
| 8.1 | Log in as `admin` | Dashboard loads | |
| 8.2 | Click **My Content** | Panel loads | |
| 8.3 | Verify heading | "All Content" (not "Available Content") | |
| 8.4 | Open Network tab | Request goes to `/api/admin/content` (NOT `/api/my-content`) | |
| 8.5 | Verify all content visible | All courses in the system shown | |

**Result**: ______ / 5 steps passed

---

## Test 9: Arabic / RTL Locale

> **Goal**: Verify all modified panels work in Arabic with RTL layout.

| Step | Action | Expected | Pass? |
|------|--------|----------|-------|
| 9.1 | Switch to Arabic via language switcher (or go to `/ar/dashboard`) | Page switches to Arabic, RTL layout | |
| 9.2 | Verify sidebar labels in Arabic | المستخدمون, الفئات, الفئات الفرعية, الطلبات, إدارة المحتوى, إدارة الدروس, محتواي, سجل المدفوعات | |
| 9.3 | Go to `?view=orders` | Column headers in Arabic: رقم الطلب, المستخدم, المبلغ, الطريقة, الحالة, التاريخ, الإجراءات | |
| 9.4 | Verify status labels | مدفوع / قيد الانتظار / فشل | |
| 9.5 | Go to `?view=payments` | Payment history fully translated | |
| 9.6 | Go to `?view=my-content` | My Content panel fully translated | |
| 9.7 | Go to `/ar/payment/success?tap_id=test123` | "تم الدفع بنجاح!" + "رقم المعاملة: test123" | |
| 9.8 | Go to `/ar/payment/failed?tap_id=test456` | "فشل الدفع" + "رقم المرجع: test456" | |
| 9.9 | Go to `/ar/checkout` with items in cart | Checkout page fully translated, RTL layout | |
| 9.10 | Complete full checkout flow in Arabic | Same behavior as English | |

**Result**: ______ / 10 steps passed

---

## Test 10: API Endpoints (via Swagger or curl)

> **Goal**: Verify all endpoints enforce auth and return correct data.

### Setup: Get a JWT token
```bash
# Via Swagger: POST /auth/jwt/create/ with credentials
# Or via curl:
curl -X POST https://api.cr-ai.cloud/api/auth/jwt/create/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'
# Copy the "access" token
```

| Step | Action | Expected | Pass? |
|------|--------|----------|-------|
| 10.1 | `POST /create-charge/` with valid JWT + valid body | 200, returns `{"url": "https://checkout.tap.company/..."}` | |
| 10.2 | `POST /create-charge/` without JWT | 401 or 403 | |
| 10.3 | `POST /create-charge/` with empty `courses: []` | 400 | |
| 10.4 | `POST /create-charge/` with invalid course ID `[99999]` | 400 or 404 | |
| 10.5 | `GET /order/` with admin JWT | 200, array of ALL orders | |
| 10.6 | `GET /order/` with student JWT | 200, array of only THIS student's orders | |
| 10.7 | `GET /order/` without JWT | 401 or 403 | |
| 10.8 | `GET /order/1` with JWT | 200, single order with all fields | |
| 10.9 | `GET /order/99999` with JWT | 404 | |
| 10.10 | `GET /my-content/` with student JWT | 200, only purchased content | |
| 10.11 | `GET /my-content/` without JWT | 401 or 403 | |

**Result**: ______ / 11 steps passed

---

## Test 11: Webhook Lifecycle

> **Goal**: Verify order status transitions after payment.

| Step | Action | Expected | Pass? |
|------|--------|----------|-------|
| 11.1 | Create a charge via `POST /create-charge/` | Returns checkout URL | |
| 11.2 | Immediately check `GET /order/` | New order exists with `status: "pending"` | |
| 11.3 | Complete payment with success card on Tap page | Payment confirmed | |
| 11.4 | Wait 10s, then `GET /order/{id}` | `status` changed to `"paid"`, `tap_charge_id` is non-null | |
| 11.5 | If status still "pending" after 30s | FAIL — webhook handler is broken | |
| 11.6 | Create another charge, use decline card | — | |
| 11.7 | Wait 10s, then `GET /order/{id}` | `status` changed to `"failed"` | |

**Result**: ______ / 7 steps passed

---

## Scoring

| Test | Steps | Passed | Status |
|------|-------|--------|--------|
| 1. Happy Path Checkout | 17 | | |
| 2. Failed Payment | 9 | | |
| 3. Payment Methods | 6 | | |
| 4. Empty Cart / Edge Cases | 6 | | |
| 5. Admin Orders | 9 | | |
| 6. Student Payment History | 9 | | |
| 7. Student My Content | 8 | | |
| 8. Superuser My Content | 5 | | |
| 9. Arabic / RTL | 10 | | |
| 10. API Endpoints | 11 | | |
| 11. Webhook Lifecycle | 7 | | |
| **Total** | **97** | | |

---

## Already Verified by Automation

These were tested via Playwright MCP on 2026-03-21 and passed:

- All page rendering (success, failed, checkout, dashboard panels)
- Arabic RTL for success, failed, orders panel (full translations verified)
- Sidebar i18n (EN + AR)
- Role resolution (superuser + instructor confirmed)
- API auth enforcement (unauthenticated → `[]` or auth error)
- My Content superuser view (All Content heading, real data, price display)
- Orders panel (3 real orders, detail view, status badges)
- Payment History (real data, invoice modal)
- Empty cart checkout state

See `test-results.md` for detailed automated test results.

## Known Issue

**`POST /create-charge/` returns 500 from Django backend** — this blocks Tests 1, 2, 11. The frontend is working correctly (form, request, error toast). Check Django logs for the root cause. Possible causes:
- Tap API key expired/misconfigured
- Course not available for purchase
- Backend webhook URL misconfigured
