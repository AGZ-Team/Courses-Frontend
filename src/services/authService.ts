import {
  signup,
  login,
  verifyToken,
  isAuthenticated,
  getAccessToken,
  getRefreshToken,
  clearTokens,
  getAuthStatus,
} from '@/lib/auth';

export {
  signup,
  login,
  verifyToken,
  isAuthenticated,
  getAccessToken,
  getRefreshToken,
  clearTokens,
  getAuthStatus,
};

export type {
  SignupData,
  LoginData,
  JWTResponse,
  SignupResponse,
} from '@/lib/auth';
