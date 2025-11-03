'use client';

import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  getAccessToken,
  clearTokens,
  verifyToken,
  isAuthenticated as checkAuth,
} from '@/lib/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  checkAuthentication: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthentication = async () => {
    setIsLoading(true);
    const authenticated = await checkAuth();
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const logout = () => {
    clearTokens();
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
