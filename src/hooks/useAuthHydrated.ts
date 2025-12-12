'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';

/**
 * Hook to wait for Zustand auth store to hydrate from localStorage
 * Returns true when the store is ready to use
 */
export function useAuthHydrated() {
  // Initialize state synchronously based on persisted hydration status
  const alreadyHydrated = typeof useAuthStore.persist.hasHydrated === 'function' && useAuthStore.persist.hasHydrated();
  const [hydrated, setHydrated] = useState<boolean>(alreadyHydrated ?? false);

  useEffect(() => {
    // Subscribe to hydration finish events and update state when it completes
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
      console.log('Auth store hydration complete');
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  return hydrated;
}
