import { NextRequest, NextResponse } from "next/server";

import { apiGetWithCookies, apiRequestWithCookies } from "@/lib/apiWithCookies";
import type { Lesson } from "@/types/content";

/**
 * GET /api/admin/lesson
 * List all lessons - accessible to authenticated users
 * Frontend will filter based on user role
 */
export async function GET(_req: NextRequest) {
  try {
    const lessons = await apiGetWithCookies<Lesson[]>("/lesson/", true);
    return NextResponse.json(lessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    // If no lessons exist or there's an auth issue, return empty array instead of error
    // This prevents the UI from showing an error state when there's simply no data
    const message = error instanceof Error ? error.message : "Failed to fetch lessons";
    
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
 * POST /api/admin/lesson
 * Create new lesson - accessible to instructors and superusers only
 * Supports multipart/form-data for video and file uploads
 * Creator is automatically set by the backend based on authenticated user
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const created = await apiRequestWithCookies<Lesson>("/lesson/create", {
        method: "POST",
        body: formData,
        requireAuth: true,
      });
      return NextResponse.json(created);
    }

    // JSON request (without files)
    const data = await req.json();
    const created = await apiRequestWithCookies<Lesson>("/lesson/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      requireAuth: true,
    });
    return NextResponse.json(created);
  } catch (error) {
    console.error("Error creating lesson:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create lesson";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
