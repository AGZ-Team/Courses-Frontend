/**
 * Hook to load user profile data
 * Automatically fetches user data on mount and stores it in Zustand
 */

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { fetchUserProfile } from '@/services/userProfileService';

interface ProfileWithRoles {
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

export function useUserProfile() {
  const { user, setUser, setRolesLoading } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // Only fetch profile once on initial mount
    // Don't re-fetch on every render or when sidebar needs roles
    // This prevents the skeleton from appearing/disappearing during navigation
    if (hasInitialized) {
      console.log('[useUserProfile] Already initialized, skipping re-fetch')
      return;
    }

    const loadProfile = async () => {
      console.log('[useUserProfile] Starting profile load... (first time only)')
      setLoading(true);
      
      // Only set rolesLoading if we don't have cached user data
      // This prevents the Management Hub from flickering on subsequent visits
      if (!user) {
        setRolesLoading(true);
      }
      
      setError(null);

      try {
        const profile = await fetchUserProfile();
        // Log the full profile object returned from the backend (dev only)
        if (process.env.NODE_ENV !== 'production') {
          try {
            console.log('[useUserProfile] Full profile from backend:', JSON.stringify(profile, null, 2));
          } catch {
            console.log('[useUserProfile] Full profile from backend (raw):', profile);
          }
        }
        // Also log explicit media-related fields for quick visibility
        console.log('[useUserProfile] Media fields:', {
          picture: profile.picture,
          id_front: profile.id_card_face ?? null,
          id_back: profile.id_card_back ?? null,
        });
        console.log('[useUserProfile] Profile fetched:', {
          id: profile.id,
          first_name: profile.first_name,
          is_instructor: profile.is_instructor,
          is_superuser: profile.is_superuser,
        });

        // Derive missing role flags when backend omits them
        const derived: ProfileWithRoles = {
          ...profile,
          is_instructor: profile.is_instructor ?? false,
          is_staff: profile.is_staff ?? false,
          is_superuser: profile.is_superuser ?? false,
          is_active: profile.is_active ?? true,
        };

        // If backend doesn't include is_instructor, infer from area_of_expertise or ID cards
        if (!derived.is_instructor && (profile.area_of_expertise || profile.id_card_face || profile.id_card_back)) {
          derived.is_instructor = true;
          console.log('Inferred is_instructor=true from profile fields');
        }

        // If is_superuser is false, attempt lightweight admin check
        if (!derived.is_superuser) {
          try {
            const adminResp = await fetch('/api/admin/users', {
              method: 'GET',
              credentials: 'include',
            });

            if (adminResp.ok) {
              derived.is_superuser = true;
              console.log('User has admin access - set is_superuser=true');
            } else {
              console.log('Admin check failed with status:', adminResp.status);
            }
          } catch (adminError) {
            console.log('Admin access check error:', adminError instanceof Error ? adminError.message : 'unknown');
          }
        }

        console.log('Profile loaded with roles:', {
          is_superuser: derived.is_superuser,
          is_instructor: derived.is_instructor,
          is_staff: derived.is_staff,
        });

        setUser(derived); // This also sets rolesLoading to false via setUser
        // REMOVED: lockRoles() - Don't lock roles permanently, allow rolesLoading during updates
        console.log('[useUserProfile] Profile loaded, rolesLoading can now be used for updates')
        setHasInitialized(true); // Mark as initialized AFTER successful load
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
        setError(errorMessage);
        setRolesLoading(false); // Set to false even on error
        setHasInitialized(true); // Mark as initialized even on error to prevent retries
        console.error('[useUserProfile] Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [hasInitialized, user, setUser, setRolesLoading]); // Only run on mount or if reset

  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const profile = await fetchUserProfile();
      console.log('[useUserProfile] Refetch profile:', {
        id: profile.id,
        first_name: profile.first_name,
        is_instructor: profile.is_instructor,
        is_superuser: profile.is_superuser,
      });

      // Derive missing role flags when backend omits them (same logic as initial load)
      const derived: ProfileWithRoles = {
        ...profile,
        is_instructor: profile.is_instructor ?? false,
        is_staff: profile.is_staff ?? false,
        is_superuser: profile.is_superuser ?? false,
        is_active: profile.is_active ?? true,
      };

      // If backend doesn't include is_instructor, infer from area_of_expertise or ID cards
      if (!derived.is_instructor && (profile.area_of_expertise || profile.id_card_face || profile.id_card_back)) {
        derived.is_instructor = true;
        console.log('[useUserProfile] Refetch: Inferred is_instructor=true from profile fields');
      }

      // If is_superuser is false, attempt lightweight admin check
      if (!derived.is_superuser) {
        try {
          const adminResp = await fetch('/api/admin/users', {
            method: 'GET',
            credentials: 'include',
          });

          if (adminResp.ok) {
            derived.is_superuser = true;
            console.log('[useUserProfile] Refetch: User has admin access - set is_superuser=true');
          }
        } catch (adminError) {
          console.log('[useUserProfile] Refetch: Admin access check error:', adminError instanceof Error ? adminError.message : 'unknown');
        }
      }

      console.log('[useUserProfile] Refetch complete with roles:', {
        is_superuser: derived.is_superuser,
        is_instructor: derived.is_instructor,
        is_staff: derived.is_staff,
      });

      setUser(derived); // This also sets rolesLoading to false
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
      setError(errorMessage);
      console.error('[useUserProfile] Failed to refetch user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    refetch,
  };
}
