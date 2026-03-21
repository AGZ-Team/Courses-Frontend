"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconLoader2, IconReceipt } from "@tabler/icons-react";
import type { Order, OrderStatus } from "@/types/payment";
import { fetchOrders } from "@/services/paymentService";

const statusStyles: Record<OrderStatus, { bg: string; text: string; ring: string }> = {
  paid: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-100" },
  pending: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-100" },
  failed: { bg: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-100" },
};

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

export default function PaymentHistoryPanel() {
  const t = useTranslations("payment.history");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const {
    data: orders = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Order[]>({
    queryKey: ["paymentHistory"],
    queryFn: fetchOrders,
  });

  const statusLabel = (status: OrderStatus) => {
    const map: Record<OrderStatus, string> = {
      paid: t("statusPaid"),
      pending: t("statusPending"),
      failed: t("statusFailed"),
    };
    return map[status] ?? status;
  };

  return (
    <div className="px-4 lg:px-6" dir="ltr">
      <div className="mb-6 space-y-1 max-w-6xl mx-auto" dir="auto">
        <h1 className="text-2xl font-semibold text-[#0b0b2b]">{t("title")}</h1>
        <p className="text-sm text-gray-500">{t("subtitle")}</p>
      </div>

      <Card className="mx-auto max-w-6xl rounded-3xl border border-gray-100 bg-white/95 shadow-[0_10px_40px_rgba(13,13,18,0.05)]">
        <CardHeader className="flex flex-col gap-2 border-b border-gray-100 sm:flex-row sm:items-center sm:justify-between">
          <div dir="auto">
            <CardTitle className="text-base font-semibold text-[#0b0b2b]">
              {t("transactions")}
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              {t("recentPayments")}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 hover:bg-gray-200">
              {t("all")}
            </Badge>
            {(["paid", "pending", "failed"] as OrderStatus[]).map((status) => {
              const s = statusStyles[status];
              return (
                <Badge
                  key={status}
                  className={`rounded-full ${s.bg} px-3 py-1 ${s.text} ring-1 ${s.ring}`}
                >
                  {statusLabel(status)}
                </Badge>
              );
            })}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <IconLoader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <p className="text-sm text-gray-500">{t("error")}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 cursor-pointer"
                onClick={() => refetch()}
              >
                {t("retry")}
              </Button>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center">
              <IconReceipt className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">{t("noTransactions")}</p>
              <p className="mt-1 text-xs text-gray-400">{t("noTransactionsDescription")}</p>
            </div>
          ) : (
            <>
              {/* Desktop / tablet table */}
              <div className="hidden md:block">
                <div className="max-h-[520px] overflow-x-auto overflow-y-auto">
                  <table className="min-w-full border-separate border-spacing-0 text-sm">
                    <thead>
                      <tr className="bg-gray-50/80 text-xs uppercase text-gray-500">
                        <th className="border-b border-gray-100 px-5 py-3 text-left font-medium">
                          {t("date")}
                        </th>
                        <th className="border-b border-gray-100 px-5 py-3 text-left font-medium">
                          {t("orderId")}
                        </th>
                        <th className="border-b border-gray-100 px-5 py-3 text-left font-medium">
                          {t("amount")}
                        </th>
                        <th className="border-b border-gray-100 px-5 py-3 text-left font-medium">
                          {t("method")}
                        </th>
                        <th className="border-b border-gray-100 px-5 py-3 text-left font-medium">
                          {t("status")}
                        </th>
                        <th className="border-b border-gray-100 px-5 py-3 text-right font-medium">
                          {t("actions")}
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
                            <td className="px-5 py-3 align-middle text-xs text-gray-500">
                              {formatDate(order.created_at)}
                            </td>
                            <td className="px-5 py-3 align-middle font-mono text-xs text-gray-700">
                              #{order.id}
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
                                {statusLabel(order.status)}
                              </Badge>
                            </td>
                            <td className="px-5 py-3 align-middle text-right">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="rounded-full border-gray-200 bg-white/80 px-3 text-xs font-medium text-gray-700 shadow-sm transition hover:border-primary/50 hover:bg-primary/5 hover:text-primary cursor-pointer"
                                onClick={() => setSelectedOrder(order)}
                              >
                                {t("viewInvoice")}
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile stacked cards */}
              <div className="space-y-3 px-4 py-4 md:hidden">
                {orders.map((order) => {
                  const s = statusStyles[order.status] ?? statusStyles.pending;
                  return (
                    <div
                      key={order.id}
                      className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatDate(order.created_at)}</span>
                        <span className="font-mono text-[11px] text-gray-700">#{order.id}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <div className="space-y-1">
                          <div className="text-gray-500">{t("amount")}</div>
                          <div className="text-sm font-semibold text-gray-900">
                            {formatAmount(order.amount)}
                          </div>
                        </div>
                        <div className="space-y-1 text-right">
                          <div className="text-gray-500">{t("method")}</div>
                          <div className="text-xs text-gray-700 capitalize">{order.method}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <Badge
                          className={`rounded-full ${s.bg} px-3 py-1 text-xs font-medium ${s.text} ring-1 ${s.ring}`}
                        >
                          {statusLabel(order.status)}
                        </Badge>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-full border-gray-200 bg-white/80 px-3 text-[11px] font-medium text-gray-700 shadow-sm transition hover:border-primary/50 hover:bg-primary/5 hover:text-primary cursor-pointer"
                          onClick={() => setSelectedOrder(order)}
                        >
                          {t("viewInvoice")}
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

      {selectedOrder && (
        <InvoiceModal order={selectedOrder} onClose={() => setSelectedOrder(null)} t={t} statusLabel={statusLabel} />
      )}
    </div>
  );
}

function InvoiceModal({
  order,
  onClose,
  t,
  statusLabel,
}: {
  order: Order;
  onClose: () => void;
  t: (key: string) => string;
  statusLabel: (status: OrderStatus) => string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-3xl rounded-3xl bg-white shadow-[0_24px_80px_rgba(13,13,18,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-[#0b0b2b]">{t("invoice")}</h2>
            <p className="text-xs text-gray-500">#{order.id} &middot; {formatDate(order.created_at)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-200"
          >
            {t("close")}
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="space-y-3 text-sm">
            <div className="space-y-1.5">
              <DetailRow label={t("orderId")} value={`#${order.id}`} />
              <DetailRow label={t("amount")} value={formatAmount(order.amount)} />
              <DetailRow label={t("method")} value={order.method} />
              <DetailRow label={t("status")} value={statusLabel(order.status)} />
              <DetailRow label={t("date")} value={formatDate(order.created_at)} />
              <DetailRow label={t("tapChargeId")} value={order.tap_charge_id ?? "\u2014"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-xs md:text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800 text-right">{value}</span>
    </div>
  );
}
