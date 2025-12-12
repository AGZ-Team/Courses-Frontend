/**
 * Authentication Store
 * Manages user authentication state and verification status
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
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

interface AuthState {
  // User data
  user: User | null;
  
  // Verification status
  isVerified: boolean | null;
  verificationTimestamp: number | null;
  
  // Loading states
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setVerified: (verified: boolean) => void;
  clearAuth: () => void;
  updateUser: (userData: Partial<User>) => void;
  
  // Getters
  isInstructor: () => boolean;
  isSuperuser: () => boolean;
  isStaff: () => boolean;
  shouldShowManagementHub: () => boolean;
  shouldShowMyContent: () => boolean;
  shouldShowIdCards: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isVerified: null,
      verificationTimestamp: null,
      isLoading: false,
      
      // Actions
      setUser: (user) => set({ user, isLoading: false }),
      
      setVerified: (verified) => set({ 
        isVerified: verified,
        verificationTimestamp: Date.now(),
      }),
      
      clearAuth: () => set({ 
        user: null, 
        isVerified: null,
        verificationTimestamp: null,
        isLoading: false,
      }),
      
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null,
      })),
      
      // Getters
      isInstructor: () => {
        const { user } = get();
        return user?.is_instructor === true;
      },
      
      isSuperuser: () => {
        const { user } = get();
        return user?.is_superuser === true;
      },
      
      isStaff: () => {
        const { user } = get();
        return user?.is_staff === true;
      },
      
      shouldShowManagementHub: () => {
        const { user } = get();
        // Only superusers see full management hub
        return user?.is_superuser === true;
      },
      
      shouldShowMyContent: () => {
        const { user } = get();
        // Instructors and superusers see "My Content"
        return user?.is_instructor === true || user?.is_superuser === true;
      },
      
      shouldShowIdCards: () => {
        const { user } = get();
        // Only instructors and superusers can see/edit ID cards
        return user?.is_instructor === true || user?.is_superuser === true;
      },
    }),
    {
      name: 'auth-storage',
      // Only persist user and verification data, not loading states
      partialize: (state) => ({
        user: state.user,
        isVerified: state.isVerified,
        verificationTimestamp: state.verificationTimestamp,
      }),
    }
  )
);
