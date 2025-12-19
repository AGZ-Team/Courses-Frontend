import { NextRequest, NextResponse } from "next/server";

import {
  apiDeleteWithCookies,
  apiGetWithCookies,
  apiPatchWithCookies,
} from "@/lib/apiWithCookies";
import type { Content, ContentInput } from "@/types/content";

/**
 * GET /api/admin/content/[id]
 * Get single content by ID
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const content = await apiGetWithCookies<Content>(`/content/${id}`, true);
    return NextResponse.json(content);
  } catch (error) {
    console.error("Error fetching content:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/content/[id]
 * Update content by ID - accessible to content creator and superusers
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const data: Partial<ContentInput> = await req.json();
    const updated = await apiPatchWithCookies<Content>(
      `/content/${id}/update`,
      data,
      true,
    );
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating content:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/content/[id]
 * Delete content by ID - accessible to content creator and superusers
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await apiDeleteWithCookies<void>(`/content/${id}/delete`, true);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting content:", error);
    const message =
      error instanceof Error ? error.message : "Failed to delete content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
