import type { AdminUser } from '@/types/adminUser';

// Simple in-memory cache for admin users within a single browser session.
// This avoids refetching the list when navigating back to the Users view
// while keeping the implementation lightweight (no extra libraries).
let adminUsersCache: AdminUser[] | null = null;

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

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  // If we already loaded users in this session, reuse them.
  // UsersPanel keeps its own state and updates this cache on
  // mutations via update/delete calls below.
  if (adminUsersCache) {
    return adminUsersCache;
  }

  const res = await fetch('/api/admin/users', {
    method: 'GET',
    credentials: 'include',
  });
  const data = await handleResponse<AdminUser[]>(res);
  adminUsersCache = data;
  return data;
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
    adminUsersCache = adminUsersCache.map((user) =>
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
    adminUsersCache = adminUsersCache.filter((user) => user.id !== id);
  }
}
