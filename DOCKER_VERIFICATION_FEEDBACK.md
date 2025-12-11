# Docker Build & Email Verification Issues - Deep Analysis

## 1. DOCKERFILE BUILD ISSUES

### ⚠️ Critical Issues Found

#### Issue 1.1: Missing `package-lock.json` in build
**Problem:**
```dockerfile
COPY package.json package-lock.json ./
RUN npm ci
```
- The Dockerfile assumes `package-lock.json` exists
- If you only have `yarn.lock` or no lock file, this will **FAIL with build error**: `ENOENT: no such file or directory`
- This is a hard blocker for Docker builds

**Solution:**
```dockerfile
# Option A: If using npm
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

# Option B: If using yarn
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Option C: Universal (works if either exists)
COPY package.json ./
RUN [ -f yarn.lock ] && yarn install --frozen-lockfile || npm ci
```

---

#### Issue 1.2: Node.js 22 Alpine compatibility with Next.js 16
**Problem:**
```dockerfile
FROM node:22-alpine AS builder
```
- Node 22 is the latest and cutting-edge
- Next.js 16 was built/tested primarily on Node 18-20
- Alpine uses `musl` libc instead of `glibc`, causing:
  - Native module incompatibilities
  - Missing system libraries (e.g., build-essential, python3)
  - Build failures on packages with C dependencies

**Solution:**
```dockerfile
# Use Node 20 LTS instead (more stable)
FROM node:20-alpine AS builder

# Or use the full Debian image (more reliable for Next.js)
FROM node:20
```

---

#### Issue 1.3: Next.js Production Build requires specific files
**Problem:**
```dockerfile
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
```
- Missing required configuration files:
  - `tsconfig.json` (required if build runs TypeScript checks)
  - `messages/` (your i18n message files - **REQUIRED for next-intl**)
  - `eslint.config.mjs` (if referenced in build)

**Your project structure shows:**
```
messages/
  ar.json
  en.json
```
These are **CRITICAL** for your i18n setup and must be included in runtime image!

**Solution:**
```dockerfile
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/messages ./messages  # ADD THIS
COPY --from=builder /app/next.config.ts ./    # Be explicit about file type
```

---

#### Issue 1.4: Missing `.env` or environment variables
**Problem:**
```dockerfile
ENV NODE_ENV=production
ENV PORT=3000
```
- Your project uses environment variables in `next.config.ts` and API calls
- No mechanism to pass `API_BASE_URL` or other env vars at runtime
- The app will fail with missing config on startup

**Check your code:**
```typescript
// src/lib/config.ts
export const API_BASE_URL = 'https://api.cr-ai.cloud/';
```
This is hardcoded, but in Docker runtime, you might need dynamic config.

**Solution:**
```dockerfile
# During runtime, provide env file or document requirements
ENV NODE_ENV=production
ENV PORT=3000
# Add a .env.example COPY if needed
COPY --from=builder /app/.env.example .env.local 2>/dev/null || true
```

---

#### Issue 1.5: No healthcheck or proper signal handling
**Problem:**
```dockerfile
CMD ["npm", "start"]
```
- No graceful shutdown handling
- No health check for container orchestration (Docker Compose, K8s)
- Container won't properly stop (can cause issues with docker-compose)

**Solution:**
```dockerfile
# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Handle signals properly
CMD ["node", "--enable-source-maps", "node_modules/.bin/next", "start"]
```

---

### Improved Dockerfile

```dockerfile
# Multi-stage Docker build for Next.js 16 app
# --- Base image for building ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

# Copy the rest of the app source
COPY . .

# Build the Next.js app
ENV NODE_ENV=production
RUN npm run build

# Remove dev dependencies to shrink final image
RUN npm prune --omit=dev

# --- Runtime image ---
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy only necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/messages ./messages

# Change ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the Next.js server
CMD ["npm", "start"]
```

---

## 2. EMAIL VERIFICATION ISSUES

### 🔴 Critical Problems Found

#### Issue 2.1: `useVerificationGuard` Hook Uses Wrong Router
**File:** `src/hooks/useVerificationGuard.ts`

```typescript
import { useRouter } from 'next/navigation';  // ❌ WRONG!

export function useVerificationGuard() {
  const router = useRouter();
  // ...
  router.push('/login');  // This uses default next/navigation
}
```

