import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/config';

/**
 * API route to resend verification email
 * Calls Djoser backend to resend activation email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Call the backend API to resend verification email
    const response = await fetch(
      `${API_BASE_URL}/auth/users/resend_activation/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    );

    // Try to parse response as JSON, fallback to empty object if it's HTML
    let data = {};
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
      }
    } else {
      const text = await response.text();
      console.error('Backend returned non-JSON response:', {
        status: response.status,
        contentType,
        text: text.substring(0, 200),
      });
    }

    if (!response.ok) {
      console.error('Backend resend verification error:', {
        status: response.status,
        data,
      });

      // If it's a 400 error, it might be "email not found" or similar
      // Still consider it a success - the email was sent if it exists
      if (response.status === 400 || response.status === 404) {
        return NextResponse.json(
          { success: true, message: 'Verification email sent successfully' },
          { status: 200 }
        );
      }

      return NextResponse.json(
        data || { error: 'Failed to resend verification email' },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Verification email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Resend verification API error:', error);

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
