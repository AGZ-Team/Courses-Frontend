import { NextRequest, NextResponse } from "next/server";
import { apiPostWithCookies } from "@/lib/apiWithCookies";
import type { CreateChargeRequest, CreateChargeResponse } from "@/types/payment";

/**
 * POST /api/payment/create-charge
 * Proxies to backend POST /create-charge/ with JWT auth.
 * Sends customer info + course IDs, returns Tap checkout URL.
 */
export async function POST(req: NextRequest) {
  try {
    const data: CreateChargeRequest = await req.json();

    const result = await apiPostWithCookies<CreateChargeResponse>(
      "/create-charge/",
      data,
      true
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API /payment/create-charge] Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create charge";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
