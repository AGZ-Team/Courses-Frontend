import React from 'react';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/routing';
import LoginDecor from '@/components/Login/LoginDecor';
import {FaFacebook, FaGooglePlusG} from 'react-icons/fa';
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

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-white">
      {/* Full-bleed navy panel on the left (fixed side like reference) */}
      <div className="absolute inset-y-0 left-0 hidden w-[45vw] bg-[#0b0440] md:block">
        <div className="relative h-full overflow-hidden">
          {/* moving background image */}
          <Image
            src="/assets/img/login/bg.png"
            alt=""
            fill
            style={{objectFit: 'cover'}}
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
          <div dir={isAr ? 'rtl' : 'ltr'} className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-[0_10px_40px_rgba(13,13,18,0.08)] ring-1 ring-black/5 md:p-8">
            <div className={`${isAr ? 'text-right' : ''}`}>
              <h1 className="mb-2 text-[32px] font-bold leading-tight text-[#0b0b2b]">{t('title')}</h1>
              <p className="mb-6 text-[15px] text-gray-500">
                {t('subtitlePrefix')}
                <Link href="/signup" className="ms-2 font-semibold text-indigo-600 hover:text-indigo-500">
                  {t('signupCta')}
                </Link>
              </p>
            </div>

            <form className="space-y-5" action="#" method="post">
              {/* Username / Email */}
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                  {t('usernameOrEmail')}
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                    className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition focus:border-indigo-500"
                    placeholder={isAr ? 'الاسم' : 'Name'}
                    dir={isAr ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                  {t('password')}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition focus:border-indigo-500"
                  placeholder="••••••••"
                  dir={isAr ? 'rtl' : 'ltr'}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <label className={`flex items-center gap-2 text-sm text-gray-600 ${isAr ? 'flex-row-reverse' : ''}`}>
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 bg-white accent-indigo-600 focus:ring-indigo-500" />
                  <span>{t('rememberMe')}</span>
                </label>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  {t('forgotPassword')}
                </a>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#00FF91] px-4 py-3 text-center text-[15px] font-semibold text-black shadow-sm transition hover:brightness-95 focus-visible:outline-none"
              >
                {t('submit')}
              </button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-2 text-xs uppercase tracking-wide text-gray-400">
                    {t('orUsing')}
                  </span>
                </div>
              </div>

              {/* Social buttons */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#2563EB] bg-white px-4 py-2.5 text-sm font-medium text-[#2563EB] transition hover:bg-blue-50"
                >
                  {/* Facebook icon */}
                  <FaFacebook className='text-3xl'/>
                  {t('facebook')}
                </button>
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#EF4444] bg-white px-4 py-2.5 text-sm font-medium text-[#EF4444] transition hover:bg-red-50"
                >
                  {/* Google icon */}
                  <FaGooglePlusG className='text-3xl'/>
                  {t('google')}
                </button>
              </div>
            </form>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
