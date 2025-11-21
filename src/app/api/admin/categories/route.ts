import { NextRequest, NextResponse } from "next/server";

import { apiGetWithCookies, apiPostWithCookies, apiRequestWithCookies } from "@/lib/apiWithCookies";
import type { Category } from "@/types/category";

export async function GET(_req: NextRequest) {
  try {
    // Public GET: no authentication required
    const categories = await apiGetWithCookies<Category[]>("/category/");
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch categories";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const created = await apiRequestWithCookies<Category>("/category/create", {
        method: "POST",
        body: formData,
        requireAuth: true,
      });
      return NextResponse.json(created);
    }

    const data = await req.json();
    const created = await apiPostWithCookies<Category>("/category/create", data, true);
    return NextResponse.json(created);
  } catch (error) {
    console.error("Error creating category:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create category";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
