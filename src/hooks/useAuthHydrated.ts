'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';

/**
 * Hook to wait for Zustand auth store to hydrate from localStorage
 * Returns true when the store is ready to use
 */
export function useAuthHydrated() {
  // Check if persist API is available (might not be during SSR)
  const persistApi = (useAuthStore as unknown as { persist?: { hasHydrated?: () => boolean; onFinishHydration?: (fn: () => void) => () => void } }).persist;

  // Initialize state synchronously based on persisted hydration status
  const alreadyHydrated = persistApi?.hasHydrated?.() ?? false;
  const [hydrated, setHydrated] = useState<boolean>(alreadyHydrated);

  useEffect(() => {
    // If persist API is not available, assume hydrated (non-persisted store)
    if (!persistApi?.onFinishHydration) {
      setHydrated(true);
      return;
    }

    // Check if already hydrated
    if (persistApi.hasHydrated?.()) {
      setHydrated(true);
      return;
    }

    // Subscribe to hydration finish events and update state when it completes
    const unsubscribe = persistApi.onFinishHydration(() => {
      setHydrated(true);
      console.log('Auth store hydration complete');
    });

    return () => {
      unsubscribe?.();
    };
  }, [persistApi]);

  return hydrated;
}
