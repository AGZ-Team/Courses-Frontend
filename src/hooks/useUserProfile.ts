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
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we already have user data, don't fetch again
    if (user) {
      return;
    }

    const loadProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const profile = await fetchUserProfile();

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

        setUser(derived);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
        setError(errorMessage);
        console.error('Failed to load user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, setUser]);

  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const profile = await fetchUserProfile();
      setUser(profile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
      setError(errorMessage);
      console.error('Failed to load user profile:', err);
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
