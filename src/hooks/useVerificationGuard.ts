'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useAuthStore } from '@/stores/authStore';

/**
 * Hook to check if user's email is verified
 * Redirects to verification page if not verified
 * Used on protected pages that require email verification
 * 
 * Now uses:
 * - i18n routing for proper locale handling
 * - Backend API call for reliable verification status
 * - localStorage fallback for offline scenarios
 */
export function useVerificationGuard() {
  const router = useRouter();
  const { isVerified: storeVerified, setVerified, verificationTimestamp } = useAuthStore();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVerification = async () => {
      if (typeof window === 'undefined') return;

      // Check if we have a recent cached verification status (< 24 hours old)
      if (storeVerified && verificationTimestamp) {
        const age = Date.now() - verificationTimestamp;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (age < maxAge) {
          setIsVerified(true);
          setLoading(false);
          return;
        }
      }

      try {
        // Check backend for actual verification status (most reliable)
        const response = await fetch('/api/auth/check-verification', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok && data.verified) {
          // Email is verified according to backend
          setIsVerified(true);
          setLoading(false);
          
          // Update Zustand store
          setVerified(true);
        } else {
          // Email not verified, redirect to verification page
          router.push('/auth/verify-email');
        }
      } catch (error) {
        console.error('Verification check failed:', error);
        
        // Fallback to Zustand store cache in case of network error
        if (storeVerified && verificationTimestamp) {
          const age = Date.now() - verificationTimestamp;
          const maxAge = 24 * 60 * 60 * 1000; // 24 hours
          
          if (age < maxAge) {
            setIsVerified(true);
            setLoading(false);
            return;
          }
        }
        
        // If all else fails, redirect to verification page
        router.push('/auth/verify-email');
      }
    };

    checkVerification();
  }, [router, storeVerified, verificationTimestamp, setVerified]);

  return { isVerified, loading };
}
