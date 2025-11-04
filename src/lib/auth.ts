// Authentication API utilities

const API_BASE_URL = 'https://alaaelgharably248.pythonanywhere.com';

export interface SignupData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  expertise?: string;
  id_front?: File;
  id_back?: File;
  is_instructor?: boolean;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface JWTResponse {
  access: string;
  refresh: string;
}

export interface SignupResponse {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

/**
 * Sign up a new user
 */
export async function signup(data: SignupData): Promise<SignupResponse> {
  const formData = new FormData();
  
  // Append required fields
  formData.append('username', data.username.trim());
  formData.append('email', data.email.trim().toLowerCase());
  formData.append('password', data.password);
  formData.append('first_name', data.first_name.trim());
  formData.append('last_name', data.last_name.trim());
  formData.append('phone', data.phone.trim());
  formData.append('is_instructor', String(data.is_instructor || false));
  
  // Only append optional fields if they have values
  if (data.expertise && data.expertise.trim()) {
    formData.append('expertise', data.expertise.trim());
  }
  
  // Only append files if they exist
  if (data.id_front && data.id_front instanceof File) {
    formData.append('id_front', data.id_front);
  }
  
  if (data.id_back && data.id_back instanceof File) {
    formData.append('id_back', data.id_back);
  }

  const response = await fetch(`${API_BASE_URL}/auth/users/`, {
    method: 'POST',
    body: formData,
    // Don't set Content-Type header - browser will set it automatically for FormData
  });

  if (!response.ok) {
    try {
      const error = await response.json();
      console.error('Signup error details:', error);
      throw new Error(
        error.detail || 
        error.message || 
        JSON.stringify(error) || 
        'Signup failed'
      );
    } catch (parseError) {
      throw new Error(`Signup failed with status ${response.status}`);
    }
  }

  return response.json();
}

/**
 * Login and get JWT tokens
 */
export async function login(data: LoginData): Promise<JWTResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/jwt/create/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Login failed');
  }

  const tokens = await response.json();
  
  // Store tokens in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
  }
  
  return tokens;
}

/**
 * Verify JWT token
 */
export async function verifyToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/jwt/verify/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get stored access token
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

/**
 * Get stored refresh token
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

/**
 * Remove stored tokens (logout)
 */
export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = getAccessToken();
  if (!token) return false;
  
  return verifyToken(token);
}
