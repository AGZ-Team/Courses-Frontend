"use client";

import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/stores/cartStore";
import { IconCircleCheck, IconArrowRight, IconHome } from "@tabler/icons-react";

export default function PaymentSuccessPage() {
  const t = useTranslations("payment");
  const locale = useLocale();
  const searchParams = useSearchParams();

  // Parse Tap redirect params
  const tapId = searchParams?.get("tap_id") ?? null;

  // Clear the cart after successful payment
  useEffect(() => {
    useCartStore.getState().clearCart();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 px-4">
      <div className="w-full max-w-md text-center">
        {/* Success animation container */}
        <div className="relative mx-auto mb-8 flex h-28 w-28 items-center justify-center">
          {/* Outer ring pulse */}
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-200/40" style={{ animationDuration: "2s" }} />
          {/* Gradient circle */}
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-xl shadow-emerald-200/60">
            <IconCircleCheck className="h-12 w-12 text-white" stroke={2} />
          </div>
        </div>

        {/* Text */}
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {t("successTitle")}
        </h1>
        <p className="mt-3 text-base text-gray-500 leading-relaxed">
          {t("successMessage")}
        </p>

        {/* Card with details */}
        <div className="mt-8 rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-600">
            <IconCircleCheck className="h-4 w-4" />
            {t("paymentConfirmed")}
          </div>
          <p className="mt-2 text-xs text-gray-400">
            {t("confirmationEmail")}
          </p>
          {tapId && (
            <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 font-mono text-xs text-gray-500">
              {t("chargeId")}: {tapId}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/${locale}/courses`}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200/50 transition hover:shadow-xl hover:shadow-emerald-200/70"
          >
            {t("goToCourses")}
            <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <IconHome className="h-4 w-4" />
            {t("backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
