import { NextRequest, NextResponse } from "next/server";

import {
  apiDeleteWithCookies,
  apiGetWithCookies,
  apiPatchWithCookies,
} from "@/lib/apiWithCookies";
import type { Subcategory } from "@/types/subcategory";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const subcategory = await apiGetWithCookies<Subcategory>(
      `/subcategory/${id}`,
      true,
    );
    return NextResponse.json(subcategory);
  } catch (error) {
    console.error("Error fetching subcategory:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch subcategory";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const data = await req.json();
    const updated = await apiPatchWithCookies<Subcategory>(
      `/subcategory/${id}/update`,
      data,
      true,
    );
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating subcategory:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update subcategory";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await apiDeleteWithCookies<void>(`/subcategory/${id}/delete`, true);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    const message =
      error instanceof Error ? error.message : "Failed to delete subcategory";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
