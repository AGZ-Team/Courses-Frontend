# Authentication System Documentation

## Overview
This document provides a comprehensive guide to the authentication system in the Courses Frontend application. It covers the complete flow from signup through login, email verification, and password reset.

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [File Structure](#file-structure)
3. [Core Libraries](#core-libraries)
4. [Authentication Flows](#authentication-flows)
5. [API Endpoints](#api-endpoints)
6. [Backend Integration](#backend-integration)
7. [Error Handling](#error-handling)

---

## Architecture Overview

### High-Level Flow

```
User Action → Frontend Component → Auth Library → Backend API → Response → State Update → Redirect
```

### Key Components
- **Frontend Components**: UI forms for signup, login, password reset, email verification
- **Auth Library** (`src/lib/auth.ts`): Core authentication logic and token management
- **API Utilities** (`src/lib/api.ts`): Authenticated HTTP requests
- **Next.js API Routes** (`src/app/api/auth/`): Server-side proxy endpoints
- **Backend**: Djoser-based Django REST API

---

## File Structure

### Directory Layout

```
src/
├── lib/
│   ├── auth.ts                          # Core auth functions & token management
│   ├── api.ts                           # Authenticated API request utilities
│   └── errorMessages.ts                 # Error parsing & user-friendly messages
├── components/
│   ├── Auth/
│   │   ├── VerifyEmailAuto.tsx         # Auto email verification component
│   │   ├── ResetPasswordFormAuto.tsx    # Auto password reset form
│   │   ├── VerifyEmailInstructions.tsx  # Manual verification instructions
│   │   └── ResetPasswordInstructions.tsx # Manual reset instructions
│   ├── Login/
│   │   └── LoginForm.tsx                # Login form component
│   └── Signup/
│       └── SignupForm.tsx               # Signup form component
├── app/
│   ├── [locale]/
│   │   ├── login/
│   │   │   └── page.tsx                 # Login page
│   │   ├── signup/
│   │   │   └── page.tsx                 # Signup page
│   │   └── auth/
│   │       ├── verify-email/
│   │       │   ├── page.tsx             # Email verification page
│   │       │   └── [uid]/[token]/page.tsx # Auto-verify with params
│   │       └── reset-password/
│   │           ├── page.tsx             # Password reset request page
│   │           └── [uid]/[token]/page.tsx # Auto-reset with params
│   └── api/
│       └── auth/
│           ├── verify-email/route.ts    # Email verification endpoint
│           ├── reset-password/route.ts  # Password reset endpoint
│           ├── login/route.ts           # Login endpoint (if used)
│           └── resend-verification/route.ts # Resend verification email
```

---

## Core Libraries

### 1. `src/lib/auth.ts` - Authentication Core

#### Interfaces

**SignupData**
```typescript
interface SignupData {
  username: string;           // Unique username
  email: string;              // User email
  password: string;           // Password (8+ chars)
  first_name: string;         // First name
  last_name: string;          // Last name
  phone: string;              // Phone number
  expertise?: string;         // Optional expertise field
  id_front?: File;            // Optional ID front image
  id_back?: File;             // Optional ID back image
  is_instructor?: boolean;    // Is user an instructor
}
```

**LoginData**
```typescript
interface LoginData {
  username: string;           // Username or email
  password: string;           // Password
}
```

**JWTResponse**
```typescript
interface JWTResponse {
  access: string;             // JWT access token
  refresh: string;            // JWT refresh token
  uid?: string;               // User ID (for email verification)
  token?: string;             // Verification token (for email verification)
}
```

#### Functions

**`signup(data: SignupData): Promise<SignupResponse>`**
- **Purpose**: Register a new user
- **Endpoint**: `POST /auth/users/`
- **Process**:
  1. Creates FormData object (supports file uploads)
  2. Appends all user data fields
  3. Sends to backend
  4. Parses error responses for user-friendly messages
- **Returns**: User object with id, username, email, first_name, last_name
- **Throws**: Error with descriptive message on failure
- **Example**:
  ```typescript
  const response = await signup({
    username: 'johndoe',
    email: 'john@example.com',
    password: 'SecurePass123',
    first_name: 'John',
    last_name: 'Doe',
    phone: '+1234567890',
    is_instructor: false
  });
  ```

**`login(data: LoginData): Promise<JWTResponse>`**
- **Purpose**: Authenticate user and get JWT tokens
- **Endpoint**: `POST /auth/jwt/create/`
- **Process**:
  1. Normalizes username (lowercase if email)
  2. Sends credentials to backend
  3. Stores tokens in localStorage:
     - `access_token`: JWT access token
     - `refresh_token`: JWT refresh token
     - `access`: Alias for access_token (compatibility)
     - `username`: User's username
     - `verification_uid`: UID for email verification (if needed)
     - `verification_token`: Token for email verification (if needed)
  4. Dispatches 'auth-changed' event for UI listeners
- **Returns**: JWT tokens and optional verification credentials
- **Throws**: Error with backend error message
- **Example**:
  ```typescript
  const tokens = await login({
    username: 'johndoe',
    password: 'SecurePass123'
  });
  // tokens.access = "eyJ0eXAiOiJKV1QiLCJhbGc..."
  // tokens.refresh = "eyJ0eXAiOiJKV1QiLCJhbGc..."
  ```

**`verifyToken(token: string): Promise<boolean>`**
- **Purpose**: Verify if a JWT token is valid
- **Endpoint**: `POST /auth/jwt/verify/`
- **Process**:
  1. Sends token to backend
  2. Returns true if valid, false if invalid
- **Returns**: Boolean indicating token validity
- **Example**:
  ```typescript
  const isValid = await verifyToken(accessToken);
  ```

**`getAccessToken(): string | null`**
- **Purpose**: Retrieve stored access token from localStorage
- **Returns**: Access token or null if not found
- **Note**: Returns null on server-side (SSR safety)

**`getRefreshToken(): string | null`**
- **Purpose**: Retrieve stored refresh token from localStorage
- **Returns**: Refresh token or null if not found
- **Note**: Returns null on server-side (SSR safety)

**`clearTokens(): void`**
- **Purpose**: Remove all auth tokens and user data from localStorage
- **Clears**:
  - `access_token`
  - `refresh_token`
  - `access`
  - `username`
  - `verification_uid`
  - `verification_token`
- **Side Effect**: Dispatches 'auth-changed' event
- **Example**: Called on logout

**`isAuthenticated(): Promise<boolean>`**
- **Purpose**: Check if user is currently authenticated
- **Process**:
  1. Gets access token from localStorage
  2. Verifies token with backend
- **Returns**: Boolean indicating authentication status
- **Example**:
  ```typescript
  const authenticated = await isAuthenticated();
  ```

---

### 2. `src/lib/api.ts` - API Request Utilities

#### Functions

**`apiRequest<T>(endpoint: string, options?: RequestOptions): Promise<T>`**
- **Purpose**: Make authenticated HTTP requests to backend
- **Parameters**:
  - `endpoint`: API endpoint path (e.g., `/courses/`)
  - `options.requireAuth`: If true, adds Authorization header with Bearer token
  - `options.headers`: Custom headers
  - Other standard fetch options
- **Process**:
  1. If `requireAuth` is true, gets access token and adds to headers
  2. Makes fetch request to `https://alaaelgharably248.pythonanywhere.com{endpoint}`
  3. Throws error if response not ok
  4. Returns parsed JSON
- **Returns**: Parsed JSON response of type T
- **Example**:
  ```typescript
  const courses = await apiRequest<Course[]>('/courses/', {
    method: 'GET',
    requireAuth: true
  });
  ```

**`apiGet<T>(endpoint: string, requireAuth?: boolean): Promise<T>`**
- **Purpose**: Make authenticated GET request
- **Wrapper around**: `apiRequest` with method: 'GET'

**`apiPost<T>(endpoint: string, data: unknown, requireAuth?: boolean): Promise<T>`**
- **Purpose**: Make authenticated POST request
- **Wrapper around**: `apiRequest` with method: 'POST'
- **Example**:
  ```typescript
  const result = await apiPost('/courses/', courseData, true);
  ```

**`apiPut<T>(endpoint: string, data: unknown, requireAuth?: boolean): Promise<T>`**
- **Purpose**: Make authenticated PUT request
- **Default**: `requireAuth = true`

**`apiPatch<T>(endpoint: string, data: unknown, requireAuth?: boolean): Promise<T>`**
- **Purpose**: Make authenticated PATCH request
- **Default**: `requireAuth = true`

**`apiDelete<T>(endpoint: string, requireAuth?: boolean): Promise<T>`**
- **Purpose**: Make authenticated DELETE request
- **Default**: `requireAuth = true`

---

## Authentication Flows

### Flow 1: User Signup

```
User fills signup form
    ↓
SignupForm.tsx validates input
    ↓
Calls signup() from auth.ts
    ↓
POST /auth/users/ (FormData with user data)
    ↓
Backend creates user account
    ↓
Returns user object (id, username, email, etc.)
    ↓
Redirect to login page
```

**Key Files**:
- `src/components/Signup/SignupForm.tsx` - Form component
- `src/lib/auth.ts` - signup() function
- Backend: `/auth/users/` endpoint

**Example Flow**:
```typescript
// In SignupForm.tsx
const response = await signup({
  username: 'newuser',
  email: 'user@example.com',
  password: 'SecurePass123',
  first_name: 'John',
  last_name: 'Doe',
  phone: '+1234567890',
  is_instructor: false
});
// User account created, redirect to login
router.push('/login');
```

---

### Flow 2: User Login

```
User enters username/email and password
    ↓
LoginForm.tsx validates input
    ↓
Calls login() from auth.ts
    ↓
POST /auth/jwt/create/ (username, password)
    ↓
Backend validates credentials
    ↓
Returns JWT tokens (access, refresh)
    ↓
Tokens stored in localStorage
    ↓
Check if email verification needed
    ├─ If uid & token in response → Redirect to /auth/verify-email/[uid]/[token]
    └─ If no uid & token → Redirect to home page
```

**Key Files**:
- `src/components/Login/LoginForm.tsx` - Login form
- `src/lib/auth.ts` - login() function
- Backend: `/auth/jwt/create/` endpoint

**Example Flow**:
```typescript
// In LoginForm.tsx
try {
  const tokens = await login({
    username: 'johndoe',
    password: 'SecurePass123'
  });
  
  if (tokens.uid && tokens.token) {
    // Email not verified yet
    router.push(`/auth/verify-email/${tokens.uid}/${tokens.token}`);
  } else {
    // Already verified
    router.push('/');
  }
} catch (error) {
  // Show error message
  setGeneralError(error.message);
}
```

---

### Flow 3: Email Verification (Auto)

```
User clicks verification link in email
    ↓
URL: /auth/verify-email/[uid]/[token]
    ↓
VerifyEmailAuto.tsx mounts with uid & token from URL
    ↓
useEffect calls POST /api/auth/verify-email
    ↓
Frontend API route receives uid & token
    ↓
Calls backend POST /auth/users/activation/
    ↓
Backend activates user account
    ↓
Returns success response
    ↓
Frontend shows success message
    ↓
Auto-redirect to login after 2 seconds
```

**Key Files**:
- `src/app/[locale]/auth/verify-email/[uid]/[token]/page.tsx` - Route page
- `src/components/Auth/VerifyEmailAuto.tsx` - Auto-verification component
- `src/app/api/auth/verify-email/route.ts` - API endpoint

**Component Flow** (VerifyEmailAuto.tsx):
```typescript
export default function VerifyEmailAuto({ locale, uid, token }) {
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Call frontend API route
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid, token })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message);
        }
        
        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => router.push('/login'), 2000);
      } catch (err) {
        setError(err.message);
      }
    };
    
    verifyEmail();
  }, [uid, token]);
}
```

**API Route Flow** (`/api/auth/verify-email`):
```typescript
export async function POST(request: NextRequest) {
  const body = await request.json();
  let { uid, token } = body;
  
  // If not in body, try to get from secure cookie
  if (!uid || !token) {
    const verifyContextCookie = await cookies().get('verify_context');
    // Parse cookie...
  }
  
  // Call backend
  const response = await fetch(
    'https://alaaelgharably248.pythonanywhere.com/auth/users/activation/',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, token })
    }
  );
  
  if (!response.ok) {
    return NextResponse.json({ success: false, message: '...' }, { status: response.status });
  }
  
  return NextResponse.json({ success: true, message: 'Email verified successfully' });
}
```

---

### Flow 4: Password Reset (Request)

```
User clicks "Forgot Password" on login page
    ↓
Redirected to /auth/reset-password
    ↓
User enters email address
    ↓
Frontend sends POST request with email
    ↓
Backend sends password reset email with link
    ↓
Email contains link: /auth/reset-password/[uid]/[token]
    ↓
User clicks link in email
```

**Key Files**:
- `src/components/Auth/ResetPasswordInstructions.tsx` - Email request form
- Backend: `/auth/users/reset_password/` endpoint

---

### Flow 5: Password Reset (Confirm)

```
User clicks reset link in email
    ↓
URL: /auth/reset-password/[uid]/[token]
    ↓
ResetPasswordFormAuto.tsx mounts with uid & token
    ↓
User enters new password and confirms
    ↓
Form validates password (8+ chars, matches)
    ↓
Calls POST /auth/users/reset_password_confirm/
    ↓
Backend validates uid & token
    ↓
Backend updates password
    ↓
Returns success response
    ↓
Frontend shows success message
    ↓
Auto-redirect to login after 2 seconds
```

**Key Files**:
- `src/app/[locale]/auth/reset-password/[uid]/[token]/page.tsx` - Route page
- `src/components/Auth/ResetPasswordFormAuto.tsx` - Password reset form
- Backend: `/auth/users/reset_password_confirm/` endpoint

**Component Flow** (ResetPasswordFormAuto.tsx):
```typescript
export default function ResetPasswordFormAuto({ locale, uid, token }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      // Call backend directly
      const response = await fetch(
        'https://alaaelgharably248.pythonanywhere.com/auth/users/reset_password_confirm/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid,
            token,
            new_password: formData.newPassword,
            re_new_password: formData.confirmPassword
          })
        }
      );
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to reset password');
      }
      
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err.message);
    }
  };
}
```

---

## API Endpoints

### Backend Endpoints (Djoser)

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---|
| `/auth/users/` | POST | Create new user (signup) | No |
| `/auth/jwt/create/` | POST | Get JWT tokens (login) | No |
| `/auth/jwt/verify/` | POST | Verify JWT token | No |
| `/auth/users/activation/` | POST | Activate/verify email | No |
| `/auth/users/reset_password/` | POST | Request password reset | No |
| `/auth/users/reset_password_confirm/` | POST | Confirm password reset | No |

### Frontend API Routes (Next.js)

| Route | Method | Purpose | Backend Call |
|-------|--------|---------|---|
| `/api/auth/verify-email` | POST | Verify email via frontend | `/auth/users/activation/` |
| `/api/auth/reset-password` | POST | Reset password via frontend | `/auth/users/reset_password_confirm/` |
| `/api/auth/resend-verification` | POST | Resend verification email | `/auth/users/resend_email/` |

---

## Backend Integration

### Backend URL
```
https://alaaelgharably248.pythonanywhere.com
```

### Authentication Method
- **Type**: JWT (JSON Web Tokens)
- **Header Format**: `Authorization: Bearer {access_token}`
- **Token Storage**: localStorage
- **Token Keys**:
  - `access_token`: Primary access token
  - `refresh_token`: Token refresh token
  - `access`: Alias for compatibility

### Request/Response Format
- **Content-Type**: `application/json` (except signup which uses FormData)
- **Response Format**: JSON objects with status codes

### Error Handling
Backend returns errors in various formats:
```json
{
  "detail": "Error message",
  "message": "Error message",
  "field_name": ["Error for specific field"]
}
```

Frontend normalizes these via `errorMessages.ts`

---

## Error Handling

### Error Parsing (`src/lib/errorMessages.ts`)

**`parseLoginErrors(error: any, language: string): Record<string, string>`**
- Parses backend error response
- Returns field-specific error messages
- Supports both English and Arabic

**`getUserFriendlyErrorMessage(error: Error, context: string, language: string): string`**
- Converts technical errors to user-friendly messages
- Context can be: 'login', 'signup', 'verify', 'reset'
- Returns localized error message

### Error Flow in LoginForm

```typescript
try {
  const tokens = await login(credentials);
} catch (err) {
  // Check for email not verified error
  const isEmailNotVerified = 
    rawError.includes('email') && 
    (rawError.includes('not verified') || rawError.includes('not activated'));
  
  if (isEmailNotVerified) {
    setIsEmailNotVerified(true);
    setGeneralError('Email not verified. Please verify your email first');
    return;
  }
  
  // Try to parse field-specific errors
  try {
    const errorData = JSON.parse(err.message);
    const parsed = parseLoginErrors(errorData, language);
    if (Object.keys(parsed).length > 0) {
      setFieldErrors(parsed);
      return;
    }
  } catch {
    // Not JSON, treat as general error
  }
  
  // Show general error
  setGeneralError(getUserFriendlyErrorMessage(err, 'login', language));
}
```

---

## State Management

### localStorage Keys

| Key | Purpose | Value Type | Cleared On |
|-----|---------|-----------|---|
| `access_token` | JWT access token | String | Logout |
| `refresh_token` | JWT refresh token | String | Logout |
| `access` | Alias for access_token | String | Logout |
| `username` | Current user's username | String | Logout |
| `verification_uid` | UID for email verification | String | After verification |
| `verification_token` | Token for email verification | String | After verification |
| `rememberMe` | Saved username for login | String | Manual clear |

### Events

**`auth-changed`**
- **Fired**: After login or logout
- **Listeners**: Navbar, auth status components
- **Purpose**: Notify UI of authentication state change
- **Example**:
  ```typescript
  window.addEventListener('auth-changed', () => {
    // Update navbar, check auth status, etc.
  });
  ```

---

## Security Considerations

1. **Token Storage**: Tokens stored in localStorage (accessible to XSS attacks)
   - Consider using httpOnly cookies in production
   
2. **HTTPS**: All API calls should use HTTPS in production
   - Backend URL uses HTTP in development

3. **Password Validation**: 
   - Minimum 8 characters enforced
   - Validation on both frontend and backend

4. **Email Verification**: 
   - Required before user can fully use account
   - Token expires after certain time (backend configured)

5. **CORS**: 
   - Frontend and backend on different domains
   - CORS headers must be configured on backend

---

## Common Issues & Solutions

### Issue: "Email not verified" error on login
**Solution**: User needs to click verification link in email or use /auth/verify-email page

### Issue: Password reset token expired
**Solution**: Request new password reset email from /auth/reset-password page

### Issue: Tokens not persisting after page refresh
**Solution**: Check localStorage is enabled and not cleared by browser

### Issue: CORS errors when calling backend
**Solution**: Ensure backend has CORS headers configured for frontend domain

---

## Testing the Authentication Flow

### 1. Test Signup
```bash
curl -X POST https://alaaelgharably248.pythonanywhere.com/auth/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123",
    "first_name": "Test",
    "last_name": "User",
    "phone": "+1234567890"
  }'
```

### 2. Test Login
```bash
curl -X POST https://alaaelgharably248.pythonanywhere.com/auth/jwt/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPass123"
  }'
```

### 3. Test Verify Token
```bash
curl -X POST https://alaaelgharably248.pythonanywhere.com/auth/jwt/verify/ \
  -H "Content-Type: application/json" \
  -d '{"token": "YOUR_ACCESS_TOKEN"}'
```

---

## Conclusion

The authentication system provides a complete user lifecycle management:
- **Signup**: User registration with optional file uploads
- **Login**: JWT-based authentication
- **Email Verification**: Automatic activation via email link
- **Password Reset**: Secure password recovery flow
- **Token Management**: Automatic storage and retrieval
- **Error Handling**: User-friendly error messages in multiple languages

All components work together to provide a secure and user-friendly authentication experience.
