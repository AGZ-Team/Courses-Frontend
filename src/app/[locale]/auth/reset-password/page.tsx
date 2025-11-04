import React from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import ResetPasswordInstructions from '@/components/Auth/ResetPasswordInstructions';
import LoginDecor from '@/components/Login/LoginDecor';
import Image from 'next/image';
import type { Metadata } from 'next';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ namespace: 'metadata.resetPassword', locale });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function ResetPasswordPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isAr = locale === 'ar';
  const t = await getTranslations({ namespace: 'resetPassword', locale });

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-white">
      {/* Full-bleed navy panel on the left */}
      <div className="absolute inset-y-0 left-0 hidden w-[45vw] bg-[#0b0440] md:block">
        <div className="relative h-full overflow-hidden">
          {/* moving background image */}
          <Image
            src="/assets/bg.png"
            alt=""
            fill
            style={{ objectFit: 'cover' }}
            className="pointer-events-none absolute left-[-140px] top-1/2 w-[920px] max-w-none -translate-y-1/2 opacity-95 animate-float-slow"
          />
          <LoginDecor side="left" />
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full min-h-screen max-w-[1200px]">
        <div dir="ltr" className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
          {/* Spacer column to balance the full-bleed panel */}
          <div className="hidden md:block md:col-start-1" />

          {/* Right: form card */}
          <div className="flex items-center justify-center px-6 py-10 md:py-12 md:col-start-2 overflow-y-auto scrollbar-hide min-h-screen">
            <div
              dir={isAr ? 'rtl' : 'ltr'}
              className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-[0_10px_40px_rgba(13,13,18,0.08)] ring-1 ring-black/5 md:p-8"
            >
              <div className={`${isAr ? 'text-right' : ''}`}>
                <h1 className="mb-2 text-[32px] font-bold leading-tight text-[#0b0b2b]">
                  {t('title')}
                </h1>
                <p className="mb-6 text-[15px] text-gray-500">{t('subtitle')}</p>
              </div>

              <ResetPasswordInstructions locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
