import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/cookie-logout
 * 
 * Clears all auth-related cookies.
 * 
 * Response: { success: boolean }
 */
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );

    // Clear all auth cookies
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    response.cookies.delete('username');
    response.cookies.delete('verification_uid');
    response.cookies.delete('verification_token');

    return response;
  } catch (error) {
    console.error('Cookie logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