**Problem:**
- You're using `next/navigation` which is the **app directory client router**
- This ignores your **i18n routing setup** from `next-intl`
- Should redirect to `/en/login` or `/ar/login` based on locale
- Currently redirects to `/login` which might not work with your locale structure

**Solution:**
```typescript
import { useRouter } from '@/i18n/routing';  // ✅ Use your i18n router

export function useVerificationGuard() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVerification = () => {
      if (typeof window === 'undefined') return;

      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        router.push('/login');  // This will now handle locale correctly
        return;
      }

      // ✅ Better: Make server call to verify email instead of relying on sessionStorage
      // const { isVerified } = await fetch('/api/auth/check-verification');
      
      const verificationStatus = sessionStorage.getItem('email_verified');
      
      if (verificationStatus === 'true') {
        setIsVerified(true);
        setLoading(false);
      } else {
        router.push('/auth/verify-email');
      }
    };

    checkVerification();
  }, [router]);

  return { isVerified, loading };
}
```

---

#### Issue 2.2: Email Verification Uses SessionStorage (Not Reliable)
**File:** `src/components/Auth/VerifyEmailAuto.tsx`

```typescript
useEffect(() => {
  const verifyEmail = async () => {
    // ...
    const response = await fetch('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ uid, token }),
    });

    if (!response.ok) throw new Error(errorMsg);
    
    setSuccess(true);
    
    // ❌ PROBLEM: Using sessionStorage
    sessionStorage.setItem('email_verified', 'true');
    
    setTimeout(() => {
      router.push('/login');  // ❌ Also using wrong router
    }, 2000);
  };
  
  verifyEmail();
}, [uid, token, t, router]);
```

**Problems:**
1. **SessionStorage is Lost on Tab Refresh** - Users close tab and return, verification is forgotten
2. **Not Synced with Backend** - Backend marks email as verified, but frontend relies on localStorage
3. **Wrong Router** - Using `next/navigation` instead of i18n router
4. **No Fallback Logic** - If user refreshes after verification, they're stuck

**Solution:**
```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';  // ✅ Use i18n router
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface VerifyEmailAutoProps {
  locale: string;
  uid: string;
  token: string;
}

export default function VerifyEmailAuto({
  locale,
  uid,
  token,
}: VerifyEmailAutoProps) {
  const t = useTranslations('verifyEmail');
  const router = useRouter();
  const isAr = locale === 'ar';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (typeof window === 'undefined') return;

        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid,
            token,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMsg = data.message || data.detail || t('error');
          throw new Error(errorMsg);
        }

        setSuccess(true);

        // ✅ BETTER: Store in localStorage (survives tab refresh)
        // and with an expiry time
        localStorage.setItem('email_verified', JSON.stringify({
          verified: true,
          timestamp: Date.now(),
          expiresIn: 24 * 60 * 60 * 1000, // 24 hours
        }));

        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login');  // ✅ Now uses i18n router
        }, 2000);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : t('error');
        setError(errorMessage);
        setLoading(false);
      }
    };

    verifyEmail();
  }, [uid, token, t, router, locale]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-3 rounded-lg bg-blue-50 p-6">
          <Loader className="h-5 w-5 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-blue-900">{t('verifying')}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg bg-green-50 p-4">
          <CheckCircle className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-900">
              {isAr
                ? 'تم التحقق من بريدك الإلكتروني بنجاح'
                : 'Email verified successfully'}
            </p>
            <p className="text-xs text-green-700 mt-2">
              {isAr
                ? 'جارٍ إعادة التوجيه إلى صفحة تسجيل الدخول...'
                : 'Redirecting to login page...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">{error}</p>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="inline-flex w-full items-center justify-center rounded-xl bg-[#00FF91] px-4 py-3 text-center text-[15px] font-semibold text-black shadow-sm transition hover:brightness-95 focus-visible:outline-none"
        >
          {isAr ? 'حاول مرة أخرى' : 'Try Again'}
        </button>
      </div>
    );
  }

  return null;
}
```

---

#### Issue 2.3: No Backend Fallback for Verification Status
**Problem:**
- Frontend only checks `sessionStorage` (unreliable)
- No API endpoint to check if email is actually verified on backend
- User can clear storage and bypass verification requirement

