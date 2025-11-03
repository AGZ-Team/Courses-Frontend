# Authentication Integration Guide

This project now includes full authentication integration with the backend API.

## API Endpoints

The following authentication endpoints are integrated:

1. **Create User (Signup)**: `POST https://alaaelgharably248.pythonanywhere.com/auth/users/`
2. **Create JWT (Login)**: `POST https://alaaelgharably248.pythonanywhere.com/auth/jwt/create/`
3. **Verify JWT**: `POST https://alaaelgharably248.pythonanywhere.com/auth/jwt/verify/`

## How the APIs are Integrated

### Architecture Overview

```
User Interface (Login/Signup Pages)
           ↓
Client-Side Components (LoginForm.tsx / SignupForm.tsx)
           ↓
Authentication Library (lib/auth.ts)
           ↓
Backend API (alaaelgharably248.pythonanywhere.com)
           ↓
JWT Tokens stored in localStorage
           ↓
Authentication Context (AuthContext.tsx)
           ↓
Protected Routes & Components
```

## Integration Details

### 1. Authentication Library (`src/lib/auth.ts`)

This is the core file that handles all API communications. It contains:

#### **Signup Function**
```typescript
export async function signup(data: SignupData): Promise<SignupResponse>
```

**How it works:**
1. Creates a `FormData` object (required for file uploads)
2. Appends all user fields: `username`, `email`, `password`, `re_password`, `first_name`, `last_name`
3. For instructors: appends `phone_number`, `expertise`, `id_front`, `id_back`, `is_instructor`
4. Makes a `POST` request to `/auth/users/`
5. Returns user data on success or throws error

**Request Example:**
```javascript
// What gets sent to the server
FormData {
  username: "john_doe",
  email: "john@example.com",
  password: "SecurePass123",
  re_password: "SecurePass123",
  first_name: "John",
  last_name: "Doe",
  is_instructor: "false"
}
```

