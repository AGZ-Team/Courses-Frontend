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
  rolesLoading: boolean; // Track when data is being updated
  lockedRoles: { is_superuser: boolean; is_instructor: boolean; is_staff: boolean } | null; // Locked role state during loading
  
  // Actions
  setUser: (user: User | null) => void;
  setVerified: (verified: boolean) => void;
  clearAuth: () => void;
  updateUser: (userData: Partial<User>) => void;
  setRolesLoading: (loading: boolean) => void;
  startRoleUpdate: () => void; // Locks current roles before update
  lockRoles: () => void;
  
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
      rolesLoading: false,
      lockedRoles: null,
      
      // Actions
      setUser: (user) => set({ user, isLoading: false, rolesLoading: false }),
      
      setVerified: (verified) => set({ 
        isVerified: verified,
        verificationTimestamp: Date.now(),
      }),
      
      clearAuth: () => set({ 
        user: null, 
        isVerified: null,
        verificationTimestamp: null,
        isLoading: false,
        rolesLoading: false,
        lockedRoles: null,
      }),
      
      startRoleUpdate: () => {
        const { user } = get();
        if (user) {
          // Lock the current role state before loading
          set({
            rolesLoading: true,
            lockedRoles: {
              is_superuser: user.is_superuser,
              is_instructor: user.is_instructor,
              is_staff: user.is_staff,
            }
          });
        }
      },
      
      setRolesLoading: (loading) => {
        set({ rolesLoading: loading });
        // Clear locked roles when loading finishes
        if (!loading) {
          set({ lockedRoles: null });
        }
      },
      
      lockRoles: () => {
        // No-op: kept for backward compatibility but not used
      },
      
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null,
        rolesLoading: false,
        lockedRoles: null, // Clear locked roles
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
