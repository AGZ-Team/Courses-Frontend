'use client';

import {useAuth} from '@/contexts/AuthContext';
import {useRouter} from 'next/navigation';

export default function UserAuthStatus() {
  const {isAuthenticated, isLoading, logout} = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-600"></div>
        <span>Loading...</span>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-700">Logged in</span>
        <button
          onClick={() => {
            logout();
            router.push('/');
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => router.push('/login')}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
      >
        Login
      </button>
      <button
        onClick={() => router.push('/signup')}
        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
      >
        Sign Up
      </button>
    </div>
  );
}
