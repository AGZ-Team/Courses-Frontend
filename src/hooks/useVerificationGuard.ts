'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';

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
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVerification = async () => {
      if (typeof window === 'undefined') return;

      // Check if user has access token (logged in)
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        router.push('/login');
        return;
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
          
          // Update localStorage cache
          localStorage.setItem('email_verified', JSON.stringify({
            verified: true,
            timestamp: Date.now(),
          }));
        } else {
          // Email not verified, redirect to verification page
          router.push('/auth/verify-email');
        }
      } catch (error) {
        console.error('Verification check failed:', error);
        
        // Fallback to localStorage cache in case of network error
        const cachedStatus = localStorage.getItem('email_verified');
        
        if (cachedStatus) {
          try {
            const parsed = JSON.parse(cachedStatus);
            const age = Date.now() - parsed.timestamp;
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours
            
            if (parsed.verified && age < maxAge) {
              setIsVerified(true);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.error('Failed to parse cached verification status:', e);
          }
        }
        
        // If all else fails, redirect to verification page
        router.push('/auth/verify-email');
      }
    };

    checkVerification();
  }, [router]);

  return { isVerified, loading };
}
