import { NextRequest, NextResponse } from "next/server";

import { apiGetWithCookies, apiPostWithCookies } from "@/lib/apiWithCookies";
import type { Subcategory } from "@/types/subcategory";

export async function GET(_req: NextRequest) {
  try {
    const subcategories = await apiGetWithCookies<Subcategory[]>("/subcategory/");
    return NextResponse.json(subcategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch subcategories";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const created = await apiPostWithCookies<Subcategory>(
      "/subcategory/create",
      data,
      true,
    );
    return NextResponse.json(created);
  } catch (error) {
    console.error("Error creating subcategory:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create subcategory";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
