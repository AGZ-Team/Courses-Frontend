import type { AdminUser } from '@/types/adminUser';

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
  const res = await fetch('/api/admin/users', {
    method: 'GET',
    credentials: 'include',
  });
  return handleResponse<AdminUser[]>(res);
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
  return handleResponse<AdminUser>(res);
}

export async function deleteAdminUser(id: number): Promise<void> {
  const res = await fetch(`/api/admin/users/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  await handleResponse<unknown>(res);
}
