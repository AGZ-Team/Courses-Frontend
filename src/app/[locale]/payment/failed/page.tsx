"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import { IconAlertCircle, IconRefresh, IconHome, IconHeadset } from "@tabler/icons-react";

export default function PaymentFailedPage() {
  const t = useTranslations("payment");
  const locale = useLocale();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50/50 via-white to-orange-50/30 px-4">
      <div className="w-full max-w-md text-center">
        {/* Error icon */}
        <div className="relative mx-auto mb-8 flex h-28 w-28 items-center justify-center">
          {/* Outer ring */}
          <div className="absolute inset-0 animate-pulse rounded-full bg-rose-100/60" style={{ animationDuration: "3s" }} />
          {/* Circle */}
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-red-500 shadow-xl shadow-rose-200/60">
            <IconAlertCircle className="h-12 w-12 text-white" stroke={2} />
          </div>
        </div>

        {/* Text */}
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {t("failedTitle")}
        </h1>
        <p className="mt-3 text-base text-gray-500 leading-relaxed">
          {t("failedMessage")}
        </p>

        {/* Error Card */}
        <div className="mt-8 rounded-2xl border border-rose-100 bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-rose-600">
            <IconAlertCircle className="h-4 w-4" />
            {t("paymentDeclined")}
          </div>
          <p className="mt-2 text-xs text-gray-400">
            {t("tryAgainMessage")}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/${locale}/checkout`}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200/50 transition hover:shadow-xl hover:shadow-blue-200/70"
          >
            <IconRefresh className="h-4 w-4" />
            {t("tryAgain")}
          </Link>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <IconHome className="h-4 w-4" />
            {t("backHome")}
          </Link>
        </div>

        {/* Support link */}
        <div className="mt-6">
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 transition hover:text-gray-600"
          >
            <IconHeadset className="h-3.5 w-3.5" />
            {t("contactSupport")}
          </Link>
        </div>
      </div>
    </div>
  );
}