**Solution - Add a new API endpoint:**
```typescript
// src/app/api/auth/check-verification/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('access_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { verified: false },
        { status: 401 }
      );
    }

    // Call backend to check actual verification status
    const response = await fetch(`${API_BASE_URL}/auth/users/me/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    return NextResponse.json({
      verified: data.is_active === true,  // Backend field name may vary
      email: data.email,
    });
  } catch (error) {
    console.error('Verification check error:', error);
    return NextResponse.json(
      { verified: false },
      { status: 500 }
    );
  }
}
```

**Update the hook to use this:**
```typescript
export function useVerificationGuard() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVerification = async () => {
      if (typeof window === 'undefined') return;

      try {
        // ✅ Check backend instead of sessionStorage
        const response = await fetch('/api/auth/check-verification');
        const data = await response.json();

        if (data.verified) {
          setIsVerified(true);
        } else {
          router.push('/auth/verify-email');
        }
      } catch (error) {
        console.error('Verification check failed:', error);
        router.push('/auth/verify-email');
      } finally {
        setLoading(false);
      }
    };

    checkVerification();
  }, [router]);

  return { isVerified, loading };
}
```

---

#### Issue 2.4: Missing Locale in Redirect URLs
**File:** `src/components/Auth/VerifyEmailAuto.tsx`

```typescript
setTimeout(() => {
  router.push('/login');  // ❌ Wrong!
}, 2000);
```

**Problem:**
- Your app has locale-prefixed routes: `/[locale]/login`
- Redirecting to `/login` won't work properly
- Need to use the i18n router which handles this

**Solution:** Already covered in Issue 2.1 & 2.2 above

---

#### Issue 2.5: No Error Recovery for Network Failures
**Problem:**
```typescript
const response = await fetch('/api/auth/verify-email', {
  method: 'POST',
  body: JSON.stringify({ uid, token }),
});

if (!response.ok) {
  throw new Error(errorMsg);
}
```

- No retry logic
- No timeout handling
- No connection status check
- If network fails once, user must manually retry

**Solution:**
```typescript
const verifyEmail = async (retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, token }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      setSuccess(true);
      localStorage.setItem('email_verified', JSON.stringify({
        verified: true,
        timestamp: Date.now(),
      }));

      setTimeout(() => router.push('/login'), 2000);
      return;
    } catch (err) {
      if (attempt === retries) {
        const errorMessage = err instanceof Error ? err.message : t('error');
        setError(errorMessage);
        setLoading(false);
        return;
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};

verifyEmail();
```

---

#### Issue 2.6: Hardcoded Redirect to English
**File:** `src/app/activation/[uid]/[token]/page.tsx`

```typescript
redirect(`/en/auth/verify-email/${uid}/${token}`);  // ❌ Always English!
```

**Problem:**
- Hardcoded to `/en/` 
- Arabic users will have to manually switch language
- Should respect user's preferred language or query parameter

**Solution:**
```typescript
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';

type PageProps = {
  params: Promise<{ uid: string; token: string }>;
  searchParams?: Promise<{ locale?: string }>;
};

export default async function ActivationPage({ 
  params,
  searchParams 
}: PageProps) {
  const { uid, token } = await params;
  const sp = await searchParams;
  
  // Try to get locale from query param, otherwise use server locale
  const locale = sp?.locale || (await getLocale()) || 'en';
  
  redirect(`/${locale}/auth/verify-email/${uid}/${token}`);
}
```

---

## Summary Table

| Issue | Severity | Impact | Status |
|-------|----------|--------|--------|
| Missing `package-lock.json` | 🔴 Critical | Docker build fails | Unfixed |
| Node 22 Alpine incompatibility | 🔴 Critical | Build/runtime errors | Unfixed |
| Missing i18n files in Docker | 🔴 Critical | Runtime crash | Unfixed |
| Wrong router import in verification | 🔴 Critical | Redirects don't work | Unfixed |
| SessionStorage verification (unreliable) | 🟠 High | Users must retry verification | Unfixed |
| No backend verification check | 🟠 High | Can bypass verification | Unfixed |
| Hardcoded English locale redirect | 🟠 High | Arabic users get English | Unfixed |
| No retry/error recovery | 🟡 Medium | Poor UX on network issues | Unfixed |

---

## Recommended Action Plan

1. **Fix Docker first** (blocks deployment)
2. **Fix router imports** in verification hooks/components
3. **Add backend verification check** API endpoint
4. **Improve error handling** with retries
5. **Fix locale redirect** issues
6. **Test end-to-end** verification flow in Docker
