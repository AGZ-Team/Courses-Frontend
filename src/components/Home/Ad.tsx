'use client';

import Link from 'next/link';
import {useTranslations, useLocale} from 'next-intl';

const Ad = () => {
  const t = useTranslations('ad');
  const locale = useLocale();

  return (
    <section className="w-full bg-linear-to-r from-[#F5F7FA] via-[#E8F4F8] to-[#F5F7FA] py-8 sm:py-10 md:py-12">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4 px-4 sm:px-6 md:gap-6 md:flex-row md:items-center md:justify-between">
        {/* Left Content */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[22px] sm:text-[28px] md:text-[32px] font-bold leading-tight tracking-tight">
            <span className="text-[#0ABAB5]">{t('title')}</span>
            <br />
            <span className="text-gray-900">{t('subtitle')}</span>
          </h2>
          
        </div>

        {/* Right CTA */}
        <div className="flex flex-col sm:flex-row gap-3 md:flex-col md:gap-2 md:whitespace-nowrap">
          <Link
            href={`/${locale}/signup`}
            className="inline-flex items-center justify-center rounded-lg bg-[#0ABAB5] px-6 sm:px-8 py-2.5 text-[14px] sm:text-[15px] font-semibold text-white shadow-[0_12px_32px_rgba(10,186,181,0.3)] transition duration-300 hover:bg-[#099490] hover:shadow-[0_16px_40px_rgba(10,186,181,0.4)] hover:-translate-y-0.5 active:translate-y-0"
          >
            {t('cta')}
          </Link>

          <Link
            href={`/${locale}/courses`}
            className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 px-6 sm:px-8 py-2 text-[14px] sm:text-[15px] font-semibold text-gray-900 transition duration-300 hover:border-[#0ABAB5] hover:bg-[#F0FFFE] hover:-translate-y-0.5"
          >
            {t('cta2')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Ad;
