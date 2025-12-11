import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/config';

/**
 * GET /api/auth/check-verification
 * 
 * Checks if the user's email is verified by calling the backend.
 * This provides a reliable verification status instead of relying on client-side storage.
 * 
 * Response: { verified: boolean, email?: string }
 */
export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('access_token')?.value;
    
    if (!accessToken) {
      return NextResponse.json(
        { verified: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Call backend to check actual verification status
    const response = await fetch(`${API_BASE_URL}/auth/users/me/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Backend verification check failed:', response.status);
      return NextResponse.json(
        { verified: false, message: 'Failed to verify status' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Check if the user is active (email verified)
    // The field name may vary based on your backend implementation
    const isVerified = data.is_active === true || data.is_verified === true;
    
    return NextResponse.json({
      verified: isVerified,
      email: data.email,
    });
  } catch (error) {
    console.error('Verification check error:', error);
    return NextResponse.json(
      { 
        verified: false, 
        message: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
