# Cookie-Based Authentication Guide

## Overview

Your project now uses **HttpOnly secure cookies** to store JWT tokens instead of `localStorage`. This is a more secure pattern because:

- **XSS Protection**: Malicious JS cannot read HttpOnly cookies.
- **Server-side Control**: Tokens are only accessible on the server layer.
- **Automatic Sending**: Browser automatically includes cookies in requests.

---

## Architecture

### Three Layers

1. **API Layer** (`lib/api.ts` + `lib/apiWithCookies.ts`)
   - Low-level HTTP client
   - Handles base URL, headers, credentials

2. **Auth Service** (`services/authService.ts`)
   - Domain-specific auth functions (login, signup, logout, etc.)
   - Re-exports from `lib/auth.ts`

3. **Next API Routes** (`app/api/auth/*`)
   - Server-side endpoints that set/clear cookies
   - Bridge between client and Django backend

---

## How It Works

### Login Flow

```
Client Component (LoginForm)
  ↓
  calls: login(username, password)  [from authService]
  ↓
  calls: loginWithCookie()  [from lib/authCookie.ts]
  ↓
  POST /api/auth/cookie-login  [Next API route]
  ↓
  POST /auth/jwt/create/  [Django backend]
  ↓
  Django returns: { access, refresh, uid, token }
  ↓
  Next API route sets HttpOnly cookies:
    - access_token (7 days)
    - refresh_token (30 days)
    - username (7 days, not HttpOnly, for client-side display)
  ↓
  Client receives: { success: true, uid, token }  [for email verification]
```

### Authenticated Request Flow (Client → Django)

```
Client Component
  ↓
  calls: apiPost('/subscriptions/', data)  [from lib/api.ts]
  ↓
  fetch('/subscriptions/', {
    credentials: 'include'  ← Browser auto-includes cookies
  })
  ↓
  Django receives request with Authorization header
  (set by browser from HttpOnly cookie)
```

### Authenticated Request Flow (Server Action → Django)

```
Server Action
  ↓
  calls: apiPostWithCookies('/subscriptions/', data, true)  [from lib/apiWithCookies.ts]
  ↓
  Reads access_token from cookies()
  ↓
  Sets Authorization header: Bearer {token}
  ↓
  fetch('https://django-backend/subscriptions/', {
    headers: { Authorization: 'Bearer ...' }
  })
  ↓
  Django processes request
```

---

## When to Use What

### 1. Simple Authenticated GET (Client-side only)

**Example**: Fetch user's subscriptions in a client component.

```tsx
// src/services/subscriptionsService.ts
import { apiGet } from '@/lib/api';

export async function listSubscriptions() {
  return apiGet('/subscriptions/', true);  // requireAuth = true
}
```

```tsx
// src/components/SubscriptionsList.tsx
'use client';
import { listSubscriptions } from '@/services/subscriptionsService';

export function SubscriptionsList() {
  const [subs, setSubs] = useState([]);
  
  useEffect(() => {
    listSubscriptions().then(setSubs);
  }, []);
  
  return <div>{/* render subs */}</div>;
}
```

**Why**: Browser automatically includes HttpOnly cookies. No server action needed.

---

### 2. Authenticated POST/PUT/DELETE (Client-side only)

**Example**: User subscribes to a course.

```tsx
// src/services/subscriptionsService.ts
import { apiPost } from '@/lib/api';

export async function createSubscription(courseId: number) {
  return apiPost('/subscriptions/', { course_id: courseId }, true);
}
```

```tsx
// src/components/CourseCard.tsx
'use client';
import { createSubscription } from '@/services/subscriptionsService';

export function CourseCard({ courseId }) {
  const handleSubscribe = async () => {
    try {
      await createSubscription(courseId);
      // success
    } catch (err) {
      // error
    }
  };
  
  return <button onClick={handleSubscribe}>Subscribe</button>;
}
```

**Why**: Same as GET. Browser handles cookies automatically.

---

### 3. Authenticated Request with Server Logic (Server Action)

**Use when**: You need to:
- Combine multiple backend calls into one operation
- Access server-only env vars or secrets
- Validate/transform data on the server before sending to Django

**Example**: Create a subscription AND send a confirmation email (internal service).

```tsx
// app/[locale]/subscriptions/actions.ts
'use server';

import { apiPostWithCookies } from '@/lib/apiWithCookies';

export async function createSubscriptionWithEmailAction(courseId: number) {
  // 1. Create subscription on Django
  const subscription = await apiPostWithCookies(
    '/subscriptions/',
    { course_id: courseId },
    true  // requireAuth = true
  );
  
  // 2. Send confirmation email (internal service, uses secret key)
  const emailResult = await fetch('https://internal-email-service/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.INTERNAL_SERVICE_SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: subscription.user_email,
      template: 'subscription_confirmation',
    }),
  });
  
  return { subscription, emailSent: emailResult.ok };
}
```

```tsx
// src/components/CourseCard.tsx
'use client';
import { createSubscriptionWithEmailAction } from '@/app/[locale]/subscriptions/actions';

export function CourseCard({ courseId }) {
  const handleSubscribe = async () => {
    const result = await createSubscriptionWithEmailAction(courseId);
    // result.subscription, result.emailSent
  };
  
  return <button onClick={handleSubscribe}>Subscribe</button>;
}
```

**Why**: Server action can use `process.env.INTERNAL_SERVICE_SECRET` (not exposed to client).

---

### 4. Authenticated Request with Payment Processing (Server Action + API Route)

**Use when**: You need to process payments (Stripe, PayPal) securely.

