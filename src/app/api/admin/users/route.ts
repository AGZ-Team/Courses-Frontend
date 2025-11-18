import { NextRequest, NextResponse } from "next/server";

import { apiGetWithCookies } from "@/lib/apiWithCookies";
import type { AdminUser } from "@/types/adminUser";

export async function GET(_req: NextRequest) {
  try {
    const users = await apiGetWithCookies<AdminUser[]>("/auth/adminuserlist/", true);
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching admin users:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch users";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
