import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_BASE_URL } from '@/lib/config';

/**
 * GET /api/auth/check
 * 
 * Verifies if the user is authenticated by checking the access_token cookie
 * and validating it with Django.
 * 
 * Response: { isAuthenticated: boolean, username?: string }
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    const username = cookieStore.get('username')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { isAuthenticated: false },
        { status: 200 }
      );
    }

    // Verify token with Django
    const response = await fetch(`${API_BASE_URL}/auth/jwt/verify/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: accessToken }),
    });

    const isValid = response.ok;

    return NextResponse.json(
      {
        isAuthenticated: isValid,
        username: isValid ? username : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { isAuthenticated: false },
      { status: 200 }
    );
  }
}
