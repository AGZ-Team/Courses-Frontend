'use client';

import {RiBookOpenLine, RiGraduationCapLine, RiBriefcaseLine} from 'react-icons/ri';
import {useTranslations} from 'next-intl';

const REASON_ICONS = [RiBookOpenLine, RiGraduationCapLine, RiBriefcaseLine] as const;

const CoursesReasons = () => {
  const t = useTranslations('coursesReasons');
  const reasonsRaw = t.raw('reasons');
  const reasons = Array.isArray(reasonsRaw) ? (reasonsRaw as Array<{title: string; description: string}>) : [];

  return (
    <section className="w-full bg-[#18035a] py-16 sm:py-20 md:py-24 lg:py-28">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 sm:gap-14 md:gap-16 px-4 text-center sm:px-6">
        <div className="space-y-3 sm:space-y-4" data-aos="fade-up" data-aos-duration="800">
          <h2 className="text-[28px] sm:text-[32px] md:text-[36px] font-semibold text-white">
            {t('title')}
          </h2>
          <p className="text-[14px] sm:text-[15px] text-white/70">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3" data-aos="fade-up" data-aos-duration="800">
          {reasons.map((reason, index) => {
            const Icon = REASON_ICONS[index];
            return (
              <article
                key={index}
                className="group flex flex-col rounded-[18px] border border-[#362084] bg-[#1f0d6f] px-6 sm:px-8 md:px-9 py-10 sm:py-12 md:py-14 text-center text-white transition duration-300 hover:border-[#4aff9a] hover:shadow-[0_24px_60px_rgba(16,11,74,0.35)] hover:text-black hover:bg-white"
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center mx-auto rounded-2xl text-green-300 transition duration-300 group-hover:text-black">
                  <Icon className="h-10 w-10 sm:h-12 sm:w-12 transition duration-300 group-hover:text-black" aria-hidden />
                </div>
                <h3 className="mt-8 sm:mt-10 text-[18px] sm:text-[20px] font-semibold">{reason.title}</h3>
                <p className="mt-3 sm:mt-4 text-[14px] sm:text-[15px] leading-6 sm:leading-[26px]">{reason.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CoursesReasons;
