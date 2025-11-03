import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/verify-email
 * 
 * Retrieves uid/token from secure cookie and calls Djoser backend
 * to activate/verify the user's email.
 * 
 * Response: { success: boolean, message: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Get uid and token from secure cookie
    const cookieStore = await cookies();
    const verifyContextCookie = cookieStore.get('verify_context');

    if (!verifyContextCookie) {
      return NextResponse.json(
        { success: false, message: 'Verification session expired. Please request a new verification email.' },
        { status: 401 }
      );
    }

    let verifyContext;
    try {
      verifyContext = JSON.parse(verifyContextCookie.value);
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid verification session' },
        { status: 401 }
      );
    }

    const { uid, token } = verifyContext;

    if (!uid || !token) {
      return NextResponse.json(
        { success: false, message: 'Verification session is invalid' },
        { status: 401 }
      );
    }

    // Call Djoser backend to activate/verify email
    const response = await fetch(
      'https://alaaelgharably248.pythonanywhere.com/auth/users/activation/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid,
          token,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          success: false,
          message: errorData.detail || 'Failed to verify email. Please try again.',
        },
        { status: response.status }
      );
    }

    // Clear the verify context cookie on success
    cookieStore.delete('verify_context');

    return NextResponse.json(
      { success: true, message: 'Email verified successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
