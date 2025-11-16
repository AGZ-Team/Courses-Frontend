"use client";

import {useState} from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type PaymentStatus = "paid" | "pending" | "refunded";
type PaymentMethodType = "visa" | "mastercard" | "apple-pay" | "paypal";

type Payment = {
  id: string;
  date: string;
  course: string;
  amount: string;
  method: string;
  status: PaymentStatus;
  methodType: PaymentMethodType;
  cardNumber: string;
  cardLast4?: string;
  cardHolder: string;
  cardExpiry?: string;
  billingEmail?: string;
};

const statusLabelMap: Record<PaymentStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  refunded: "Refunded",
};

const payments: Payment[] = [
  {
    id: "INV-2025-001",
    date: "2025-03-12",
    course: "Advanced React & TypeScript",
    amount: "$79.00",
    method: "Visa **** 4242",
    status: "paid",
    methodType: "visa",
    cardNumber: "4242 7310 9823 1042",
    cardLast4: "4242",
    cardHolder: "Ziad Ramzy",
    cardExpiry: "04/28",
    billingEmail: "ziad@example.com",
  },
  {
    id: "INV-2025-002",
    date: "2025-03-10",
    course: "Design Systems for Developers",
    amount: "$49.00",
    method: "Apple Pay",
    status: "paid",
    methodType: "apple-pay",
    cardNumber: "6011 0039 5210 7744",
    cardHolder: "Ziad Ramzy",
    billingEmail: "ziad@example.com",
  },
  {
    id: "INV-2025-003",
    date: "2025-03-05",
    course: "Building SaaS Dashboards",
    amount: "$99.00",
    method: "Mastercard **** 8831",
    status: "refunded",
    methodType: "mastercard",
    cardNumber: "5355 8020 7188 8831",
    cardLast4: "8831",
    cardHolder: "Ziad Ramzy",
    cardExpiry: "11/27",
    billingEmail: "ziad@example.com",
  },
  {
    id: "INV-2025-004",
    date: "2025-02-28",
    course: "Content Strategy for Creators",
    amount: "$39.00",
    method: "PayPal",
    status: "pending",
    methodType: "paypal",
    cardNumber: "4539 0014 6724 9091",
    cardHolder: "Ziad Ramzy",
    billingEmail: "ziad@example.com",
  },
  {
    id: "INV-2025-005",
    date: "2025-02-20",
    course: "Modern JavaScript Patterns",
    amount: "$59.00",
    method: "Visa **** 3012",
    status: "paid",
    methodType: "visa",
    cardNumber: "4929 0018 3012 7746",
    cardLast4: "3012",
    cardHolder: "Ziad Ramzy",
    cardExpiry: "09/27",
    billingEmail: "ziad@example.com",
  },
  {
    id: "INV-2025-006",
    date: "2025-02-11",
    course: "Next.js Performance in Practice",
    amount: "$69.00",
    method: "Mastercard **** 7710",
    status: "paid",
    methodType: "mastercard",
    cardNumber: "5425 3000 7710 2188",
    cardLast4: "7710",
    cardHolder: "Ziad Ramzy",
    cardExpiry: "01/29",
    billingEmail: "ziad@example.com",
  },
  {
    id: "INV-2025-007",
    date: "2025-01-30",
    course: "Product Design Essentials",
    amount: "$45.00",
    method: "Visa **** 9981",
    status: "pending",
    methodType: "visa",
    cardNumber: "4716 9200 9981 3605",
    cardLast4: "9981",
    cardHolder: "Ziad Ramzy",
    cardExpiry: "06/28",
    billingEmail: "ziad@example.com",
  },
  {
    id: "INV-2025-008",
    date: "2025-01-18",
    course: "SEO & Content Marketing",
    amount: "$39.00",
    method: "PayPal",
    status: "paid",
    methodType: "paypal",
    cardNumber: "4556 4800 2219 5544",
    cardHolder: "Ziad Ramzy",
    billingEmail: "ziad@example.com",
  },
];

