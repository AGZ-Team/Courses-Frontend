/**
 * User Profile API Route
 * GET /api/auth/profile - Get current user data
 * PATCH /api/auth/profile - Update current user data
 * 
 * IMPORTANT: This route proxies file uploads to Django backend
 * The 413 error comes from Nginx/Django, not Next.js
 * To fix: Increase client_max_body_size in Nginx config on backend server
 */

import { NextRequest, NextResponse } from 'next/server';
import { apiGetWithCookies, apiPatchWithCookies } from '@/lib/apiWithCookies';
import { API_BASE_URL } from '@/lib/config';

/**
 * Helper function to convert backend media URLs to Next.js proxy URLs
 * This solves CORS and authentication issues by routing images through /media/[...path]
 */
function normalizeMediaUrls(userData: unknown): unknown {
  if (!userData || typeof userData !== 'object') return userData;

  const imageFields = ['picture', 'id_card_face', 'id_card_back'];
  const obj = userData as Record<string, unknown>;

  imageFields.forEach((field) => {
    const raw = obj[field];
    if (!raw) return;
    const url = String(raw ?? '');

    // Extract the media path from various URL formats
    let mediaPath = '';

    if (url.startsWith('/media/')) {
      mediaPath = url.replace('/media/', '');
    } else if (url.includes('/media/')) {
      const parts = url.split('/media/');
      mediaPath = parts[1] || '';
    } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
      mediaPath = url;
    }

    if (mediaPath) {
      obj[field] = `/media/${mediaPath}`;
      console.log(`[normalizeMediaUrls] Converted ${field}: ${url} → /media/${mediaPath}`);
    }
  });

  return obj;
}

/**
 * GET /api/auth/profile
 * Fetch current user profile data from Django backend
 */
export async function GET(request: NextRequest) {
  try {
    // Call Django backend /auth/users/me
    const userData = await apiGetWithCookies('/auth/users/me/', true);

    // Log the full raw object returned from the backend for debugging
    try {
      console.log('[Profile Route] Raw user data from backend:', JSON.stringify(userData, null, 2));
    } catch {
      // Fallback if stringify fails for any reason
      console.log('[Profile Route] Raw user data from backend (raw):', userData);
    }
    // Also log only the media-related fields for quick inspection in server logs
    try {
      const u = userData as Record<string, unknown>;
      console.log('[Profile Route] Media fields:', {
        picture: u.picture ?? null,
        id_front: u.id_card_face ?? null,
        id_back: u.id_card_back ?? null,
      });
    } catch {
      console.log('[Profile Route] Media fields (raw):', userData);
    }
    
    // Normalize media URLs to absolute paths
    const normalizedUserData = normalizeMediaUrls(userData);
    
    const n = normalizedUserData as Record<string, unknown>;
    console.log('Normalized user data:', {
      picture: n.picture ?? null,
      id_card_face: n.id_card_face ?? null,
      id_card_back: n.id_card_back ?? null,
    });
    
    return NextResponse.json(normalizedUserData);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch user profile';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/auth/profile
 * Update current user profile data
 * Supports both JSON and FormData (multipart/form-data)
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

    // Determine if this is FormData or JSON
    const contentType = request.headers.get('content-type');
    let data: Record<string, unknown> | null = null;
    let hasFiles = false;

    if (contentType?.includes('application/json')) {
      // Parse JSON data
      data = await request.json();
    } else if (contentType?.includes('multipart/form-data')) {
      // Parse FormData and check if it contains actual File objects
      const formData = await request.formData();
      data = {};
      
      // Extract text fields and files from FormData
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          hasFiles = true;
          data[key] = value; // Keep File objects as-is
        } else {
          // Store text values as strings
          data[key] = String(value);
        }
      }
    } else {
      // Try to parse as JSON by default
      data = await request.json();
    }

    // Validate that we're not sending empty username or email (common Django validation rules)
    if (
      data &&
      data.username !== undefined &&
      typeof data.username === 'string' &&
      data.username.trim() === ''
    ) {
      return NextResponse.json({ 
        error: 'Username cannot be empty' 
      }, { status: 400 });
    }

    if (
      data &&
      data.email !== undefined &&
      typeof data.email === 'string' &&
      data.email.trim() === ''
    ) {
      return NextResponse.json({ 
        error: 'Email cannot be empty' 
      }, { status: 400 });
    }

    try {
      let updatedUser;

      if (hasFiles) {
        // For FormData, we need to send it as multipart to Django backend
        const backendFormData = new FormData();
        
        // Add all fields to FormData (both text and file)
        for (const [key, value] of Object.entries(data || {})) {
          if (value instanceof File) {
            console.log(`Adding file to FormData: ${key} = ${value.name} (${value.size} bytes)`);
            backendFormData.append(key, value);
          } else if (value !== null && value !== undefined && value !== '') {
            console.log(`Adding text field to FormData: ${key} = ${value}`);
            backendFormData.append(key, String(value));
          }
        }
        
        // Call Django backend with FormData directly
        console.log(`Sending FormData PATCH to ${API_BASE_URL}/auth/users/me/`);
        const response = await fetch(`${API_BASE_URL}/auth/users/me/`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            // DO NOT set Content-Type - browser will set it with boundary
          },
          body: backendFormData,
        });

        console.log(`Response status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          console.error('Django error response:', errorText);
          
          let errorMessage = 'Failed to update profile';
          let parsedError: unknown = null;
          
          try {
            parsedError = JSON.parse(errorText);
            console.error('Parsed error data:', parsedError);
            // Attempt to extract common fields from parsed error
            if (parsedError && typeof parsedError === 'object') {
              const p = parsedError as Record<string, unknown>;
              errorMessage = String(p.detail ?? p.error ?? p.message ?? JSON.stringify(p));
            } else {
              errorMessage = String(parsedError);
            }
          } catch {
            // If it's HTML (like 413), extract meaningful info
            if (errorText.includes('<title>')) {
              const titleMatch = errorText.match(/<title>(.*?)<\/title>/i);
              if (titleMatch) {
                errorMessage = titleMatch[1];
              }
            } else {
              errorMessage = errorText || errorMessage;
            }
          }
          
          // Return the actual status code from Django/Nginx
          return NextResponse.json(
            { 
              error: errorMessage,
              details: parsedError,
              status: response.status
            },
            { status: response.status } // Pass through the actual status
          );
        }
        
        updatedUser = await response.json();
        console.log('✓ Profile updated successfully with files:', updatedUser);
      } else {
        // For JSON, use the standard function
        updatedUser = await apiPatchWithCookies('/auth/users/me/', data, true);
        console.log('✓ Profile updated successfully:', updatedUser);
      }
      
      // Normalize media URLs in the response
      const normalizedUpdatedUser = normalizeMediaUrls(updatedUser);
      
      const nu = normalizedUpdatedUser as Record<string, unknown>;
      console.log('Normalized updated user data:', {
        picture: nu.picture ?? null,
        id_card_face: nu.id_card_face ?? null,
        id_card_back: nu.id_card_back ?? null,
      });
      
      return NextResponse.json(normalizedUpdatedUser);
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
