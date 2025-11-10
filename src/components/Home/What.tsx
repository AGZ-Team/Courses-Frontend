'use client';

import {useTranslations} from 'next-intl';
import Image from 'next/image';

const ICON_MAP: Record<string, string> = {
  // English titles
  '1. Worldwide': '/svgs/what/globe.svg',
  '2. Earnings': '/svgs/what/money.svg',
  '3. Secure & Private': '/svgs/what/shield.svg',
  '4. Community': '/svgs/what/community.svg',
  // Arabic titles
  '1. حول العالم': '/svgs/what/globe.svg',
  '2. الأرباح': '/svgs/what/money.svg',
  '3. آمن وخاص': '/svgs/what/shield.svg',
  '4. مجتمع': '/svgs/what/community.svg',
};

const What = () => {
  const t = useTranslations('what');
  const reasonsRaw = t.raw('reasons');
  const reasons = Array.isArray(reasonsRaw) ? (reasonsRaw as Array<{title: string; description: string}>) : [];

  return (
    <section className="w-full bg-white py-16 sm:py-20 md:py-24 lg:py-28">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 sm:gap-14 md:gap-16 px-4 text-center sm:px-6">
        <div className="space-y-3 sm:space-y-4" data-aos="fade-up" data-aos-duration="800">
          <h2 className="text-[28px] sm:text-[32px] md:text-[36px] font-semibold text-[#0ABAB5]">
            {t('title')}
          </h2>
          <p className="text-[14px] sm:text-[15px] text-[#555555] max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid gap-5 sm:gap-6 md:grid-cols-4 lg:grid-cols-4" data-aos="fade-up" data-aos-duration="800">
          {reasons.map((reason, index) => {
            const iconPath = ICON_MAP[reason.title] || '/svgs/globe.svg';
            
            return (
              <article
                key={index}
                className="group flex flex-col rounded-[18px] border border-gray-200 bg-gray-50 px-6 sm:px-8 md:px-9 py-10 sm:py-12 md:py-14 text-center text-gray-900 transition duration-300 sm:hover:border-[#0ABAB5] sm:hover:shadow-[0_24px_60px_rgba(10,186,181,0.15)] sm:hover:bg-[#0ABAB5]"
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center mx-auto rounded-2xl text-gray-600 transition duration-300 group-hover:text-white">
                  <Image 
                    src={iconPath} 
                    alt="" 
                    width={48} 
                    height={48} 
                    className="h-10 w-10 sm:h-12 sm:w-12 transition duration-300 group-hover:opacity-80" 
                    aria-hidden 
                  />
                </div>
                <h3 className="mt-8 sm:mt-10 text-[18px] sm:text-[20px] font-semibold whitespace-nowrap transition-colors sm:group-hover:text-white">{reason.title}</h3>
                <p className="mt-3 sm:mt-4 text-[14px] sm:text-[15px] leading-6 sm:leading-[26px] transition-colors sm:group-hover:text-white">{reason.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default What;