```tsx
// app/api/subscriptions/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { apiPostWithCookies } from '@/lib/apiWithCookies';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { courseId } = await request.json();
    
    // 1. Create Stripe session (uses secret key)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Course Subscription' },
            unit_amount: 9999, // $99.99
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscriptions?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscriptions?canceled=true`,
    });
    
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
```

```tsx
// src/services/subscriptionsService.ts
export async function createCheckoutSession(courseId: number) {
  const response = await fetch('/api/subscriptions/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ courseId }),
    credentials: 'include',
  });
  
  return response.json();
}
```

**Why**: Stripe secret key must never touch the client. API route keeps it server-side.

---

## Decision Tree

```
Do you need to call Django API?
├─ YES
│  ├─ Can you do it entirely from client component?
│  │  ├─ YES → Use service + apiGet/apiPost/etc from lib/api.ts
│  │  └─ NO → Go to next question
│  │
│  ├─ Do you need server-only secrets or env vars?
│  │  ├─ YES → Use API route (/api/...) or server action
│  │  └─ NO → Use server action for cleaner code
│  │
│  └─ Is it a payment/Stripe flow?
│     ├─ YES → Use API route (more explicit, easier to debug)
│     └─ NO → Use server action (simpler)
│
└─ NO → Just use client-side logic
```

---

## File Structure Summary

```
src/
├── lib/
│   ├── api.ts                    ← Client-side HTTP client
│   ├── apiWithCookies.ts         ← Server-side HTTP client (reads cookies)
│   ├── auth.ts                   ← Auth functions (login, signup, etc.)
│   ├── authCookie.ts             ← Cookie-specific helpers
│   └── config.ts                 ← API_BASE_URL config
│
├── services/
│   └── authService.ts            ← Re-exports auth functions
│
├── app/
│   └── api/
│       └── auth/
│           ├── cookie-login/     ← Sets HttpOnly cookies
│           ├── cookie-logout/    ← Clears cookies
│           └── check/            ← Verifies token with Django
│
└── [locale]/
    └── subscriptions/
        └── actions.ts            ← Server actions for subscription flows
```

---

## Examples for Future Features

### Dashboard CRUD (Profile Update)

```tsx
// src/services/dashboardService.ts
import { apiPutWithCookies } from '@/lib/apiWithCookies';

export async function updateProfileAction(userId: number, data: any) {
  return apiPutWithCookies(`/users/${userId}/`, data, true);
}
```

```tsx
// app/[locale]/dashboard/actions.ts
'use server';
import { updateProfileAction } from '@/services/dashboardService';

export async function updateProfileServerAction(formData: FormData) {
  const displayName = formData.get('displayName') as string;
  return updateProfileAction(1, { display_name: displayName });
}
```

### Instructor Dashboard (Create Course)

```tsx
// src/services/coursesService.ts
import { apiPostWithCookies } from '@/lib/apiWithCookies';

export async function createCourseAction(data: any) {
  return apiPostWithCookies('/courses/', data, true);
}
```

```tsx
// app/[locale]/instructor/create-course/actions.ts
'use server';
import { createCourseAction } from '@/services/coursesService';

export async function createCourseServerAction(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  
  return createCourseAction({ title, description });
}
```

---

## Testing

### Test Login Flow

```bash
# 1. Go to /login
# 2. Enter credentials
# 3. Open DevTools → Application → Cookies
# 4. Verify: access_token, refresh_token, username cookies exist
# 5. Verify: access_token is HttpOnly (no JS access)
```

### Test Authenticated Request

```bash
# 1. Log in
# 2. Open DevTools → Network
# 3. Make an authenticated request (e.g., fetch subscriptions)
# 4. Verify: Request includes Authorization header
# 5. Verify: Cookie is sent automatically
```

### Test Server Action

```bash
# 1. Create a server action that calls apiPostWithCookies
# 2. Call it from a client component
# 3. Verify: Server action receives and uses the cookie
# 4. Verify: Django receives the request with Authorization header
```

---

## Troubleshooting

### "No access token found in cookies"

**Cause**: Server action tried to make authenticated request but user not logged in.

**Fix**: Check that user is authenticated before calling the action:

```tsx
const { isAuthenticated } = useAuth();

if (!isAuthenticated) {
  return <div>Please log in first</div>;
}
```

### Cookies not being sent in requests

**Cause**: Missing `credentials: 'include'` in fetch.

**Fix**: Already handled in `lib/api.ts` and `lib/apiWithCookies.ts`, but if you make manual fetch calls:

```tsx
fetch('/api/...', {
  credentials: 'include',  ← Required!
})
```

### "CORS error" or "cookie not sent"

**Cause**: Cookies only sent to same-origin requests.

**Fix**: Make sure you're calling Next API routes (`/api/...`), not Django directly from client.

---

## Next Steps

1. **Test the login flow** to ensure cookies are being set correctly.
2. **Create a `subscriptionsService.ts`** for your subscription features.
3. **Add server actions** in `app/[locale]/subscriptions/actions.ts` for complex flows.
4. **Use `apiPostWithCookies`** in server actions for authenticated requests.

---

## Summary

| Use Case | Where | How |
|----------|-------|-----|
| Simple GET/POST to Django | Client component | `apiGet/apiPost` from `lib/api.ts` |
| Complex flow with server logic | Server action | `apiPostWithCookies` from `lib/apiWithCookies.ts` |
| Payment processing | API route | `apiPostWithCookies` + Stripe secret key |
| Check if user logged in | Client component | `useAuth()` hook or `/api/auth/check` |
| Logout | Navbar/AuthContext | `clearTokens()` (now async) |

