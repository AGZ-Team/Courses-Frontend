import { cookies } from 'next/headers';
import { API_BASE_URL } from './config';

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

/**
 * Server-side authenticated API request helper.
 * 
 * Use this in API routes and server actions to make authenticated requests
 * to Django using the JWT token from HttpOnly cookies.
 * 
 * Example:
 *   const subscriptions = await apiRequestWithCookies('/subscriptions/', {
 *     method: 'GET',
 *     requireAuth: true,
 *   });
 */
export async function apiRequestWithCookies<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requireAuth = false, headers = {}, ...restOptions } = options;

  const requestHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  // Add authorization header if authentication is required
  if (requireAuth) {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      throw new Error('No access token found in cookies');
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...restOptions,
    headers: requestHeaders,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      detail: 'An error occurred',
    }));
    throw new Error(error.detail || error.message || 'Request failed');
  }

  // Check if response has content before parsing JSON
  const text = await response.text();
  if (!text) {
    return {} as T;
  }
  
  return JSON.parse(text);
}

/**
 * Server-side authenticated GET request
 */
export async function apiGetWithCookies<T>(
  endpoint: string,
  requireAuth = false
): Promise<T> {
  return apiRequestWithCookies<T>(endpoint, {
    method: 'GET',
    requireAuth,
  });
}

/**
 * Server-side authenticated POST request
 */
export async function apiPostWithCookies<T>(
  endpoint: string,
  data: unknown,
  requireAuth = false
): Promise<T> {
  return apiRequestWithCookies<T>(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    requireAuth,
  });
}

/**
 * Server-side authenticated PUT request
 */
export async function apiPutWithCookies<T>(
  endpoint: string,
  data: unknown,
  requireAuth = true
): Promise<T> {
  return apiRequestWithCookies<T>(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    requireAuth,
  });
}

/**
 * Server-side authenticated PATCH request
 */
export async function apiPatchWithCookies<T>(
  endpoint: string,
  data: unknown,
  requireAuth = true
): Promise<T> {
  return apiRequestWithCookies<T>(endpoint, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    requireAuth,
  });
}

/**
 * Server-side authenticated DELETE request
 */
export async function apiDeleteWithCookies<T>(
  endpoint: string,
  requireAuth = true
): Promise<T> {
  return apiRequestWithCookies<T>(endpoint, {
    method: 'DELETE',
    requireAuth,
  });
}
