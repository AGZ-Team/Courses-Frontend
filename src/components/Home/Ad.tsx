'use client';

import Link from 'next/link';
import {useTranslations, useLocale} from 'next-intl';

const Ad = () => {
  const t = useTranslations('ad');
  const locale = useLocale();

  return (
    <section className="w-full bg-[#4b35f5] py-12 sm:py-16 md:py-20">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-6 px-4 text-center sm:px-6 md:flex-row md:items-center md:justify-between md:text-left">
        <h2 className="text-[24px] font-semibold text-white sm:text-[28px] md:text-[32px] leading-snug">
          {t('title')} <span className="text-[#44ffae]">{t('count')}</span>
          <br className="hidden sm:block" /> {t('subtitle')}
        </h2>

        <Link
          href={`/${locale}/courses`}
          className="inline-flex items-center justify-center rounded-full bg-[#44ffae] px-6 sm:px-8 py-2.5 sm:py-3 text-[14px] sm:text-[15px] font-semibold text-[#120847] shadow-[0_18px_40px_rgba(15,9,69,0.25)] transition hover:translate-y-[-2px] hover:bg-[#3de197] whitespace-nowrap"
        >
          {t('cta')}
        </Link>
      </div>
    </section>
  );
};

export default Ad;
