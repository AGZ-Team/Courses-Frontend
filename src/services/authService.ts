import {
  signup,
  login,
  verifyToken,
  isAuthenticated,
  clearTokens,
  getAuthStatus,
} from '@/lib/auth';

export {
  signup,
  login,
  verifyToken,
  isAuthenticated,
  clearTokens,
  getAuthStatus,
};

export type {
  SignupData,
  LoginData,
  JWTResponse,
  SignupResponse,
} from '@/lib/auth';
