import Link from 'next/link'
import React from 'react'
import {useLocale, useTranslations} from "next-intl";
import { RiArrowRightLine, RiArrowLeftLine } from 'react-icons/ri'
import Image from 'next/image'
import { Button as MovingBorderButton } from "../ui/moving-border";

export default function NavRightBannerExplore() {
  const locale = useLocale();
  const t = useTranslations('ad');
  const secondaryLabel = locale === 'ar' ? 'اعرف المزيد' : 'Learn More';
  const ArrowIcon = locale === 'ar' ? RiArrowLeftLine : RiArrowRightLine;

  return (
    <div className="space-y-3">
      <div className={`relative w-full max-w-[400px] rounded-xl bg-[#0ABAB5] p-4 ${locale === 'ar' ? 'pl-24 sm:pl-28' : 'pr-24 sm:pr-28'} text-white shadow-[0_18px_40px_rgba(10,186,181,0.18)] overflow-hidden`}>
        <div className="space-y-3 relative z-10">
          <p className="text-sm opacity-95">{t('title')}</p>
          <p className="text-2xl md:text-3xl font-extrabold leading-tight md:whitespace-nowrap">
            {t('subtitle')}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              href={`/${locale}/signup`}
              className="group inline-flex items-center gap-1 justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0ABAB5] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0ABAB5]"
            >
              {t('cta')}
              <ArrowIcon className={`h-4 w-4 transition-transform duration-300 ease-out ${locale === 'ar' ? 'group-hover:-translate-x-1.5' : 'group-hover:translate-x-1.5'}`} aria-hidden="true" />
            </Link>
            <Link
              href={`/${locale}/courses`}
              className="group inline-flex items-center gap-1 justify-center rounded-full border border-white/80 bg-white/0 px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0ABAB5]"
            >
              {secondaryLabel}
              <ArrowIcon className={`h-4 w-4 transition-transform duration-300 ease-out ${locale === 'ar' ? 'group-hover:-translate-x-1.5' : 'group-hover:translate-x-1.5'}`} aria-hidden="true" />
            </Link>
          </div>
        </div>
        {/* Pointer Image */}
        <div className={`absolute bottom-0 ${locale === 'ar' ? 'left-2' : 'right-2'} z-0 flex items-end h-full`} aria-hidden="true">
          <Image
            src="/navBanner/personPointer.png"
            alt="Pointer character"
            width={140}
            height={280}
            className={`object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)] opacity-95 origin-bottom ${locale === 'ar' ? 'scale-x-[-1]' : ''}`}
            priority
          />
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
