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
  uid?: string;
  token?: string;
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


      // If error is an object with field-specific errors, stringify it for parsing
      if (typeof error === 'object' && error !== null) {
        // Collect all field errors
        const fieldErrors: Record<string, string> = {};
        
        // Map backend field names to error messages
        const fieldMap = {
          username: 'username',
          email: 'email',
          password: 'password',
          first_name: 'first_name',
          last_name: 'last_name',
          phone: 'phone',
          expertise: 'expertise',
          id_front: 'id_front',
          id_back: 'id_back',
          non_field_errors: 'non_field_errors',
        };
        
        for (const [field, key] of Object.entries(fieldMap)) {
          if (error[field]) {
            fieldErrors[key] = Array.isArray(error[field]) ? error[field][0] : String(error[field]);
          }
        }
        
        // If we found field errors, throw them as JSON string for SignupForm to parse
        if (Object.keys(fieldErrors).length > 0) {
          throw new Error(JSON.stringify(fieldErrors));
        }
        
        // Check for detail message
        if (error.detail) {
          throw new Error(error.detail);
        }
      }
      
      // Fallback: throw generic message with status
      throw new Error(`Signup failed with status ${response.status}`);
    } catch (parseError) {
      // If it's already an Error we threw, re-throw it
      if (parseError instanceof Error) {
        throw parseError;
      }
      
      console.error('Signup parse error:', parseError);
      throw new Error(`Signup failed with status ${response.status}`);
    }
  }

  return response.json();
}

/**
 * Login and get JWT tokens
 */
export async function login(data: LoginData): Promise<JWTResponse> {
  // Normalize username/email: trim and lowercase if it looks like an email
  const normalizedUsername = data.username.trim();
  const isEmail = normalizedUsername.includes('@');
  const username = isEmail ? normalizedUsername.toLowerCase() : normalizedUsername;
  
  const response = await fetch(`${API_BASE_URL}/auth/jwt/create/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password: data.password,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    
    // Throw the entire error object as JSON string so LoginForm can parse it
    // This preserves all error details from the backend
    if (error.detail) {
      throw new Error(error.detail);
    } else if (error.error) {
      throw new Error(error.error);
    } else {
      // If error is an object with field-specific errors, stringify it
      throw new Error(JSON.stringify(error));
    }
  }

  const tokens = await response.json();
  
  // Store tokens in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('access', tokens.access); // Also store as 'access' for compatibility
    localStorage.setItem('username', data.username); // Store username for navbar
    
    // Store uid and token for email verification if provided by backend
    if (tokens.uid && tokens.token) {
      localStorage.setItem('verification_uid', tokens.uid);
      localStorage.setItem('verification_token', tokens.token);
    }

    // Notify UI that auth state changed (same-tab listeners)
    try {
      window.dispatchEvent(new Event('auth-changed'));
    } catch {}
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
  localStorage.removeItem('access');
  localStorage.removeItem('username');
  localStorage.removeItem('verification_uid');
  localStorage.removeItem('verification_token');

  // Notify UI that auth state changed (same-tab listeners)
  try {
    window.dispatchEvent(new Event('auth-changed'));
  } catch {}
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = getAccessToken();
  if (!token) return false;
  
  return verifyToken(token);
}
