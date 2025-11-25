import { NextRequest, NextResponse } from "next/server";

import {
  apiDeleteWithCookies,
  apiGetWithCookies,
  apiPatchWithCookies,
} from "@/lib/apiWithCookies";
import type { AdminUser } from "@/types/adminUser";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const user = await apiGetWithCookies<AdminUser>(`/auth/adminuserlist/${id}`, true);
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching admin user:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const data = await req.json();
    const updated = await apiPatchWithCookies<AdminUser>(
      `/auth/adminuserlist/${id}/update`,
      data,
      true,
    );
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating admin user:", error);
    const message = error instanceof Error ? error.message : "Failed to update user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await apiDeleteWithCookies<void>(`/auth/adminuserlist/${id}/delete`, true);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting admin user:", error);
    const message = error instanceof Error ? error.message : "Failed to delete user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
