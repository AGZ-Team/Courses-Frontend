"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { createCharge } from "@/services/paymentService";
import type { PaymentMethod } from "@/types/payment";
import { toast } from "sonner";
import {
  IconCreditCard,
  IconBuildingBank,
  IconBrandApple,
  IconDeviceMobile,
  IconArrowRight,
  IconLock,
  IconShieldCheck,
} from "@tabler/icons-react";

const PAYMENT_METHODS: { id: PaymentMethod; icon: typeof IconCreditCard; gradient: string }[] = [
  { id: "card", icon: IconCreditCard, gradient: "from-blue-500 to-indigo-600" },
  { id: "mada", icon: IconBuildingBank, gradient: "from-emerald-500 to-teal-600" },
  { id: "apple", icon: IconBrandApple, gradient: "from-gray-800 to-black" },
  { id: "samsung", icon: IconDeviceMobile, gradient: "from-blue-600 to-blue-800" },
];

export default function CheckoutPage() {
  const t = useTranslations("payment");
  const searchParams = useSearchParams();

  // Get course IDs from URL params
  const coursesParam = searchParams?.get("courses") ?? "";
  const courseIds = coursesParam
    .split(",")
    .map((id) => parseInt(id.trim(), 10))
    .filter((id) => !isNaN(id));

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast.error(t("fillAllFields"));
      return;
    }

    if (courseIds.length === 0) {
      toast.error(t("noCoursesSelected"));
      return;
    }

    setLoading(true);
    try {
      const response = await createCharge({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        method,
        courses: courseIds,
      });

      if (response.url) {
        window.location.href = response.url;
      } else {
        toast.error(t("paymentError"));
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        error instanceof Error ? error.message : t("paymentError")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:py-20">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200/60">
            <IconLock className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t("checkoutTitle")}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {t("checkoutSubtitle")}
          </p>
        </div>

        {/* Checkout Card */}
        <form onSubmit={handleSubmit}>
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            {/* Personal Info */}
            <div className="border-b border-gray-100 p-6 sm:p-8">
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-400">
                {t("personalInfo")}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="checkout-first-name"
                    className="mb-1.5 block text-xs font-medium text-gray-600"
                  >
                    {t("firstName")}
                  </label>
                  <input
                    id="checkout-first-name"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    placeholder={t("firstNamePlaceholder")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="checkout-last-name"
                    className="mb-1.5 block text-xs font-medium text-gray-600"
                  >
                    {t("lastName")}
                  </label>
                  <input
                    id="checkout-last-name"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    placeholder={t("lastNamePlaceholder")}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="checkout-email"
                  className="mb-1.5 block text-xs font-medium text-gray-600"
                >
                  {t("email")}
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  placeholder={t("emailPlaceholder")}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="border-b border-gray-100 p-6 sm:p-8">
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-400">
                {t("paymentMethod")}
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {PAYMENT_METHODS.map((pm) => {
                  const Icon = pm.icon;
                  const isSelected = method === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setMethod(pm.id)}
                      className={`group relative flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-4 text-center transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/60 shadow-md shadow-blue-100/60"
                          : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${pm.gradient} shadow-lg transition-transform duration-200 ${
                          isSelected ? "scale-110" : "group-hover:scale-105"
                        }`}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          isSelected ? "text-blue-700" : "text-gray-600"
                        }`}
                      >
                        {t(`methods.${pm.id}`)}
                      </span>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-500 ring-2 ring-white">
                          <svg
                            className="h-4 w-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-b border-gray-100 bg-gray-50/40 p-6 sm:p-8">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{t("coursesSelected")}</span>
                <span className="font-semibold text-gray-900">
                  {courseIds.length} {courseIds.length === 1 ? t("course") : t("courses")}
                </span>
              </div>
            </div>

            {/* Submit */}
            <div className="p-6 sm:p-8">
              <button
                type="submit"
                disabled={loading || courseIds.length === 0}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-200/60 transition-all duration-200 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-200/80 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none cursor-pointer"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    <IconLock className="h-4 w-4" />
                    {t("payNow")}
                    <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              {/* Trust badges */}
              <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-gray-400">
                <div className="flex items-center gap-1">
                  <IconShieldCheck className="h-3.5 w-3.5" />
                  {t("securePayment")}
                </div>
                <div className="flex items-center gap-1">
                  <IconLock className="h-3.5 w-3.5" />
                  {t("encrypted")}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