**Response Example:**
```json
{
  "id": 123,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

#### **Login Function**
```typescript
export async function login(data: LoginData): Promise<JWTResponse>
```

**How it works:**
1. Takes `username` and `password`
2. Makes a `POST` request to `/auth/jwt/create/`
3. Receives JWT tokens: `access` and `refresh`
4. **Automatically stores both tokens in `localStorage`**
5. Returns the tokens

**Request Example:**
```json
{
  "username": "john_doe",
  "password": "SecurePass123"
}
```

**Response Example:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Token Storage:**
```javascript
localStorage.setItem('access_token', tokens.access);
localStorage.setItem('refresh_token', tokens.refresh);
```

#### **Verify Token Function**
```typescript
export async function verifyToken(token: string): Promise<boolean>
```

**How it works:**
1. Takes a JWT token string
2. Makes a `POST` request to `/auth/jwt/verify/`
3. Returns `true` if valid, `false` if invalid

**Request Example:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response:**
- Status `200 OK` → Token is valid → Returns `true`
- Status `401 Unauthorized` → Token is invalid → Returns `false`

#### **Helper Functions**
```typescript
getAccessToken()      // Retrieves access token from localStorage
getRefreshToken()     // Retrieves refresh token from localStorage  
clearTokens()         // Removes all tokens (logout)
isAuthenticated()     // Checks if user has valid token
```

### 2. Authentication Context (`src/contexts/AuthContext.tsx`)

Manages global authentication state across the entire application.

**How it works:**
1. Creates a React Context with authentication state
2. Provides `useAuth()` hook for components
3. On app load, automatically checks if user is authenticated
4. Exposes: `isAuthenticated`, `isLoading`, `logout`, `checkAuthentication`

**Usage in any component:**
```typescript
const {isAuthenticated, logout} = useAuth();
```

### 3. Client Components Integration

#### **LoginForm Component (`src/components/Login/LoginForm.tsx`)**

**Workflow:**
1. User enters username and password
2. Form submits → calls `handleSubmit()`
3. `handleSubmit()` calls `login()` from `lib/auth.ts`
4. On success:
   - Tokens stored in localStorage automatically
   - User redirected to home page using `router.push('/')`
5. On error:
   - Error message displayed to user
   - Form remains with data for retry

**Code Flow:**
```typescript
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    await login({
      username: formData.username,
      password: formData.password,
    });
    
    router.push('/'); // Redirect on success
  } catch (err) {
    setError(err.message); // Show error
  } finally {
    setLoading(false);
  }
};
```

#### **SignupForm Component (`src/components/Signup/SignupForm.tsx`)**

**Workflow:**
1. User selects Student or Instructor tab
2. Fills in required fields
3. For instructors: uploads ID images
4. Form validation:
   - Checks passwords match
   - Validates required fields
   - Ensures instructor files are uploaded
5. Form submits → calls `handleSubmit()`
6. `handleSubmit()` calls `signup()` from `lib/auth.ts`
7. On success:
   - Success message displayed
   - Wait 2 seconds
   - Redirect to `/login`
8. On error:
   - Error message displayed
   - Form remains for retry

**Code Flow:**
```typescript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validation
  if (formData.password !== formData.confirmPassword) {
    setError('Passwords do not match');
    return;
  }
  
  setLoading(true);
  
  try {
    await signup({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      re_password: formData.confirmPassword,
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone_number: activeTab === 'instructor' ? formData.phoneNumber : undefined,
      expertise: activeTab === 'instructor' ? formData.expertise : undefined,
      id_front: activeTab === 'instructor' ? idFrontFile : undefined,
      id_back: activeTab === 'instructor' ? idBackFile : undefined,
      is_instructor: activeTab === 'instructor',
    });
    
    setSuccess(true);
    setTimeout(() => router.push('/login'), 2000);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### 4. Protected Routes (`src/components/ProtectedRoute.tsx`)

**How it works:**
1. Wraps any page that requires authentication
2. Uses `useAuth()` hook to check authentication status
3. If not authenticated → redirects to `/login`
4. If authenticated → renders the protected content
5. Shows loading spinner while checking

**Usage Example:**
```typescript
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>This content only visible to logged-in users</div>
    </ProtectedRoute>
  );
}
```

### 5. API Utilities (`src/lib/api.ts`)

Helper functions for making authenticated API requests to other endpoints.

**How it works:**
1. Automatically includes JWT token in `Authorization` header
2. Handles errors consistently
3. Provides RESTful methods: GET, POST, PUT, PATCH, DELETE

**Usage Example:**
```typescript
import {apiGet, apiPost} from '@/lib/api';

// Make authenticated request
const profile = await apiGet('/api/user/profile', true); // true = requires auth

// The function automatically adds:
// headers: { 'Authorization': 'Bearer eyJ0eXAiOiJKV1Q...' }
```

## Complete Workflow Examples

### Signup Flow (Step-by-Step)

```
1. User visits /signup
   ↓
2. SignupForm.tsx renders
   ↓
3. User fills form and clicks "Sign Up"
   ↓
4. handleSubmit() validates data
   ↓
5. signup() function called with user data
   ↓
6. FormData created and sent to:
   POST https://alaaelgharably248.pythonanywhere.com/auth/users/
   Body: { username, email, password, re_password, first_name, last_name, ... }
   ↓
7. Backend creates user account
   ↓
8. Backend responds with user data
   ↓
9. Success message shown
   ↓
10. Wait 2 seconds
   ↓
11. Redirect to /login
```

### Login Flow (Step-by-Step)

```
1. User visits /login
   ↓
2. LoginForm.tsx renders
   ↓
3. User enters username and password
   ↓
4. User clicks "Login"
   ↓
5. handleSubmit() called
   ↓
6. login() function called
   ↓
7. POST request sent to:
   POST https://alaaelgharably248.pythonanywhere.com/auth/jwt/create/
   Body: { username: "john_doe", password: "SecurePass123" }
   ↓
8. Backend validates credentials
   ↓
9. Backend generates JWT tokens
   ↓
10. Backend responds with:
    { access: "eyJ0...", refresh: "eyJ0..." }
   ↓
11. login() function stores tokens:
    localStorage.setItem('access_token', tokens.access)
    localStorage.setItem('refresh_token', tokens.refresh)
   ↓
12. User redirected to home page (/)
   ↓
13. AuthContext detects tokens and updates state
   ↓
14. isAuthenticated becomes true
   ↓
15. Protected routes now accessible
```

### Protected Route Access Flow

```
1. User navigates to protected page
   ↓
2. ProtectedRoute component renders
   ↓
3. useAuth() hook checks authentication
   ↓
4. AuthContext calls isAuthenticated()
   ↓
5. isAuthenticated() gets access_token from localStorage
   ↓
6. verifyToken() called with token
   ↓
7. POST request sent to:
   POST https://alaaelgharably248.pythonanywhere.com/auth/jwt/verify/
   Body: { token: "eyJ0..." }
   ↓
8a. If token valid (200 OK):
    → isAuthenticated = true
    → Render protected content
   ↓
8b. If token invalid (401):
    → isAuthenticated = false
    → Redirect to /login
```

### Making Authenticated API Calls

```
1. Component needs to fetch user data
   ↓
2. Calls apiGet('/api/profile', true)
   ↓
3. apiGet() retrieves access_token from localStorage
   ↓
4. Adds token to request headers:
   Authorization: Bearer eyJ0eXAiOiJKV1Q...
   ↓
5. Makes GET request to backend
   ↓
6. Backend validates token
   ↓
7. Backend returns user data
   ↓
8. Component receives and displays data
```

## Features
- Support for both **Student** and **Instructor** registration
- Student fields:
  - Username
  - Email
  - Password
  - Confirm Password
  - First Name
  - Last Name
- Additional Instructor fields:
  - Phone Number
  - Expertise
  - ID Front Image
  - ID Back Image
- Form validation
- Password matching validation
- Success/Error feedback
- Auto-redirect to login page after successful signup

### 2. User Login (`/login`)
- Username/Email and password authentication
- Remember me checkbox
- JWT token storage in localStorage
- Success/Error feedback
- Auto-redirect to home page after successful login

### 3. JWT Token Management
- Automatic token storage after login
- Token verification
- Access to utility functions for token management

## File Structure & Responsibilities

```
src/
├── lib/
│   ├── auth.ts                    # Core authentication functions
│   │                              # - signup(), login(), verifyToken()
│   │                              # - Token management functions
│   │                              # - Direct API communication
│   │
│   └── api.ts                     # Authenticated API request helpers
│                                  # - apiGet(), apiPost(), apiPut(), etc.
│                                  # - Auto-includes JWT tokens
│
├── contexts/
│   └── AuthContext.tsx            # Global authentication state
│                                  # - AuthProvider wrapper
│                                  # - useAuth() hook
│                                  # - Auto-checks auth on mount
│
├── components/
│   ├── ProtectedRoute.tsx         # Route protection wrapper
│   │                              # - Checks if user is authenticated
│   │                              # - Redirects to /login if not
│   │
│   ├── Auth/
│   │   └── UserAuthStatus.tsx     # UI component for navbar
│   │                              # - Shows login/logout buttons
│   │                              # - Displays auth status
│   │
│   ├── Login/
│   │   ├── LoginForm.tsx          # Client-side login form
│   │   │                          # - Handles form submission
│   │   │                          # - Calls login() from lib/auth.ts
│   │   │                          # - Manages loading/error states
│   │   │
│   │   └── LoginDecor.tsx         # Decorative elements
│   │
│   └── Signup/
│       └── SignupForm.tsx         # Client-side signup form
│                                  # - Handles student/instructor tabs
│                                  # - File upload for instructor IDs
│                                  # - Form validation
│                                  # - Calls signup() from lib/auth.ts
│
└── app/
    └── [locale]/
        ├── login/
        │   └── page.tsx           # Login page (Server Component)
        │                          # - Gets translations
        │                          # - Renders LoginForm
        │
        └── signup/
            └── page.tsx           # Signup page (Server Component)
                                   # - Gets translations
                                   # - Renders SignupForm
```

## Usage

### Authentication Functions

Import authentication functions from `@/lib/auth`:

```typescript
import {
  signup,
  login,
  verifyToken,
  getAccessToken,
  getRefreshToken,
  clearTokens,
  isAuthenticated
} from '@/lib/auth';
```

### Using Auth Context

Wrap your app with `AuthProvider` in the root layout:

```typescript
import {AuthProvider} from '@/contexts/AuthContext';

export default function RootLayout({children}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
```

Use the auth hook in components:

```typescript
import {useAuth} from '@/contexts/AuthContext';

function MyComponent() {
  const {isAuthenticated, isLoading, logout, checkAuthentication} = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <a href="/login">Login</a>
      )}
    </div>
  );
}
```

### Protected Routes

Use the `ProtectedRoute` component to protect pages:

```typescript
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Protected content here</div>
    </ProtectedRoute>
  );
}
```

## API Reference

### `signup(data: SignupData)`
Creates a new user account.

**Parameters:**
- `username`: string
- `email`: string
- `password`: string
- `re_password`: string
- `first_name`: string
- `last_name`: string
- `phone_number?`: string (optional, required for instructors)
- `expertise?`: string (optional, required for instructors)
- `id_front?`: File (optional, required for instructors)
- `id_back?`: File (optional, required for instructors)
- `is_instructor?`: boolean (optional, defaults to false)

**Returns:** `Promise<SignupResponse>`

### `login(data: LoginData)`
Authenticates user and stores JWT tokens.

**Parameters:**
- `username`: string
- `password`: string

**Returns:** `Promise<JWTResponse>`

### `verifyToken(token: string)`
Verifies if a JWT token is valid.

**Parameters:**
- `token`: string - The JWT token to verify

**Returns:** `Promise<boolean>`

### `getAccessToken()`
Retrieves the stored access token from localStorage.

**Returns:** `string | null`

### `getRefreshToken()`
Retrieves the stored refresh token from localStorage.

**Returns:** `string | null`

### `clearTokens()`
Removes all stored tokens (logout).

**Returns:** `void`

### `isAuthenticated()`
Checks if the user is currently authenticated.

**Returns:** `Promise<boolean>`

## Token Storage

JWT tokens are stored in `localStorage`:
- `access_token`: Access token for authenticated requests
- `refresh_token`: Refresh token for obtaining new access tokens

## Error Handling

All API functions throw errors that can be caught and displayed to users:

```typescript
try {
  await login({username, password});
} catch (error) {
  console.error('Login failed:', error.message);
}
```

## Data Flow Diagram

### Complete Request/Response Cycle

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER INTERACTION                              │
│                  (Fills form and clicks submit)                      │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   CLIENT-SIDE COMPONENT                              │
│              (LoginForm.tsx / SignupForm.tsx)                        │
│  • Validates form data                                               │
│  • Sets loading state                                                │
│  • Calls auth function                                               │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  AUTHENTICATION LIBRARY                              │
│                      (lib/auth.ts)                                   │
│  • signup() or login() function                                      │
│  • Prepares request data                                             │
│  • Makes fetch() call                                                │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼ HTTP POST Request
┌─────────────────────────────────────────────────────────────────────┐
│                        BACKEND API                                   │
│        https://alaaelgharably248.pythonanywhere.com                  │
│  • /auth/users/ (signup)                                             │
│  • /auth/jwt/create/ (login)                                         │
│  • /auth/jwt/verify/ (verify)                                        │
│  • Processes request                                                 │
│  • Validates data                                                    │
│  • Returns response                                                  │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼ HTTP Response (JSON)
┌─────────────────────────────────────────────────────────────────────┐
│                  AUTHENTICATION LIBRARY                              │
│                      (lib/auth.ts)                                   │
│  • Receives response                                                 │
│  • For login: Stores tokens in localStorage                          │
│  • Returns data or throws error                                      │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   CLIENT-SIDE COMPONENT                              │
│  • Receives response                                                 │
│  • On success: Shows message + redirects                             │
│  • On error: Shows error message                                     │
│  • Updates UI state                                                  │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION CONTEXT                            │
│                     (AuthContext.tsx)                                │
│  • Detects tokens in localStorage                                    │
│  • Updates isAuthenticated state                                     │
│  • Makes app-wide state available                                    │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    APPLICATION UI                                    │
│  • Protected routes become accessible                                │
│  • Auth-dependent UI updates (navbar, buttons)                       │
│  • User can make authenticated requests                              │
└─────────────────────────────────────────────────────────────────────┘
```

## Testing the Integration

### Manual Testing Steps

1. **Test Signup:**
   ```
   → Visit http://localhost:3000/signup
   → Fill in all required fields
   → Click "Sign Up"
   → Should see success message
   → Should redirect to /login after 2 seconds
   ```

2. **Test Login:**
   ```
   → Visit http://localhost:3000/login
   → Enter your credentials
   → Click "Login"
   → Open DevTools → Application → Local Storage
   → Verify access_token and refresh_token are stored
   → Should redirect to home page
   ```

3. **Test Token Storage:**
   ```javascript
   // In browser console
   console.log('Access Token:', localStorage.getItem('access_token'));
   console.log('Refresh Token:', localStorage.getItem('refresh_token'));
   ```

4. **Test Authentication State:**
   ```typescript
   // In any component
   const {isAuthenticated} = useAuth();
   console.log('Is Authenticated:', isAuthenticated);
   ```

5. **Test Protected Routes:**
   ```
   → Logout (clear tokens)
   → Try to access a protected page
   → Should redirect to /login
   → Login again
   → Should be able to access protected page
   ```

## Troubleshooting

### Common Issues and Solutions

**Issue: Signup fails with validation error**
- Check that `password` and `re_password` match
- Ensure all required fields are filled
- For instructor: Make sure ID images are uploaded

**Issue: Login fails with "Invalid credentials"**
- Verify username and password are correct
- Check that account was created successfully
- Try signup again if needed

**Issue: Token not found after login**
- Open DevTools → Console → Look for errors
- Check Network tab for API response
- Verify login() function is storing tokens

**Issue: Protected route not working**
- Check if tokens exist in localStorage
- Verify AuthContext is wrapping your app
- Check browser console for errors

**Issue: "TypeError: Cannot read properties of undefined"**
- Ensure AuthProvider wraps your components
- Check that useAuth() is called inside AuthProvider
- Verify imports are correct

## Next Steps & Enhancements

1. **Add Token Refresh**: Implement automatic token refresh when the access token expires
2. **Add Social Auth**: Implement Facebook and Google OAuth integration  
3. **Add Password Reset**: Implement forgot password functionality
4. **Add Profile Management**: Create user profile pages with update functionality
5. **Add Role-Based Access**: Implement different permissions for students and instructors
6. **Add Remember Me**: Implement persistent login using refresh token
7. **Add Email Verification**: Add email verification step after signup
8. **Add User Profile API**: Fetch and display user information after login

## Summary

The authentication system is now fully integrated with the backend API. All three endpoints (signup, login, verify) are connected and working. The system:

- ✅ Handles user registration (students and instructors)
- ✅ Authenticates users and stores JWT tokens
- ✅ Verifies token validity
- ✅ Manages global authentication state
- ✅ Protects routes from unauthorized access
- ✅ Provides helpers for authenticated API requests
- ✅ Includes proper error handling and user feedback
- ✅ Supports bilingual interface (English/Arabic)
