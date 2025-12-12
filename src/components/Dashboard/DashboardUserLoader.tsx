'use client';

import { useEffect } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';

/**
 * Dashboard User Loader
 * Fetches and stores user profile data in Zustand on dashboard load
 * Sidebar renders immediately with role-based items
 * Main content shows loading indicator while user data loads
 */
export function DashboardUserLoader({ children }: { children: React.ReactNode }) {
  const { user, loading, error } = useUserProfile();

  useEffect(() => {
    if (error) {
      console.error('Failed to load user profile:', error);
    }
  }, [error]);

  // Render children normally - sidebar will be visible with static items
  // Main content will show loading state from the dashboard page
  return <>{children}</>;
}
