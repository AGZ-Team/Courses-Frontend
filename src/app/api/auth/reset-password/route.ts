import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/config';
import { validatePassword, validateConfirmPassword } from '@/lib/validation';

/**
 * POST /api/auth/reset-password
 * 
 * Receives new password from client, retrieves uid/token from secure cookie,
 * and calls Djoser backend to confirm password reset.
 * 
 * Request body: { newPassword, confirmPassword }
 * Response: { success: boolean, message: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { newPassword, confirmPassword } = body;

    // Validate input
    if (!newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Password fields are required' },
        { status: 400 }
      );
    }

    // Validate password using centralized validation
    const passwordError = validatePassword(newPassword, 'en');
    if (passwordError) {
      return NextResponse.json(
        { success: false, message: passwordError },
        { status: 400 }
      );
    }

    // Validate password confirmation
    const confirmError = validateConfirmPassword(newPassword, confirmPassword, 'en');
    if (confirmError) {
      return NextResponse.json(
        { success: false, message: confirmError },
        { status: 400 }
      );
    }

    // Get uid and token from secure cookie
    const cookieStore = await cookies();
    const resetContextCookie = cookieStore.get('reset_context');

    if (!resetContextCookie) {
      return NextResponse.json(
        { success: false, message: 'Reset session expired. Please request a new password reset.' },
        { status: 401 }
      );
    }

    let resetContext;
    try {
      resetContext = JSON.parse(resetContextCookie.value);
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid reset session' },
        { status: 401 }
      );
    }

    const { uid, token } = resetContext;

    if (!uid || !token) {
      return NextResponse.json(
        { success: false, message: 'Reset session is invalid' },
        { status: 401 }
      );
    }

    // Call Djoser backend to confirm password reset
    const response = await fetch(
      `${API_BASE_URL}/auth/users/reset_password_confirm/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid,
          token,
          new_password: newPassword,
          re_new_password: confirmPassword,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          success: false,
          message: errorData.detail || 'Failed to reset password. Please try again.',
        },
        { status: response.status }
      );
    }

    // Clear the reset context cookie on success
    cookieStore.delete('reset_context');

    return NextResponse.json(
      { success: true, message: 'Password reset successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
