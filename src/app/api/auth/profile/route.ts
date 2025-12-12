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

    console.log('=== PROFILE UPDATE REQUEST ===');
    console.log('Updating profile with data:', JSON.stringify(data, null, 2));
    console.log('Access token present:', !!accessToken);
    console.log('API Base URL:', process.env.API_BASE_URL || 'https://api.cr-ai.cloud');
    console.log('Endpoint: PATCH /auth/users/me/');

    // Validate that we're not sending empty username or email (common Django validation rules)
    if (data.username !== undefined && data.username.trim() === '') {
      return NextResponse.json({ 
        error: 'Username cannot be empty' 
      }, { status: 400 });
    }

    if (data.email !== undefined && data.email.trim() === '') {
      return NextResponse.json({ 
        error: 'Email cannot be empty' 
      }, { status: 400 });
    }

    try {
      // Call Django backend /auth/users/me with PATCH
      const updatedUser = await apiPatchWithCookies('/auth/users/me/', data, true);
      
      console.log('✓ Profile updated successfully:', updatedUser);
      
      return NextResponse.json(updatedUser);
    } catch (backendError) {
      console.error('✗ Backend API Error:', backendError);
      console.error('Error type:', backendError instanceof Error ? backendError.constructor.name : typeof backendError);
      console.error('Error message:', backendError instanceof Error ? backendError.message : String(backendError));
      
      // Return more detailed error information
      return NextResponse.json({ 
        error: backendError instanceof Error ? backendError.message : 'Failed to update profile',
        details: backendError instanceof Error ? backendError.stack : undefined
      }, { status: 500 });
    }
  } catch (error) {
    console.error('✗ Request parsing error:', error);
    const message = error instanceof Error ? error.message : 'Failed to process request';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
