import type {
  CreateChargeRequest,
  CreateChargeResponse,
  Order,
} from "@/types/payment";

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    return res.json();
  }

  let message = "Request failed";
  try {
    const data = await res.json();
    if (typeof data === "object" && data !== null) {
      if ("detail" in data && typeof data.detail === "string")
        message = data.detail;
      else if ("error" in data && typeof data.error === "string")
        message = data.error;
    }
  } catch {
    // ignore JSON parse errors
  }

  throw new Error(message);
}

/**
 * Create a charge via Tap Payment.
 * Returns a URL to redirect the user to the Tap checkout page.
 */
export async function createCharge(
  data: CreateChargeRequest
): Promise<CreateChargeResponse> {
  const res = await fetch("/api/payment/create-charge", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse<CreateChargeResponse>(res);
}

/**
 * Fetch all orders (admin).
 */
export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch("/api/payment/orders", {
    method: "GET",
    credentials: "include",
  });
  return handleResponse<Order[]>(res);
}

/**
 * Fetch a single order by ID.
 */
export async function fetchOrder(id: number): Promise<Order> {
  const res = await fetch(`/api/payment/orders/${id}`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse<Order>(res);
}
