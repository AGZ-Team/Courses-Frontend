'use client';

import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  clearTokens,
  verifyToken,
  isAuthenticated as checkAuth,
} from '@/services/authService';
import {useAuthStore} from '@/stores/authStore';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  checkAuthentication: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const { clearAuth } = useAuthStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthentication = React.useCallback(async () => {
    setIsLoading(true);
    const authenticated = await checkAuth();
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      void checkAuthentication();
    }, 0);

    return () => clearTimeout(id);
  }, [checkAuthentication]);

  const logout = async () => {
    await clearTokens();
    clearAuth(); // Clear Zustand store
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{isAuthenticated, isLoading, logout, checkAuthentication}}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
