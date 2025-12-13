// Authentication API utilities
import {API_BASE_URL} from './config';
import {
  loginWithCookie,
  logoutWithCookie,
  checkAuthStatus,
  type CheckAuthResponse,
} from './authCookie';

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
    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
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
    } else {
      // Non-JSON response (likely HTML error page)
      let errorText = 'Server error occurred';
      try {
        const text = await response.text();
        // Try to extract error from HTML if possible
        if (text.includes('OSError')) {
          errorText = 'Server is unable to send verification email. Please try again later or contact support.';
        } else if (text.includes('500')) {
          errorText = 'Internal server error. Please try again later.';
        } else if (response.status === 404) {
          errorText = 'Signup endpoint not found. Please contact support.';
        } else if (response.status === 403) {
          errorText = 'Access forbidden. Please check your credentials.';
        }
      } catch {
        // If text parsing fails, use generic message
      }
      
      throw new Error(errorText);
    }
  }

  return response.json();
}

/**
 * Login and get JWT tokens via cookie-based API route.
 * Tokens are stored in HttpOnly cookies on the server.
 */
export async function login(data: LoginData): Promise<JWTResponse> {
  // Normalize username/email: trim and lowercase if it looks like an email
  const normalizedUsername = data.username.trim();
  const isEmail = normalizedUsername.includes('@');
  const username = isEmail ? normalizedUsername.toLowerCase() : normalizedUsername;
  
  // Call cookie-based login endpoint
  const result = await loginWithCookie(username, data.password);

  if (!result.success) {
    throw new Error(result.error || 'Login failed');
  }

  // Notify UI that auth state changed (same-tab listeners)
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new Event('auth-changed'));
    } catch {}
  }

  // Return response with uid/token for email verification flow
  return {
    access: '', // Not exposed to client anymore
    refresh: '', // Not exposed to client anymore
    uid: result.uid,
    token: result.token,
  };
}

/**
 * Verify JWT token (legacy - kept for compatibility)
 * Now delegates to server-side check
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
 * Get stored access token (legacy - kept for compatibility)
 * Tokens are now in HttpOnly cookies, not accessible from client
 */
// export function getAccessToken(): string | null {
//   // Tokens are stored in HttpOnly cookies on the server
//   // Client code should not try to access them
//   return null;
// }

// /**
//  * Get stored refresh token (legacy - kept for compatibility)
//  * Tokens are now in HttpOnly cookies, not accessible from client
//  */
// export function getRefreshToken(): string | null {
//   // Tokens are stored in HttpOnly cookies on the server
//   // Client code should not try to access them
//   return null;
// }

/**
 * Remove stored tokens (logout) via cookie-based API route
 */
export async function clearTokens(): Promise<void> {
  try {
    await logoutWithCookie();
    
    // Notify UI that auth state changed (same-tab listeners)
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new Event('auth-changed'));
      } catch {}
    }
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
}

/**
 * Check if user is authenticated via server-side check
 */
export async function isAuthenticated(): Promise<boolean> {
  const result = await checkAuthStatus();
  return result.isAuthenticated;
}

/**
 * Get full auth status (including username) via server-side cookie-based check.
 */
export async function getAuthStatus(): Promise<CheckAuthResponse> {
  return checkAuthStatus();
}
