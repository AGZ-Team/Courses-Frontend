import {getAccessToken} from './auth';

const API_BASE_URL = 'https://alaaelgharably248.pythonanywhere.com';

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

/**
 * Make an authenticated API request
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {requireAuth = false, headers = {}, ...restOptions} = options;

  const requestHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  // Add authorization header if authentication is required
  if (requireAuth) {
    const token = getAccessToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
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

  return response.json();
}

/**
 * Make an authenticated GET request
 */
export async function apiGet<T>(
  endpoint: string,
  requireAuth = false
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'GET',
    requireAuth,
  });
}

/**
 * Make an authenticated POST request
 */
export async function apiPost<T>(
  endpoint: string,
  data: unknown,
  requireAuth = false
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    requireAuth,
  });
}

/**
 * Make an authenticated PUT request
 */
export async function apiPut<T>(
  endpoint: string,
  data: unknown,
  requireAuth = true
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    requireAuth,
  });
}

/**
 * Make an authenticated PATCH request
 */
export async function apiPatch<T>(
  endpoint: string,
  data: unknown,
  requireAuth = true
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    requireAuth,
  });
}

/**
 * Make an authenticated DELETE request
 */
export async function apiDelete<T>(
  endpoint: string,
  requireAuth = true
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'DELETE',
    requireAuth,
  });
}
