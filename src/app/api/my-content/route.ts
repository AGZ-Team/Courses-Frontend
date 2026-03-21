import { NextResponse } from "next/server";
import { apiGetWithCookies } from "@/lib/apiWithCookies";
import type { Content } from "@/types/content";

/**
 * GET /api/my-content
 * Proxies to backend GET /my-content/ with JWT auth.
 * Returns only content purchased by the authenticated user.
 */
export async function GET() {
  try {
    const content = await apiGetWithCookies<Content[]>("/my-content/", true);
    return NextResponse.json(content);
  } catch (error) {
    console.error("[API /my-content] Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch my content";

    // Return empty array for auth/not-found errors
    if (
      message.includes("404") ||
      message.includes("No access token") ||
      message.includes("401") ||
      message.includes("403")
    ) {
      return NextResponse.json([]);
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