export default function PaymentHistoryPanel() {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  return (
    <div className="px-4 lg:px-6" dir="ltr">
      <div className="mb-6 space-y-1 max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-[#0b0b2b]">Payment history</h1>
        <p className="text-sm text-gray-500">Review all your transactions in one place.</p>
      </div>

      <Card className="mx-auto max-w-6xl rounded-3xl border border-gray-100 bg-white/95 shadow-[0_10px_40px_rgba(13,13,18,0.05)]">
        <CardHeader className="flex flex-col gap-2 border-b border-gray-100 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-left">
            <CardTitle className="text-base font-semibold text-[#0b0b2b]">
              Transactions
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Recent payments for your courses and subscriptions.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 hover:bg-gray-200">
              All
            </Badge>
            <Badge className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 ring-1 ring-emerald-100">
              Paid
            </Badge>
            <Badge className="rounded-full bg-amber-50 px-3 py-1 text-amber-700 ring-1 ring-amber-100">
              Pending
            </Badge>
            <Badge className="rounded-full bg-rose-50 px-3 py-1 text-rose-700 ring-1 ring-rose-100">
              Refunded
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop / tablet table */}
          <div className="hidden md:block">
            <div className="max-h-[520px] overflow-x-auto overflow-y-auto">
              <table className="min-w-full border-separate border-spacing-0 text-sm">
                <thead>
                  <tr className="bg-gray-50/80 text-xs uppercase text-gray-500">
                    <th className="border-b border-gray-100 px-5 py-3 text-left font-medium">
                      Date
                    </th>
                    <th className="border-b border-gray-100 px-5 py-3 text-left font-medium">
                      Invoice ID
                    </th>
                    <th className="border-b border-gray-100 px-5 py-3 text-left font-medium">
                      Course / Item
                    </th>
                    <th className="border-b border-gray-100 px-5 py-3 text-left font-medium">
                      Amount
                    </th>
                    <th className="border-b border-gray-100 px-5 py-3 text-left font-medium">
                      Payment method
                    </th>
                    <th className="border-b border-gray-100 px-5 py-3 text-left font-medium">
                      Status
                    </th>
                    <th className="border-b border-gray-100 px-5 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="group border-t border-gray-50 bg-white/0 transition hover:bg-teal-50/40"
                    >
                      <td className="px-5 py-3 align-middle text-xs text-gray-500">
                        {payment.date}
                      </td>
                      <td className="px-5 py-3 align-middle font-mono text-xs text-gray-700">
                        {payment.id}
                      </td>
                      <td className="px-5 py-3 align-middle text-sm text-gray-900">
                        {payment.course}
                      </td>
                      <td className="px-5 py-3 align-middle text-sm font-semibold text-gray-900">
                        {payment.amount}
                      </td>
                      <td className="px-5 py-3 align-middle text-xs text-gray-600">
                        {payment.method}
                      </td>
                      <td className="px-5 py-3 align-middle">
                        <StatusBadge
                          status={payment.status}
                          label={statusLabelMap[payment.status]}
                        />
                      </td>
                      <td className="px-5 py-3 align-middle text-right">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-full border-gray-200 bg-white/80 px-3 text-xs font-medium text-gray-700 shadow-sm transition hover:border-primary/50 hover:bg-primary/5 hover:text-primary cursor-pointer"
                          onClick={() => setSelectedPayment(payment)}
                        >
                          View invoice
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile stacked cards - no horizontal scroll needed */}
          <div className="space-y-3 px-4 py-4 md:hidden">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{payment.date}</span>
                  <span className="font-mono text-[11px] text-gray-700">{payment.id}</span>
                </div>
                <div className="mt-2 text-sm font-medium text-gray-900">
                  {payment.course}
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <div className="text-gray-500">Amount</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {payment.amount}
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="text-gray-500">Method</div>
                    <div className="text-xs text-gray-700">{payment.method}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <StatusBadge
                    status={payment.status}
                    label={statusLabelMap[payment.status]}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full border-gray-200 bg-white/80 px-3 text-[11px] font-medium text-gray-700 shadow-sm transition hover:border-primary/50 hover:bg-primary/5 hover:text-primary cursor-pointer"
                    onClick={() => setSelectedPayment(payment)}
                  >
                    View invoice
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedPayment && (
        <InvoiceModal payment={selectedPayment} onClose={() => setSelectedPayment(null)} />
      )}
    </div>
  );
}

function StatusBadge({
  status,
  label,
}: {
  status: "paid" | "pending" | "refunded";
  label: string;
}) {
  const resolvedLabel = label || status;

  if (status === "paid") {
    return (
      <Badge className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
        {resolvedLabel}
      </Badge>
    );
  }

  if (status === "pending") {
    return (
      <Badge className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-100">
        {resolvedLabel}
      </Badge>
    );
  }

  return (
    <Badge className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 ring-1 ring-rose-100">
      {resolvedLabel}
    </Badge>
  );
}

