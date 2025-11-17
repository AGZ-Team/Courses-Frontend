/**
 * Client-side auth utilities for cookie-based authentication.
 * 
 * These functions call Next API routes that manage HttpOnly cookies.
 * The actual JWT tokens are never exposed to client JS.
 */

export interface LoginResponse {
  success: boolean;
  error?: string;
  uid?: string;
  token?: string;
}

export interface LogoutResponse {
  success: boolean;
  error?: string;
}

export interface CheckAuthResponse {
  isAuthenticated: boolean;
  username?: string;
}

/**
 * Login via cookie-based API route.
 * Sets HttpOnly cookies on the server.
 */
export async function loginWithCookie(
  username: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await fetch('/api/auth/cookie-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include', // Include cookies in request
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    };
  }
}

/**
 * Logout via cookie-based API route.
 * Clears HttpOnly cookies on the server.
 */
export async function logoutWithCookie(): Promise<LogoutResponse> {
  try {
    const response = await fetch('/api/auth/cookie-logout', {
      method: 'POST',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Logout failed');
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Logout failed',
    };
  }
}

/**
 * Check if user is authenticated.
 * Calls Next API route which verifies token with Django.
 */
export async function checkAuthStatus(): Promise<CheckAuthResponse> {
  try {
    const response = await fetch('/api/auth/check', {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { isAuthenticated: false };
  }
}
