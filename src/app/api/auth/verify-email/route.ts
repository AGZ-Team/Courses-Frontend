import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/config';

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
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        { success: false, message: 'Invalid request format' },
        { status: 400 }
      );
    }

    let uid = body?.uid;
    let token = body?.token;
    const cookieStore = await cookies();

    // If uid and token not in body, try to get from cookie
    if (!uid || !token) {
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
      } catch (e) {
        console.error('Failed to parse verify_context cookie:', e);
        return NextResponse.json(
          { success: false, message: 'Invalid verification session' },
          { status: 401 }
        );
      }

      uid = verifyContext?.uid;
      token = verifyContext?.token;
    }

    if (!uid || !token) {
      console.error('Missing uid or token:', { uid, token });
      return NextResponse.json(
        { success: false, message: 'Verification session is invalid' },
        { status: 401 }
      );
    }

    // Ensure uid and token are strings
    const uidStr = String(uid).trim();
    const tokenStr = String(token).trim();

    if (!uidStr || !tokenStr) {
      console.error('uid or token is empty after trimming:', { uidStr, tokenStr });
      return NextResponse.json(
        { success: false, message: 'Verification session is invalid' },
        { status: 401 }
      );
    }

    console.log('Calling Django activation endpoint with:', { uidStr, tokenStr, apiUrl: `${API_BASE_URL}/auth/users/activation/` });

    // Call Djoser backend to activate/verify email
    let response;
    try {
      response = await fetch(
        `${API_BASE_URL}/auth/users/activation/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: uidStr,
            token: tokenStr,
          }),
        }
      );
    } catch (fetchError) {
      console.error('Fetch error calling Django activation endpoint:', fetchError);
      return NextResponse.json(
        { success: false, message: 'Failed to connect to verification service. Please try again.' },
        { status: 503 }
      );
    }
    
    let responseText = '';
    try {
      responseText = await response.text();
    } catch (textError) {
      console.error('Failed to read response text:', textError);
      return NextResponse.json(
        { success: false, message: 'Invalid response from verification service.' },
        { status: 502 }
      );
    }

    let responseData: Record<string, unknown> = {};
    
    // Try to parse JSON response if there is one
    if (responseText && responseText.trim().length > 0) {
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse backend response:', parseError, 'Response text:', responseText);
        // If we can't parse it, but the status is ok, that's fine (empty response)
        if (!response.ok) {
          return NextResponse.json(
            { success: false, message: 'Verification failed. Please try again.' },
            { status: response.status }
          );
        }
      }
    }

    if (!response.ok) {
      console.error('Django returned error status:', response.status, 'Response data:', responseData);
      return NextResponse.json(
        {
          success: false,
          message: responseData?.detail || responseData?.message || 'Failed to verify email. Please try again.',
        },
        { status: response.status }
      );
    }

    // Clear the verify context cookie on success (if it exists)
    try {
      cookieStore.delete('verify_context');
    } catch (e) {
      // Cookie might not exist, that's okay
      console.error('Failed to delete verify_context cookie:', e);
    }

    console.log('Email verification successful for uid:', uidStr);
    return NextResponse.json(
      { success: true, message: 'Email verified successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email verification error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { success: false, message: `An error occurred: ${errorMessage}` },
      { status: 500 }
    );
  }
}
