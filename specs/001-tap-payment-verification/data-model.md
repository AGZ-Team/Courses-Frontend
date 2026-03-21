# Data Model: Tap Payment Verification & QA

**Feature**: `001-tap-payment-verification`
**Date**: 2026-03-21

---

## Entities

### Order (existing — no changes needed)

| Field | Type | Constraints | Source |
|-------|------|-------------|--------|
| id | integer | read-only, primary key | Backend |
| amount | number | double precision, required | Backend |
| tap_charge_id | string \| null | maxLength: 255 | Tap webhook |
| status | enum | `"pending"` \| `"paid"` \| `"failed"`, required | Backend |
| created_at | string | ISO 8601 datetime, read-only | Backend |
| method | string | maxLength: 20, required | Frontend (user-selected) |
| user | integer | foreign key → User, required | Backend (JWT) |

**State transitions**:
```
[charge created] → pending
pending → paid     (via Tap webhook: successful payment)
pending → failed   (via Tap webhook: declined payment)
```

**TypeScript interface**: `src/types/payment.ts` → `Order` (already correct)

---

### Content (existing — no changes to type)

| Field | Type | Constraints | Source |
|-------|------|-------------|--------|
| id | integer | read-only, primary key | Backend |
| name | string | maxLength: 255, required | Backend |
| description | string | required | Backend |
| price | number | decimal (6.2), required | Backend |
| is_published | boolean | default: false | Backend |
| subcategory | integer | foreign key → Subcategory, required | Backend |
| creator | integer | foreign key → User, required | Backend |
| creator_name | string \| undefined | optional, display-only | Backend (annotated) |

**Two access patterns**:
- `GET /content/` — returns all content (admin/instructor use)
- `GET /my-content/` — returns only content purchased by the JWT user (student use)

**TypeScript interface**: `src/types/content.ts` → `Content` (already correct)

---

### Charge Request (existing — no changes)

| Field | Type | Constraints |
|-------|------|-------------|
| first_name | string | required, trimmed |
| last_name | string | required, trimmed |
| email | string | required, valid email |
| method | PaymentMethod | `"card"` \| `"mada"` \| `"apple"` \| `"samsung"` |
| courses | number[] | required, at least one valid course ID |

**TypeScript interface**: `src/types/payment.ts` → `CreateChargeRequest` (already correct)

---

### Charge Response (existing — no changes)

| Field | Type | Constraints |
|-------|------|-------------|
| url | string | Tap-hosted checkout URL |

**TypeScript interface**: `src/types/payment.ts` → `CreateChargeResponse` (already correct)

---

### Cart Item (existing — no changes)

| Field | Type | Constraints |
|-------|------|-------------|
| id | number | course/content ID |
| title | string | display name |
| image | string | image URL |
| price | number | display price |
| author | string | creator name |

**TypeScript interface**: `src/types/payment.ts` → `CartItem` (already correct)

**Store**: `src/stores/cartStore.ts` — persisted to localStorage via Zustand `persist` middleware.

---

## New Service Functions Required

### `fetchMyContent(): Promise<Content[]>`

New function in `src/services/contentService.ts` that calls `GET /api/my-content/` with `credentials: 'include'`.

Returns the `Content[]` type from `src/types/content.ts` — same shape as `fetchContent()`.

---

## Relationships

```
User ─┬─ has many → Order (user field)
      └─ has many → Content (creator field, via purchases via my-content)

Order ─── references → User (user field)
      ─── references → Content[] (courses in charge request, not stored on Order directly)

Content ── has many → Lesson (content field on Lesson)
        ── belongs to → Subcategory (subcategory field)
        ── belongs to → User as creator (creator field)
```

---

## No New Entities

All entities already exist in the codebase with correct TypeScript interfaces. The work is:
1. **Wiring**: Connect `GET /my-content/` to the frontend via a new proxy route and service function
2. **Replacing**: Swap hardcoded data in `PaymentHistoryPanel` with real `Order[]` from `fetchOrders()`
3. **Branching**: Make `MyContentPanel` use `fetchMyContent()` for students vs `fetchContent()` for instructors/superusers
