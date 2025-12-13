import { NextRequest, NextResponse } from "next/server";

import {
  apiDeleteWithCookies,
  apiGetWithCookies,
  apiPatchWithCookies,
} from "@/lib/apiWithCookies";
import type { AdminUser } from "@/types/adminUser";

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
      // Relative path: /media/users/profile.jpg
      mediaPath = url.replace('/media/', '');
    } else if (url.includes('/media/')) {
      // Absolute path: https://api.cr-ai.cloud/media/users/profile.jpg
      const parts = url.split('/media/');
      mediaPath = parts[1] || '';
    } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // Just filename: profile.jpg
      mediaPath = url;
    }

    // Convert to Next.js proxy URL (no /api prefix)
    if (mediaPath) {
      obj[field] = `/media/${mediaPath}`;
    }
  });

  return obj;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const user = await apiGetWithCookies<AdminUser>(`/auth/adminuserlist/${id}`, true);
    const normalizedUser = normalizeMediaUrls(user);
    return NextResponse.json(normalizedUser);
  } catch (error) {
    console.error("Error fetching admin user:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const accessToken = req.cookies.get('access_token')?.value;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Determine if this is FormData or JSON
    const contentType = req.headers.get('content-type');

    if (contentType?.includes('multipart/form-data')) {
      // Handle FormData upload directly to backend
      const formData = await req.formData();
      
      // Forward FormData directly to Django backend
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.cr-ai.cloud';
      const backendFormData = new FormData();
      
      // Copy all fields from request FormData to backend FormData
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`[Admin User Update] Adding file: ${key} = ${value.name} (${value.size} bytes)`);
          backendFormData.append(key, value);
        } else if (value !== null && value !== undefined && value !== '') {
          console.log(`[Admin User Update] Adding field: ${key} = ${value}`);
          backendFormData.append(key, String(value));
        }
      }
      
      // Send FormData to Django backend
      const response = await fetch(`${API_BASE_URL}/auth/adminuserlist/${id}/update`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Cookie': `access_token=${accessToken}`,
        },
        body: backendFormData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Admin User Update] Backend error:', errorText);
        throw new Error(`Backend returned ${response.status}: ${errorText}`);
      }
      
      const updated = await response.json();
      const normalizedUpdated = normalizeMediaUrls(updated);
      return NextResponse.json(normalizedUpdated);
    } else {
      // Handle JSON update (existing behavior)
      const data = await req.json();
      const updated = await apiPatchWithCookies<AdminUser>(
        `/auth/adminuserlist/${id}/update`,
        data,
        true,
      );
      const normalizedUpdated = normalizeMediaUrls(updated);
      return NextResponse.json(normalizedUpdated);
    }
  } catch (error) {
    console.error("Error updating admin user:", error);
    const message = error instanceof Error ? error.message : "Failed to update user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await apiDeleteWithCookies<void>(`/auth/adminuserlist/${id}/delete`, true);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting admin user:", error);
    const message = error instanceof Error ? error.message : "Failed to delete user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
