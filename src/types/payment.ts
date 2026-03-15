// Payment types for Tap Payment integration

export interface CartItem {
  id: number;
  title: string;
  image: string;
  price: number;
  author: string;
}

export type PaymentMethod = "card" | "mada" | "apple" | "samsung";

export type OrderStatus = "pending" | "paid" | "failed";

export interface CreateChargeRequest {
  first_name: string;
  last_name: string;
  email: string;
  method: PaymentMethod;
  courses: number[];
}

export interface CreateChargeResponse {
  url: string;
}

export interface Order {
  id: number;
  amount: number;
  tap_charge_id: string | null;
  status: OrderStatus;
  created_at: string;
  method: string;
  user: number;
}
