"use client";

import { useCartStore } from "@/stores/cartStore";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  IconShoppingCart,
  IconTrash,
  IconX,
  IconArrowRight,
  IconShoppingBag,
} from "@tabler/icons-react";
import { toast } from "sonner";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const t = useTranslations("cart");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const handleRemove = (id: number, title: string) => {
    removeItem(id);
    toast.success(t("removedFromCart"), {
      description: title,
    });
  };

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 z-[200] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 ${isRTL ? "left-0" : "right-0"} z-[201] flex h-full w-full max-w-[420px] flex-col bg-white shadow-[−20px_0_60px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out ${
          isOpen
            ? "translate-x-0"
            : isRTL
              ? "-translate-x-full"
              : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-teal-100">
              <IconShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {t("title")}
              </h2>
              <p className="text-xs text-gray-400">
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700 cursor-pointer"
            aria-label="Close cart"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-50">
                <IconShoppingBag className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                {t("empty")}
              </h3>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                {t("emptyDescription")}
              </p>
              <Link
                href={`/${locale}/courses`}
                onClick={onClose}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
              >
                {t("browseCourses")}
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            /* Cart Items */
            <div className="divide-y divide-gray-50 px-4 py-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group flex gap-4 rounded-2xl p-3 transition hover:bg-gray-50/60"
                >
                  {/* Image */}
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {item.author}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-primary">
                        ${item.price}
                      </span>
                      <button
                        onClick={() => handleRemove(item.id, item.title)}
                        className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-400 transition hover:bg-red-50 hover:text-red-500 cursor-pointer"
                        aria-label={`Remove ${item.title}`}
                      >
                        <IconTrash className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">{t("remove")}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Only show when there are items */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50/40 px-6 py-5 space-y-4">
            {/* Totals */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{t("subtotal")}</span>
                <span className="font-semibold text-gray-900">
                  ${totalPrice().toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-gray-900">
                  {t("total")}
                </span>
                <span className="text-xl font-bold text-primary">
                  ${totalPrice().toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid gap-2">
              <Link
                href={`/${locale}/checkout`}
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/35 hover:from-primary/90 hover:to-teal-700"
              >
                {t("checkout")}
                <IconArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer"
              >
                {t("continueShopping")}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
