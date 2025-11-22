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
    const raw = await response.text().catch(() => '');
    let message = `Request failed with status ${response.status}`;

    if (raw) {
      try {
        const data = JSON.parse(raw) as any;
        if (typeof data?.detail === 'string') {
          message = data.detail;
        } else if (typeof data?.error === 'string') {
          message = data.error;
        } else if (typeof data?.message === 'string') {
          message = data.message;
        } else if (data && typeof data === 'object') {
          // Fallback for validation-style errors, e.g. {field: ["msg1", "msg2"], ...}
          const fieldMessages: string[] = [];

          for (const [field, value] of Object.entries(data)) {
            if (!value) continue;

            if (Array.isArray(value)) {
              const text = (value as unknown[])
                .filter((v) => typeof v === 'string')
                .join(' ');
              if (text) {
                fieldMessages.push(`${field}: ${text}`);
              }
            } else if (typeof value === 'string') {
              fieldMessages.push(`${field}: ${value}`);
            }
          }

          if (fieldMessages.length > 0) {
            message = fieldMessages.join(' | ');
          }
        }
      } catch {
        message = `${message}: ${raw.slice(0, 200)}`;
      }
    }

    throw new Error(message);
  }

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
