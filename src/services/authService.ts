import {
  signup,
  login,
  verifyToken,
  isAuthenticated,
  getAccessToken,
  getRefreshToken,
  clearTokens,
} from '@/lib/auth';

export {
  signup,
  login,
  verifyToken,
  isAuthenticated,
  getAccessToken,
  getRefreshToken,
  clearTokens,
};

export type {
  SignupData,
  LoginData,
  JWTResponse,
  SignupResponse,
} from '@/lib/auth';