function InvoiceModal({
  payment,
  onClose,
}: {
  payment: Payment;
  onClose: () => void;
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
            <h2 className="text-base font-semibold text-[#0b0b2b]">Payment invoice</h2>
            <p className="text-xs text-gray-500">{payment.id} · {payment.date}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-200"
          >
            Close
          </button>
        </div>

        <div className="grid gap-6 px-6 py-5 md:grid-cols-2">
          {/* Left: payment card */}
          <div className="space-y-3">
            <PaymentMethodCard payment={payment} />
            <p className="text-xs text-gray-500">
              {payment.billingEmail && (
                <>
                  Billed to <span className="font-medium text-gray-700">{payment.billingEmail}</span>
                </>
              )}
            </p>
          </div>

          {/* Right: invoice details list */}
          <div className="space-y-3 text-sm">
            <div className="space-y-1.5">
              <DetailRow label="Course / Item" value={payment.course} />
              <DetailRow label="Amount" value={payment.amount} />
              <DetailRow label="Payment method" value={payment.method} />
              <DetailRow label="Status" value={statusLabelMap[payment.status]} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
              <div>
                <p className="font-semibold text-gray-700">Invoice ID</p>
                <p className="mt-0.5 font-mono text-[11px] text-gray-700">{payment.id}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Date</p>
                <p className="mt-0.5 text-gray-700">{payment.date}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentMethodCard({ payment }: { payment: Payment }) {
  const isVisa = payment.methodType === "visa";
  const isMastercard = payment.methodType === "mastercard";
  const isApplePay = payment.methodType === "apple-pay";
  const isPayPal = payment.methodType === "paypal";

  const baseClass =
    "relative flex h-44 w-full max-w-xs flex-col justify-between rounded-[26px] p-5 text-white shadow-[0_24px_60px_rgba(0,0,0,0.45)] overflow-hidden mx-auto";

  let brandClass = "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900";
  let brandLabel = payment.method;

  if (isVisa) {
    // Classic blue Visa card look
    brandClass = "bg-gradient-to-br from-sky-400 via-blue-600 to-blue-900";
    brandLabel = "VISA";
  } else if (isMastercard) {
    // Dark navy Mastercard card with overlapping circles
    brandClass = "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900";
    brandLabel = "Mastercard";
  } else if (isApplePay) {
    // Clean black Apple Pay card
    brandClass = "bg-gradient-to-br from-black via-zinc-900 to-black";
    brandLabel = "Apple Pay";
  } else if (isPayPal) {
    // PayPal gradient closer to brand colors
    brandClass = "bg-gradient-to-br from-[#179BD7] via-[#1368A3] to-[#003087]";
    brandLabel = "PayPal";
  }

  const rawNumber = payment.cardNumber || "";
  const maskedNumber = rawNumber
    ? rawNumber.replace(/\d(?=\d{4})/g, "•")
    : "••••  ••••  ••••  ••••";

  return (
    <div className={`${baseClass} ${brandClass}`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
          {brandLabel}
        </span>
        <div className="flex items-center gap-2">
          {isMastercard && (
            <div className="relative flex items-center">
              <span className="h-7 w-7 rounded-full bg-[rgba(255,196,0,0.95)]" />
              <span className="-ml-3 h-7 w-7 rounded-full bg-[rgba(255,69,0,0.95)]" />
            </div>
          )}
          {isVisa && <span className="text-lg font-black tracking-[0.35em]">VISA</span>}
          {isApplePay && (
            <Image
              src="/dashboard/svgs/apple-svgrepo-com.svg"
              alt="Apple Pay"
              width={24}
              height={24}
              className="h-6 w-6"
            />
          )}
          {isPayPal && (
            <span className="text-[18px] font-semibold tracking-tight">
              Pay<span className="text-white/80">Pal</span>
            </span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm tracking-[0.25em]">
          {maskedNumber}
        </p>
      </div>

      <div className="mt-4 flex items-end justify-between text-xs">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.24em] text-white/60">Card holder</p>
          <p className="text-sm font-medium">{payment.cardHolder}</p>
        </div>
        {payment.cardExpiry && (
          <div className="space-y-1 text-right">
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/60">Expires</p>
            <p className="text-sm font-medium">{payment.cardExpiry}</p>
          </div>
        )}
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
