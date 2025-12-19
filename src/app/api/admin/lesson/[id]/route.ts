import { NextRequest, NextResponse } from "next/server";

import {
  apiDeleteWithCookies,
  apiGetWithCookies,
  apiRequestWithCookies,
} from "@/lib/apiWithCookies";
import type { Lesson } from "@/types/content";

/**
 * GET /api/admin/lesson/[id]
 * Get single lesson by ID
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const lesson = await apiGetWithCookies<Lesson>(`/lesson/${id}`, true);
    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Error fetching lesson:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch lesson";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/lesson/[id]
 * Update lesson by ID - accessible to content creator and superusers
 * Supports multipart/form-data for video and file uploads
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const contentType = req.headers.get("content-type") ?? "";
    
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const updated = await apiRequestWithCookies<Lesson>(
        `/lesson/${id}/update`,
        {
          method: "PATCH",
          body: formData,
          requireAuth: true,
        },
      );
      return NextResponse.json(updated);
    }

    // JSON request (without files)
    const data = await req.json();
    const updated = await apiRequestWithCookies<Lesson>(
      `/lesson/${id}/update`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        requireAuth: true,
      },
    );
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating lesson:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update lesson";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/lesson/[id]
 * Delete lesson by ID - accessible to content creator and superusers
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await apiDeleteWithCookies<void>(`/lesson/${id}/delete`, true);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    const message =
      error instanceof Error ? error.message : "Failed to delete lesson";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
