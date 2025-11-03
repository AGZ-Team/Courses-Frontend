// Authentication API utilities

const API_BASE_URL = 'https://alaaelgharably248.pythonanywhere.com';

export interface SignupData {
  username: string;
  email: string;
  password: string;
  re_password: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
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
  
  formData.append('username', data.username);
  formData.append('email', data.email);
  formData.append('password', data.password);
  formData.append('re_password', data.re_password);
  formData.append('first_name', data.first_name);
  formData.append('last_name', data.last_name);
  
  if (data.phone_number) {
    formData.append('phone_number', data.phone_number);
  }
  
  if (data.expertise) {
    formData.append('expertise', data.expertise);
  }
  
  if (data.is_instructor !== undefined) {
    formData.append('is_instructor', String(data.is_instructor));
  }
  
  if (data.id_front) {
    formData.append('id_front', data.id_front);
  }
  
  if (data.id_back) {
    formData.append('id_back', data.id_back);
  }

  const response = await fetch(`${API_BASE_URL}/auth/users/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || error.message || 'Signup failed');
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
