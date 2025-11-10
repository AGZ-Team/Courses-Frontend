import Link from 'next/link'
import React from 'react'
import {useLocale, useTranslations} from "next-intl";

export default function NavRightBanner() {
  const locale = useLocale();
  const t = useTranslations('ad');

  return (
    <div>{
                        <div className="rounded-xl bg-[#0ABAB5] p-4 sm:p-6 text-white shadow-[0_18px_40px_rgba(10,186,181,0.18)]">
                          <div className="space-y-3">
                            <p className="text-sm opacity-95">{t('title')}</p>
                            <p className="text-3xl font-extrabold leading-tight">
                              {t('subtitle')}
                            </p>
                            <Link
                              href={`/${locale}/signup`}
                              className="mt-2 inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#0ABAB5] transition hover:bg-white/90"
                            >
                              {t('cta')}
                            </Link>
                          </div>
                        </div>
                      }</div>
  )
}
