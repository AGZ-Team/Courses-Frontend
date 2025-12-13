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
  // Clean up data: remove undefined values and empty strings (except for intentional empty values)
  const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
    // Only include defined values
    if (value !== undefined && value !== null) {
      acc[key] = value as unknown;
    }
    return acc;
  }, {} as Record<string, unknown>);

  console.log('Sending PATCH request to /api/auth/profile with data:', cleanData);

  const response = await fetch('/api/auth/profile', {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cleanData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
    console.error('Profile update failed:', {
      status: response.status,
      statusText: response.statusText,
      errorData
    });
    throw new Error(errorMessage);
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
    
    // Get the error message from backend (could be structured or plain text)
    let errorMessage = '';
    
    // Try to extract specific field errors first (Django returns dict of field -> [errors])
    if (typeof errorData === 'object' && errorData !== null) {
      const fieldErrors: string[] = [];
      
      // Check for field-specific errors (like picture: ["error message"])
      ['picture', 'id_card_face', 'id_card_back'].forEach(field => {
        if (errorData[field]) {
          const errors = Array.isArray(errorData[field]) ? errorData[field] : [errorData[field]];
          fieldErrors.push(...errors.filter((e: any) => typeof e === 'string'));
        }
      });
      
      if (fieldErrors.length > 0) {
        errorMessage = fieldErrors.join(', ');
      } else {
        // Try generic error/message fields
        errorMessage = errorData.error || errorData.message || '';
      }
    }
    
    // Fallback to status text if no error message found
    if (!errorMessage) {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    
    console.error('Profile update failed:', {
      status: response.status,
      statusText: response.statusText,
      fullErrorData: errorData,
      parsedMessage: errorMessage,
      rawResponse: response
    });
    
    // Make 413 error message clearer for users
    if (response.status === 413) {
      errorMessage = 'File too large. Each image must be under 1MB';
    }
    
    throw new Error(errorMessage);
  }

  return response.json();
}
