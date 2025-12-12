/**
 * User Profile Service
 * Handles fetching and updating user profile data
 */

interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  bio?: string;
  area_of_expertise?: string;
  picture?: string;
  id_card_face?: string;
  id_card_back?: string;
  is_instructor: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
}

/**
 * Fetch current user profile data
 * GET /auth/users/me
 */
export async function fetchUserProfile(): Promise<UserProfile> {
  const response = await fetch('/api/auth/profile', {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch user profile');
  }

  return response.json();
}

/**
 * Update current user profile data
 * PATCH /auth/users/me
 */
export async function updateUserProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  const response = await fetch('/api/auth/profile', {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update user profile');
  }

  return response.json();
}

/**
 * Update user profile with file uploads (picture, ID cards)
 */
export async function updateUserProfileWithFiles(formData: FormData): Promise<UserProfile> {
  const response = await fetch('/api/auth/profile', {
    method: 'PATCH',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update user profile');
  }

  return response.json();
}
