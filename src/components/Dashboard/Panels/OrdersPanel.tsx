"use client";

import { useState, useEffect } from "react";
import { fetchOrders, fetchOrder } from "@/services/paymentService";
import type { Order, OrderStatus } from "@/types/payment";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IconArrowLeft,
  IconLoader2,
  IconReceipt,
  IconUser,
  IconCreditCard,
  IconCalendar,
  IconHash,
} from "@tabler/icons-react";

const statusStyles: Record<OrderStatus, { bg: string; text: string; ring: string }> = {
  paid: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-100" },
  pending: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-100" },
  failed: { bg: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-100" },
};

const statusLabels: Record<OrderStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  failed: "Failed",
};

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "SAR",
  }).format(amount);
}

export default function OrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  async function viewOrderDetail(id: number) {
    setDetailLoading(true);
    try {
      const order = await fetchOrder(id);
      setSelectedOrder(order);
    } catch (err) {
      console.error("Failed to load order detail:", err);
    } finally {
      setDetailLoading(false);
    }
  }

  if (selectedOrder) {
    return (
      <OrderDetail
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
      />
    );
  }

  return (
    <div className="px-4 lg:px-6" dir="ltr">
      <div className="mb-6 space-y-1 max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-[#0b0b2b]">Orders</h1>
        <p className="text-sm text-gray-500">
          Manage and review all payment orders.
        </p>
      </div>

      <Card className="mx-auto max-w-6xl rounded-3xl border border-gray-100 bg-white/95 shadow-[0_10px_40px_rgba(13,13,18,0.05)]">
        <CardHeader className="flex flex-col gap-2 border-b border-gray-100 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-left">
            <CardTitle className="text-base font-semibold text-[#0b0b2b]">
              All Orders
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              {orders.length} total orders
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {(["paid", "pending", "failed"] as OrderStatus[]).map((status) => {
              const s = statusStyles[status];
              const count = orders.filter((o) => o.status === status).length;
              return (
                <Badge
                  key={status}
                  className={`rounded-full ${s.bg} px-3 py-1 ${s.text} ring-1 ${s.ring}`}
                >
                  {statusLabels[status]} ({count})
                </Badge>
              );
            })}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <IconLoader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <p className="text-sm text-gray-500">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 cursor-pointer"
                onClick={loadOrders}
              >
                Retry
              </Button>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center">
              <IconReceipt className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">No orders yet</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block">
                <div className="max-h-[520px] overflow-x-auto overflow-y-auto">
                  <table className="min-w-full border-separate border-spacing-0 text-sm">
                    <thead>
                      <tr className="bg-gray-50/80 text-xs uppercase text-gray-500">
                        <th className="border-b border-gray-100 px-5 py-3 text-left font-medium">
                          Order ID
                        </th>
                        <th className="border-b border-gray-100 px-5 py-3 text-left font-medium">
                          User
                        </th>
                        <th className="border-b border-gray-100 px-5 py-3 text-left font-medium">
                          Amount
                        </th>
                        <th className="border-b border-gray-100 px-5 py-3 text-left font-medium">
                          Method
                        </th>
                        <th className="border-b border-gray-100 px-5 py-3 text-left font-medium">
                          Status
                        </th>
                        <th className="border-b border-gray-100 px-5 py-3 text-left font-medium">
                          Date
                        </th>
                        <th className="border-b border-gray-100 px-5 py-3 text-right font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => {
                        const s = statusStyles[order.status] ?? statusStyles.pending;
                        return (
                          <tr
                            key={order.id}
                            className="group border-t border-gray-50 bg-white/0 transition hover:bg-teal-50/40"
                          >
                            <td className="px-5 py-3 align-middle font-mono text-xs text-gray-700">
                              #{order.id}
                            </td>
                            <td className="px-5 py-3 align-middle text-sm text-gray-900">
                              User #{order.user}
                            </td>
                            <td className="px-5 py-3 align-middle text-sm font-semibold text-gray-900">
                              {formatAmount(order.amount)}
                            </td>
                            <td className="px-5 py-3 align-middle text-xs text-gray-600 capitalize">
                              {order.method}
                            </td>
                            <td className="px-5 py-3 align-middle">
                              <Badge
                                className={`rounded-full ${s.bg} px-3 py-1 text-xs font-medium ${s.text} ring-1 ${s.ring}`}
                              >
                                {statusLabels[order.status] ?? order.status}
                              </Badge>
                            </td>
                            <td className="px-5 py-3 align-middle text-xs text-gray-500">
                              {formatDate(order.created_at)}
                            </td>
                            <td className="px-5 py-3 align-middle text-right">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={detailLoading}
                                className="rounded-full border-gray-200 bg-white/80 px-3 text-xs font-medium text-gray-700 shadow-sm transition hover:border-primary/50 hover:bg-primary/5 hover:text-primary cursor-pointer"
                                onClick={() => viewOrderDetail(order.id)}
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile cards */}
              <div className="space-y-3 px-4 py-4 md:hidden">
                {orders.map((order) => {
                  const s = statusStyles[order.status] ?? statusStyles.pending;
                  return (
                    <div
                      key={order.id}
                      className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="font-mono text-[11px] text-gray-700">
                          #{order.id}
                        </span>
                        <span>{formatDate(order.created_at)}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          <div className="text-xs text-gray-500">Amount</div>
                          <div className="text-sm font-semibold text-gray-900">
                            {formatAmount(order.amount)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">Method</div>
                          <div className="text-xs text-gray-700 capitalize">
                            {order.method}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <Badge
                          className={`rounded-full ${s.bg} px-3 py-1 text-xs font-medium ${s.text} ring-1 ${s.ring}`}
                        >
                          {statusLabels[order.status] ?? order.status}
                        </Badge>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={detailLoading}
                          className="rounded-full border-gray-200 bg-white/80 px-3 text-[11px] font-medium text-gray-700 shadow-sm cursor-pointer"
                          onClick={() => viewOrderDetail(order.id)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function OrderDetail({ order, onBack }: { order: Order; onBack: () => void }) {
  const s = statusStyles[order.status] ?? statusStyles.pending;

  const details = [
    { icon: IconHash, label: "Order ID", value: `#${order.id}` },
    { icon: IconUser, label: "User ID", value: `#${order.user}` },
    { icon: IconReceipt, label: "Amount", value: formatAmount(order.amount) },
    { icon: IconCreditCard, label: "Method", value: order.method },
    { icon: IconCalendar, label: "Date", value: formatDate(order.created_at) },
    { icon: IconHash, label: "Tap Charge ID", value: order.tap_charge_id ?? "—" },
  ];

  return (
    <div className="px-4 lg:px-6" dir="ltr">
      <div className="mb-6 max-w-3xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-4 -ml-2 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <IconArrowLeft className="mr-1 h-4 w-4" />
          Back to Orders
        </Button>
        <h1 className="text-2xl font-semibold text-[#0b0b2b]">
          Order #{order.id}
        </h1>
      </div>

      <Card className="mx-auto max-w-3xl rounded-3xl border border-gray-100 bg-white/95 shadow-[0_10px_40px_rgba(13,13,18,0.05)]">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-[#0b0b2b]">
              Order Details
            </CardTitle>
            <Badge
              className={`rounded-full ${s.bg} px-4 py-1.5 text-xs font-semibold ${s.text} ring-1 ${s.ring}`}
            >
              {statusLabels[order.status] ?? order.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {details.map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.label}
                  className="flex items-center gap-3 rounded-xl bg-gray-50/60 px-4 py-3"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                    <Icon className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                      {d.label}
                    </div>
                    <div className="mt-0.5 text-sm font-medium text-gray-900">
                      {d.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
