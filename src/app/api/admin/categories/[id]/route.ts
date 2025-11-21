import { NextRequest, NextResponse } from "next/server";

import {
  apiDeleteWithCookies,
  apiGetWithCookies,
  apiPatchWithCookies,
  apiRequestWithCookies,
} from "@/lib/apiWithCookies";
import type { Category } from "@/types/category";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const category = await apiGetWithCookies<Category>(`/category/${id}`, true);
    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch category";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const updated = await apiRequestWithCookies<Category>(
        `/category/${id}/update`,
        {
          method: "PATCH",
          body: formData,
          requireAuth: true,
        },
      );
      return NextResponse.json(updated);
    }

    const data = await req.json();
    const updated = await apiPatchWithCookies<Category>(
      `/category/${id}/update`,
      data,
      true,
    );
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating category:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update category";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await apiDeleteWithCookies<void>(`/category/${id}/delete`, true);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    const message =
      error instanceof Error ? error.message : "Failed to delete category";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
