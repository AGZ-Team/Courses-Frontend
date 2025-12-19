import { NextRequest, NextResponse } from "next/server";

import { apiGetWithCookies, apiPostWithCookies } from "@/lib/apiWithCookies";
import type { Content, ContentInput } from "@/types/content";

/**
 * GET /api/admin/content
 * List all content - accessible to authenticated users
 * Frontend will filter based on user role
 */
export async function GET(_req: NextRequest) {
  try {
    const content = await apiGetWithCookies<Content[]>("/content/", true);
    return NextResponse.json(content);
  } catch (error) {
    console.error("Error fetching content:", error);
    // If no content exists or there's an auth issue, return empty array instead of error
    // This prevents the UI from showing an error state when there's simply no data
    const message = error instanceof Error ? error.message : "Failed to fetch content";
    
    // Return empty array for common error cases to gracefully handle no data scenarios
    if (
      message.includes("404") || 
      message.includes("not found") || 
      message.includes("No access token") ||
      message.includes("does not exist") ||
      message.includes("401") ||
      message.includes("403")
    ) {
      return NextResponse.json([]);
    }
    
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/admin/content
 * Create new content - accessible to instructors and superusers only
 * Creator is automatically set by the backend based on authenticated user
 */
export async function POST(req: NextRequest) {
  try {
    const data: ContentInput = await req.json();
    console.log('[API /content] Received payload:', JSON.stringify(data, null, 2));
    
    const created = await apiPostWithCookies<Content>(
      "/content/create",
      data,
      true,
    );
    console.log('[API /content] Created successfully:', created);
    return NextResponse.json(created);
  } catch (error) {
    console.error("[API /content] Error creating content:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create content";
    console.error('[API /content] Error message:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
