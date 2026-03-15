import { NextResponse } from "next/server";
import { apiGetWithCookies } from "@/lib/apiWithCookies";
import type { Order } from "@/types/payment";

/**
 * GET /api/payment/orders
 * Proxies to backend GET /order/ with JWT auth.
 * Returns all orders (admin endpoint).
 */
export async function GET() {
  try {
    const orders = await apiGetWithCookies<Order[]>("/order/", true);
    return NextResponse.json(orders);
  } catch (error) {
    console.error("[API /payment/orders] Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch orders";

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
