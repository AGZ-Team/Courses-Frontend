/**
 * User Profile API Route
 * GET /api/auth/profile - Get current user data
 * PATCH /api/auth/profile - Update current user data
 */

import { NextRequest, NextResponse } from 'next/server';
import { apiGetWithCookies, apiPatchWithCookies } from '@/lib/apiWithCookies';

/**
 * GET /api/auth/profile
 * Fetch current user profile data from Django backend
 */
export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('access_token')?.value;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Call Django backend /auth/users/me
    const userData = await apiGetWithCookies('/auth/users/me/', true);
    
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch user profile';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/auth/profile
 * Update current user profile data
 */
export async function PATCH(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('access_token')?.value;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Parse JSON data (no FormData support for now, just JSON updates)
    const data = await request.json();

    console.log('Updating profile with data:', data);

    // Call Django backend /auth/users/me with PATCH
    const updatedUser = await apiPatchWithCookies('/auth/users/me/', data, true);
    
    console.log('Profile updated successfully:', updatedUser);
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    const message = error instanceof Error ? error.message : 'Failed to update user profile';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
