import { NextRequest, NextResponse } from "next/server";
import { apiGetWithCookies } from "@/lib/apiWithCookies";
import type { Order } from "@/types/payment";

/**
 * GET /api/payment/orders/:id
 * Proxies to backend GET /order/:id with JWT auth.
 * Returns single order details.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await apiGetWithCookies<Order>(`/order/${id}`, true);
    return NextResponse.json(order);
  } catch (error) {
    console.error("[API /payment/orders/:id] Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
