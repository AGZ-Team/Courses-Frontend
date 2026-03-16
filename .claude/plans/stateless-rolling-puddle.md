# Plan: Tap Payment Integration & Dashboard Fixes

## Context

The CRAI platform (Next.js 16 / React 19 / TypeScript / Tailwind CSS 4) has a shopping cart, checkout, and payment system using Tap Payment Gateway. The last commit (`95be98e`) added the initial payment + cart code, but the flow has critical bugs:

1. **Cart-to-Checkout is broken**: CartDrawer links to `/checkout` but checkout reads course IDs from URL params `?courses=` which are never passed. Cart store is never read.
2. **Success page is static**: Doesn't parse Tap redirect params (`tap_id`), doesn't clear the cart, doesn't show order info.
3. **Lesson/Content management error**: Backend returns "You must be a verified influencer" but the frontend doesn't handle this clearly.
4. **Tap Payment UI components**: User wants Tap's frontend SDK, but since the backend already returns a hosted checkout URL, we'll keep the redirect flow (simpler, no PCI concerns) and focus on making the checkout page show cart items properly.

---

## Task 1: Rewrite Checkout Page to Use Cart Store

**File**: [checkout/page.tsx](src/app/[locale]/checkout/page.tsx)

Changes:
- Import `useCartStore` to read cart items (primary source), keep URL params as fallback
- Import `useAuthStore` to auto-fill name/email from logged-in user
- Add `mounted` state for Zustand hydration (cart is empty on SSR)
- **Display full cart items** with image, title, author, price in the "Order Summary" section
- Show subtotal/total using `totalPrice()` from cart store
- Show empty cart state with link to courses if no items
- Auto-fill first_name, last_name, email from `user` object
- Update `handleSubmit` to use `items.map(i => i.id)` for the `courses` array
- Add inline remove button per cart item

New i18n keys in `payment` namespace:
- `orderSummary`, `emptyCart`, `emptyCartDescription`, `removeItem`, `chargeId`

**Existing reusable code**: `useCartStore` from [cartStore.ts](src/stores/cartStore.ts), `useAuthStore` from [stores/authStore.ts](src/stores/authStore.ts), `createCharge` from [paymentService.ts](src/services/paymentService.ts)

---

## Task 2: Enhance Success Page with Tap Redirect Handling

**File**: [payment/success/page.tsx](src/app/[locale]/payment/success/page.tsx)

Changes:
- Import `useSearchParams` to parse `tap_id` from Tap's redirect URL
- Import `useCartStore` and clear cart on mount via `useEffect`
- Display the `tap_id` as "Transaction ID" in the confirmation card
- Add `useState` for mounted check

---

## Task 3: Enhance Failed Page

**File**: [payment/failed/page.tsx](src/app/[locale]/payment/failed/page.tsx)

Changes:
- Parse `tap_id` from URL params and show it as reference for support
- "Try Again" link already goes to `/checkout` which is correct (cart items persist in localStorage since we only clear on success)

---

## Task 4: Improve Lesson/Content Panel Error Handling

**Files**:
- [LessonPanel.tsx](src/components/Dashboard/Panels/LessonPanel.tsx)
- [ContentPanel.tsx](src/components/Dashboard/Panels/ContentPanel.tsx)

Changes in both:
- In the `catch` block of `handleSaveLesson` / `handleSaveContent`, detect "verified influencer" error and show a user-friendly message explaining they need verification
- Add a warning banner at the top of the panel when user is not instructor/superuser, explaining they need to be verified to create content

---

## Task 5: Add i18n Keys

**Files**: [messages/en.json](messages/en.json), [messages/ar.json](messages/ar.json)

Add under `"payment"`:
```
"orderSummary": "Order Summary"
"emptyCart": "Your cart is empty"
"emptyCartDescription": "Add courses to your cart before checking out."
"removeItem": "Remove"
"chargeId": "Transaction ID"
```

---

## Implementation Order

1. Task 5 (i18n keys) - prerequisite for other tasks
2. Task 1 (Checkout page rewrite) - critical fix
3. Task 2 (Success page) - completes the flow
4. Task 3 (Failed page) - minor enhancement
5. Task 4 (Lesson/Content error handling) - independent fix

## Verification

1. Add items to cart via course cards → open CartDrawer → click "Proceed to Checkout"
2. Verify checkout page shows cart items with images, prices, total
3. Verify user info auto-fills from auth store
4. Submit payment → verify redirect to Tap checkout URL
5. After Tap redirects to success page → verify cart is cleared and tap_id is shown
6. Go to Dashboard → Lesson Management → try to create a lesson as non-verified user → verify friendly error message
7. Go to Dashboard → Content Management → same verification


Changes Made
1. Checkout Page Rewrite (checkout/page.tsx)
Fixed the critical bug: Now reads cart items from useCartStore (primary) instead of only URL params
Displays full cart items with images, titles, authors, prices, and remove buttons
Shows subtotal/total calculated from cart store
Auto-fills first name, last name, email from useAuthStore (logged-in user)
Handles Zustand hydration (cart is empty on SSR until localStorage loads)
Shows empty cart state with link to browse courses
Falls back to ?courses= URL params for direct links
Pay button shows the total amount
2. Success Page (payment/success/page.tsx)
Parses tap_id from Tap's redirect URL and displays it as "Transaction ID"
Clears the cart on mount after successful payment
3. Failed Page (payment/failed/page.tsx)
Parses tap_id from Tap's redirect URL and displays it as "Reference ID" for support
4. Lesson/Content Panel Error Handling
LessonPanel.tsx: Detects "verified influencer" backend error and shows a friendly message. Added amber warning banner for non-verified users.
ContentPanel.tsx: Same improvements.
5. i18n Keys
Added orderSummary, emptyCart, emptyCartDescription, removeItem, chargeId, referenceId to both en.json and ar.json
Payment Flow (End-to-End)
User browses courses → adds to cart (Zustand store with localStorage)
Opens CartDrawer → clicks "Proceed to Checkout" → navigates to /checkout
Checkout page shows cart items with prices, auto-fills user info
User selects payment method (card/mada/apple/samsung) → clicks "Pay Now"
Frontend calls POST /api/payment/create-charge → backend creates Tap charge → returns hosted checkout URL
User is redirected to checkout.tap.company (Tap handles card input, 3DS, etc.)
After payment, Tap redirects to /payment/success?tap_id=chg_xxx or /payment/failed?tap_id=chg_xxx
Success page clears the cart and shows the transaction ID

The most important thing to understand: never do this work inside the HTTP request that serves the success page. All those parallel jobs (email, inventory, analytics, fulfillment) should be queued as background jobs. The user's browser gets the order ID fast, and the heavy work happens asynchronously. Also notice the idempotency check — if the webhook fires twice (gateways often retry), you don't want to charge the customer twice or send two emails.