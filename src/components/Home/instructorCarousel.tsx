'use client';

import Image from 'next/image';
import Link from 'next/link';
import {LuCirclePlay, LuStar, LuUsers} from 'react-icons/lu';
import {FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter} from 'react-icons/fa';
import {HiOutlineArrowUpRight} from 'react-icons/hi2';
import {useTranslations} from 'next-intl';

const SOCIAL_ICONS = [
  {key: 'facebook', href: '#', Icon: FaFacebookF},
  {key: 'twitter', href: '#', Icon: FaTwitter},
  {key: 'instagram', href: '#', Icon: FaInstagram},
  {key: 'linkedin', href: '#', Icon: FaLinkedinIn}
] as const;

const INSTRUCTOR_IMAGES = [
  'https://educrat-react.vercel.app/assets/img/team/1.png',
  'https://educrat-react.vercel.app/assets/img/team/2.png',
  'https://educrat-react.vercel.app/assets/img/team/3.png',
  'https://educrat-react.vercel.app/assets/img/team/4.png'
] as const;

const INSTRUCTOR_RATINGS = ['4.5', '3.8', '5.0', '4.2'] as const;

const InstructorCarousel = () => {
  const t = useTranslations('instructorCarousel');
  const instructorsRaw = t.raw('instructors');
  const instructors = Array.isArray(instructorsRaw) ? (instructorsRaw as Array<{name: string; role: string; students: string; courses: string}>) : [];

  return (
    <section className="w-full bg-white py-16 sm:py-20 md:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-[1380px] px-4 sm:px-6">
        <div className="flex flex-col gap-6 sm:gap-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3 sm:space-y-4" data-aos="fade-left" data-aos-duration="600">
            <h2 className="text-[28px] sm:text-[32px] md:text-[36px] font-semibold text-[#131022]">
              {t('title')}
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[#4f4a63]">{t('subtitle')}</p>
          </div>

          <div data-aos="fade-left" data-aos-duration="600">
            <Link
              href="/instructors-list"
              className="inline-flex items-center gap-2 sm:gap-3 rounded-full border border-[#d5d6e6] bg-white px-5 sm:px-6 py-2.5 sm:py-3 text-[14px] sm:text-[15px] font-medium text-[#4b35f5] shadow-[0_12px_24px_rgba(45,27,153,0.08)] transition hover:border-[#4b35f5] hover:bg-[#4b35f5] hover:text-white"
            >
              {t('viewAll')}
              <HiOutlineArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 md:mt-14 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {instructors.map((instructor, index) => (
            <article
              key={index}
              className="group flex flex-col"
              data-aos="fade-left"
              data-aos-duration="600"
              data-aos-delay={index * 120}
            >
              <div className="relative overflow-hidden rounded-[18px] bg-[#f3eefc]">
                <div className="relative aspect-[0.95] w-full">
                  <Image
                    src={INSTRUCTOR_IMAGES[index]}
                    alt={instructor.name}
                    fill
                    sizes="(min-width: 1280px) 20vw, (min-width: 640px) 40vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    priority={index === 0}
                  />

                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#1a064fcc] opacity-0 transition duration-300 group-hover:opacity-100">
                    <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 text-white">
                      {SOCIAL_ICONS.map(({key, href, Icon}) => (
                        <Link
                          key={key}
                          href={href}
                          aria-label={t(`social.${key}`)}
                          className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white hover:text-[#4b35f5]"
                        >
                          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-6">
                <h3 className="text-[17px] sm:text-[18px] font-semibold text-[#131022]">{instructor.name}</h3>
                <p className="mt-1 text-[13px] sm:text-[14px] text-[#6b6a82]">{instructor.role}</p>

                <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-3 sm:gap-4 text-[13px] sm:text-[14px] text-[#292845]">
                  <span className="flex items-center gap-1.5 sm:gap-2 text-[#fbaf37]">
                    <LuStar className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                    {INSTRUCTOR_RATINGS[index]}
                  </span>
                  <span className="flex items-center gap-1.5 sm:gap-2 text-[#6b6a82]">
                    <LuUsers className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                    {instructor.students}
                  </span>
                  <span className="flex items-center gap-1.5 sm:gap-2 text-[#6b6a82]">
                    <LuCirclePlay className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                    {instructor.courses}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 sm:mt-14 md:mt-16 text-center text-[14px] sm:text-[15px] text-[#4f4a63]" data-aos="fade-left" data-aos-duration="600">
          {t('becomeInstructor')}{' '}
          <Link href="/instructor-become" className="text-[#4b35f5] underline decoration-2 underline-offset-4">
            {t('becomeInstructorLink')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InstructorCarousel;
