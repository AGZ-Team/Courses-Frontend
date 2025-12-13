import { NextRequest, NextResponse } from "next/server";

import { apiGetWithCookies } from "@/lib/apiWithCookies";
import type { AdminUser } from "@/types/adminUser";

/**
 * Helper function to convert backend media URLs to Next.js proxy URLs
 * This solves CORS and authentication issues by routing images through /media/[...path]
 */
function normalizeMediaUrls(userData: any): any {
  const imageFields = ['picture', 'id_card_face', 'id_card_back'];
  
  imageFields.forEach(field => {
    if (userData[field]) {
      let url = userData[field];
      
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
        userData[field] = `/media/${mediaPath}`;
      }
    }
  });
  
  return userData;
}

export async function GET(_req: NextRequest) {
  try {
    const users = await apiGetWithCookies<AdminUser[]>("/auth/adminuserlist/", true);
    // Normalize media URLs for all users
    const normalizedUsers = users.map(user => normalizeMediaUrls(user));
    return NextResponse.json(normalizedUsers);
  } catch (error) {
    console.error("Error fetching admin users:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch users";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
