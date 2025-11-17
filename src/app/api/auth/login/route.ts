import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/config';

/**
 * API route to handle login requests
 * Proxies the request to the backend to avoid CORS issues
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Call the backend API
    const response = await fetch(
      `${API_BASE_URL}/auth/jwt/create/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Backend login error:', {
        status: response.status,
        data,
      });

      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Login API error:', error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
