import type { AdminUser } from '@/types/adminUser';

// Cache with TTL for admin users within a browser session.
// This avoids excessive refetching while ensuring data freshness.
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let adminUsersCache: CacheEntry<AdminUser[]> | null = null;

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    return res.json();
  }

  let message = 'Request failed';
  try {
    const data = await res.json();
    if (typeof data?.detail === 'string') message = data.detail;
    else if (typeof data?.error === 'string') message = data.error;
  } catch {
    // ignore JSON parse errors
  }

  throw new Error(message);
}

/**
 * Fetch admin users with cache support
 * @param forceRefresh - If true, bypass cache and fetch fresh data
 */
export async function fetchAdminUsers(forceRefresh = false): Promise<AdminUser[]> {
  const now = Date.now();
  
  // Check cache validity
  if (
    !forceRefresh &&
    adminUsersCache &&
    now - adminUsersCache.timestamp < CACHE_TTL
  ) {
    return adminUsersCache.data;
  }

  // Fetch fresh data
  const res = await fetch('/api/admin/users', {
    method: 'GET',
    credentials: 'include',
  });
  const data = await handleResponse<AdminUser[]>(res);
  
  // Update cache
  adminUsersCache = {
    data,
    timestamp: now,
  };
  
  return data;
}

/**
 * Invalidate the admin users cache
 * Call this after mutations to ensure fresh data on next fetch
 */
export function invalidateAdminUsersCache() {
  adminUsersCache = null;
}

export async function fetchAdminUser(id: number): Promise<AdminUser> {
  const res = await fetch(`/api/admin/users/${id}`, {
    method: 'GET',
    credentials: 'include',
  });
  return handleResponse<AdminUser>(res);
}

export async function updateAdminUser(
  id: number,
  data: Partial<AdminUser>
): Promise<AdminUser> {
  const res = await fetch(`/api/admin/users/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const updated = await handleResponse<AdminUser>(res);

  // Keep cache in sync if it exists
  if (adminUsersCache) {
    adminUsersCache.data = adminUsersCache.data.map((user) =>
      user.id === id ? updated : user
    );
  }

  return updated;
}

export async function updateAdminUserWithFiles(
  id: number,
  formData: FormData
): Promise<AdminUser> {
  const res = await fetch(`/api/admin/users/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    // Don't set Content-Type header - browser will set multipart/form-data
    body: formData,
  });
  const updated = await handleResponse<AdminUser>(res);

  // Keep cache in sync if it exists
  if (adminUsersCache) {
    adminUsersCache.data = adminUsersCache.data.map((user) =>
      user.id === id ? updated : user
    );
  }

  return updated;
}

export async function deleteAdminUser(id: number): Promise<void> {
  const res = await fetch(`/api/admin/users/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  await handleResponse<unknown>(res);

  // Remove from cache if present
  if (adminUsersCache) {
    adminUsersCache.data = adminUsersCache.data.filter((user) => user.id !== id);
  }
}
