# Quickstart: Tap Payment Verification & QA

**Feature**: `001-tap-payment-verification`

---

## Prerequisites

1. Node 20 LTS, pnpm installed
2. Backend running at `https://api.cr-ai.cloud` (or local)
3. Test user accounts created (student, admin, instructor)
4. Tap test API key configured in backend env: `sk_test_YOUR_TAP_TEST_KEY_HERE`

## Setup

```bash
git checkout 001-tap-payment-verification
pnpm install
pnpm dev
```

## Quick Verification Steps

### 1. New proxy route works
```bash
# After implementing src/app/api/my-content/route.ts:
# Log in as a student in the browser, then:
curl -b cookies.txt http://localhost:3000/api/my-content
# Should return [] or Content[] (not 404)
```

### 2. PaymentHistoryPanel shows real data
1. Log in as a student who has completed a payment
2. Navigate to `http://localhost:3000/en/dashboard?view=payments`
3. Verify: Real order IDs from database (NOT "INV-2025-xxx")
4. Verify: Amount in SAR, real payment method, real status

### 3. MyContentPanel uses correct endpoint
1. Log in as a student
2. Navigate to `http://localhost:3000/en/dashboard?view=my-content`
3. Open browser Network tab → filter "my-content"
4. Verify: Request goes to `/api/my-content` (NOT `/api/admin/content`)
5. Verify: Only purchased courses shown

### 4. End-to-end payment
1. Add a course to cart → go to `/checkout`
2. Fill form → Pay Now → use card `4111 1111 1111 1111`
3. Verify redirect to Tap → complete → verify success page shows `tap_id`
4. Verify cart is empty
5. Check `?view=payments` → new order appears
6. Check `?view=my-content` → purchased course appears

## Files Changed (expected)

| File | Change |
|------|--------|
| `src/app/api/my-content/route.ts` | **NEW** — proxy route |
| `src/services/contentService.ts` | Add `fetchMyContent()` |
| `src/components/Dashboard/Panels/MyContentPanel.tsx` | Branch by role: students use `fetchMyContent()` |
| `src/components/Dashboard/Panels/PaymentHistoryPanel.tsx` | Replace hardcoded data with real `fetchOrders()` |
| `src/components/Dashboard/Panels/OrdersPanel.tsx` | Migrate from `useEffect` to React Query, add i18n |
| `messages/en.json` | Add missing i18n keys for Orders/Payment panels |
| `messages/ar.json` | Add missing i18n keys for Orders/Payment panels |
