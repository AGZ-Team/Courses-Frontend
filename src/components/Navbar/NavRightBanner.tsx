import Link from 'next/link'
import React from 'react'
import {useLocale, useTranslations} from "next-intl";
import { Button as MovingBorderButton } from "../ui/moving-border";

export default function NavRightBanner() {
  const locale = useLocale();
  const t = useTranslations('ad');

  return (
    <div className="space-y-3">
      <div className="w-full rounded-xl bg-[#0ABAB5] p-4 sm:p-6 text-white shadow-[0_18px_40px_rgba(10,186,181,0.18)]">
        <div className="space-y-3">
          <p className="text-sm opacity-95">{t('title')}</p>
          <p className="text-2xl md:text-3xl font-extrabold leading-tight md:whitespace-nowrap">
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

      <div className="rounded-xl py-4 flex justify-center">
        <Link
          href={`/${locale}/courses`}
          className="w-full max-w-[660px]"
        >
          <MovingBorderButton
            as="div"
            className="bg-[#c5fcfa] font-bold uppercase text-primary border-none text-xs sm:text-base px-4 py-2 hover:cursor-pointer"
            containerClassName="h-14 w-full bg-transparent"
            borderRadius="20px"
            duration={3500}
          >
            {locale === 'ar' ? 'اكتشف أحدث الدورات الآن' : 'Discover the latest courses now'}
          </MovingBorderButton>
        </Link>
      </div>
    </div>
  )
}
