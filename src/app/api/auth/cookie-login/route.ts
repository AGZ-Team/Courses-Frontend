import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/config';

/**
 * POST /api/auth/cookie-login
 * 
 * Receives username/password from client, authenticates with Django,
 * and sets JWT tokens as HttpOnly secure cookies.
 * 
 * Request body: { username, password }
 * Response: { success: boolean, uid?: string, token?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Call Django backend to get JWT tokens
    const response = await fetch(`${API_BASE_URL}/auth/jwt/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.detail || 'Login failed' },
        { status: response.status }
      );
    }

    // Set HttpOnly secure cookies
    const nextResponse = NextResponse.json(
      {
        success: true,
        uid: data.uid,
        token: data.token,
      },
      { status: 200 }
    );

    // Set access token cookie (HttpOnly, Secure, SameSite)
    nextResponse.cookies.set('access_token', data.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Set refresh token cookie (HttpOnly, Secure, SameSite)
    if (data.refresh) {
      nextResponse.cookies.set('refresh_token', data.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
    }

    // Optionally store username in a non-HttpOnly cookie for client-side access
    nextResponse.cookies.set('username', username, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return nextResponse;
  } catch (error) {
    console.error('Cookie login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
