'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Hook to check if user's email is verified
 * Redirects to verification page if not verified
 * Used on protected pages that require email verification
 */
export function useVerificationGuard() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVerification = () => {
      if (typeof window === 'undefined') return;

      // Check if user has access token (logged in)
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        router.push('/login');
        return;
      }

      // Check if email is verified (stored in sessionStorage after verification)
      const verificationStatus = sessionStorage.getItem('email_verified');
      
      if (verificationStatus === 'true') {
        // Email is verified
        setIsVerified(true);
        setLoading(false);
      } else {
        // Email not verified, redirect to verification page
        router.push('/auth/verify-email');
      }
    };

    checkVerification();
  }, [router]);

  return { isVerified, loading };
}
