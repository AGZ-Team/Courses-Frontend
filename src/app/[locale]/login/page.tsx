import React from 'react';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import LoginDecor from '@/components/Login/LoginDecor';
import LoginForm from '@/components/Login/LoginForm';
import Image from 'next/image';
import type {Metadata} from 'next';

type PageProps = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({namespace: 'metadata.login', locale});

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LoginPage({params}: PageProps) {
  const {locale} = await params;
  setRequestLocale(locale);

  const isAr = locale === 'ar';
  const t = await getTranslations({namespace: 'login', locale});

  // Extract all translations as plain values
  const translations = {
    title: t('title'),
    subtitlePrefix: t('subtitlePrefix'),
    signupCta: t('signupCta'),
    usernameOrEmail: t('usernameOrEmail'),
    password: t('password'),
    rememberMe: t('rememberMe'),
    forgotPassword: t('forgotPassword'),
    submit: t('submit'),
    orUsing: t('orUsing'),
    facebook: t('facebook'),
    google: t('google'),
  };

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-white">
      {/* Full-bleed navy panel on the left (fixed side like reference) */}
      <div className="absolute inset-y-0 left-0 hidden w-[45vw] bg-primary md:block">
        <div className="relative h-full overflow-visible">
          {/* moving background image */}
          <Image
            src="/login/bg.png"
            alt=""
            fill
            style={{objectFit: 'cover'}}
            className="pointer-events-none absolute left-[-140px] top-1/2 w-[920px] max-w-none -translate-y-1/2 opacity-95 animate-float-slow"
          />
          {/* subtle decorative shapes (light gray on teal) */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -left-24 h-[520px] w-[520px] rounded-full bg-white/15" />
            <div className="absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-white/10" />
            <div className="absolute bottom-10 left-10 h-24 w-24 rounded-full bg-white/10" />
            <div className="absolute bottom-24 right-20 h-14 w-14 rounded-full bg-white/10" />
          </div>
          <LoginDecor side="left" locale={locale} />
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full min-h-screen ">
        {/* Light primary decorative shapes (restricted to right column) */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-[56%] -z-10">
          {/* Large hero bubble */}
          <div className="absolute top-28 right-20 h-[360px] w-[360px] rounded-full bg-[#0ABAB5]/18" />
          {/* Medium accent bubble */}
          <div className="absolute bottom-28 right-12 h-28 w-28 rounded-full bg-[#0ABAB5]/16" />
          {/* Small accents */}
          <div className="absolute top-1/2 left-8 h-20 w-20 rounded-full bg-[#0ABAB5]/14" />
          <div className="absolute bottom-10 left-24 h-12 w-12 rounded-full bg-[#0ABAB5]/12" />
        </div>
        <div dir="ltr" className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
          {/* Spacer column to balance the full-bleed panel */}
          <div className="hidden md:block md:col-start-1" />

          {/* Right: form card */}
          <div className="flex items-center justify-center px-6 py-10 md:py-12 md:col-start-2 overflow-y-auto scrollbar-hide min-h-screen md:mr-20">
            <LoginForm isAr={isAr} locale={locale} translations={translations} />
          </div>
        </div>
      </div>
    </section>
  );
}
