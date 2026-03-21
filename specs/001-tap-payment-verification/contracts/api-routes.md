# API Route Contracts

**Feature**: `001-tap-payment-verification`

---

## New Route: GET /api/my-content/

**Next.js file**: `src/app/api/my-content/route.ts`
**Backend target**: `GET /my-content/`
**Auth**: Required (JWT via HttpOnly cookie)

### Request
No body. JWT auth extracted from cookies by `apiGetWithCookies`.

### Response — 200 OK
```json
[
  {
    "id": 1,
    "name": "Advanced React & TypeScript",
    "description": "Deep dive into React...",
    "price": "79.00",
    "is_published": true,
    "subcategory": 3,
    "creator": 5
  }
]
```
TypeScript type: `Content[]` from `src/types/content.ts`

### Response — 401 Unauthorized
```json
{ "detail": "Authentication credentials were not provided." }
```

### Error handling
Return `[]` for 404/401/403 (same pattern as `/api/payment/orders/route.ts`).

---

## Existing Route: POST /api/payment/create-charge/

**Status**: Already implemented and working.
**Next.js file**: `src/app/api/payment/create-charge/route.ts`
**Backend target**: `POST /create-charge/`

### Request
```json
{
  "first_name": "Test",
  "last_name": "User",
  "email": "test@test.com",
  "method": "card",
  "courses": [1, 2]
}
```

### Response — 200 OK
```json
{
  "url": "https://checkout.tap.company/..."
}
```

### Response — 400 Bad Request
```json
{
  "error": "Missing required field: courses"
}
```

---

## Existing Route: GET /api/payment/orders/

**Status**: Already implemented.
**Next.js file**: `src/app/api/payment/orders/route.ts`
**Backend target**: `GET /order/`
**Note**: Backend scopes to current user for non-admin; returns all orders for admin.

### Response — 200 OK
```json
[
  {
    "id": 1,
    "amount": 79.00,
    "tap_charge_id": "chg_TS01A1234567890",
    "status": "paid",
    "created_at": "2026-03-21T14:30:00Z",
    "method": "card",
    "user": 5
  }
]
```

---

## Existing Route: GET /api/payment/orders/[id]/

**Status**: Already implemented.
**Next.js file**: `src/app/api/payment/orders/[id]/route.ts`
**Backend target**: `GET /order/{id}`

### Response — 200 OK
Single `Order` object (same shape as above, not wrapped in array).

### Response — 404 Not Found
```json
{ "error": "Not found." }
```

---

## Service Function Contract: fetchMyContent

**File**: `src/services/contentService.ts`

```typescript
export async function fetchMyContent(): Promise<Content[]> {
  const res = await fetch("/api/my-content", {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch my content");
  return res.json();
}
```

Follows same pattern as `fetchContent()` in the same file, but hits `/api/my-content` instead of `/api/admin/content`.
