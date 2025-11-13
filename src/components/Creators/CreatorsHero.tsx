'use client';

import Image from 'next/image';
import Link from 'next/link';
import {LuCirclePlay, LuStar, LuUsers} from 'react-icons/lu';
import {FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter} from 'react-icons/fa';
import {HiOutlineArrowUpRight} from 'react-icons/hi2';
import {useLocale, useTranslations} from 'next-intl';

const SOCIAL_LINKS = [
  {label: 'facebook', href: '#', Icon: FaFacebookF},
  {label: 'x', href: '#', Icon: FaTwitter},
  {label: 'instagram', href: '#', Icon: FaInstagram},
  {label: 'linkedin', href: '#', Icon: FaLinkedinIn}
] as const;


const CreatorsHero = () => {
  const locale = useLocale();
  const tHero = useTranslations('creatorsHero');
  const t = useTranslations('instructorCarousel');
  const tSocial = useTranslations('instructorCarousel.social');
  const creatorsRaw = t.raw('instructors');
  const creators = Array.isArray(creatorsRaw) 
    ? (creatorsRaw as Array<{name: string; role: string; students: string; courses: string}>) 
    : [];
  
  const CREATORS = creators.map((creator, idx) => ({
    id: idx + 1,
    ...creator,
    image: `/instructors/${idx + 1}.png`,
    followers: creator.students,
    earnings: creator.courses,
    rating: ['4.9', '4.7', '5.0', '4.8'][idx] || '4.9'
  }));
  return (
    <section className="w-full bg-white py-24 sm:py-28">
      <div className="mx-auto w-full max-w-[1380px] px-4 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4" data-aos="fade-left" data-aos-duration="600">
            <h2 className="text-[32px] font-semibold text-[#131022] sm:text-[36px]">
              {tHero('title')}
            </h2>
            <p className="text-[15px] text-[#4f4a63]">{tHero('subtitle')}</p>
          </div>

          <div className="flex flex-col gap-3" data-aos="fade-left" data-aos-duration="600">
            <Link
              href={`/${locale}/signup?role=creator`}
              className="inline-flex items-center gap-3 rounded-full border border-primary bg-primary px-6 py-3 text-[15px] font-medium text-white shadow-[0_12px_24px_rgba(10,186,181,0.35)] transition hover:border-primary hover:bg-white hover:text-primary"
            >
              {tHero('becomeCreator')}
              <HiOutlineArrowUpRight className="h-5 w-5" aria-hidden />
            </Link>
            <Link
              href={`/${locale}/signup?role=influencer`}
              className="inline-flex items-center gap-3 rounded-full border border-[#d5d6e6] bg-white px-6 py-3 text-[15px] font-medium text-[#0ABAB5] shadow-[0_12px_24px_rgba(45,27,153,0.08)] transition hover:border-[#0ABAB5] hover:bg-[#0ABAB5] hover:text-white"
            >
              {tHero('signUpInfluencer')}
              <HiOutlineArrowUpRight className="h-5 w-5" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 xl:grid-cols-4">
          {CREATORS.map((creator, index) => (
            <article
              key={creator.id}
              className="group flex flex-col"
              data-aos="fade-left"
              data-aos-duration="600"
              data-aos-delay={index * 120}
            >
              <div className="relative overflow-hidden rounded-[18px] bg-[#f3eefc] ">
                <div className="relative mx-auto w-[95%] transition-all duration-500 group-hover:w-full">
                  <div className="relative aspect-2/4 w-full">
                    <Image
                      src={creator.image}
                      alt={creator.name}
                      fill
                      sizes="(min-width: 1280px) 20vw, (min-width: 640px) 40vw, 100vw"
                      className="object-cover object-center transition duration-500 group-hover:scale-[1.04]"
                      priority={index === 0}
                    />

                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#0ABAB5cc] opacity-0 transition duration-300 group-hover:opacity-100">
                      <div className="pointer-events-auto flex items-center gap-3 text-white">
                        {SOCIAL_LINKS.map(({label, href, Icon}) => (
                          <Link
                            key={label}
                            href={href}
                            aria-label={tSocial(label as 'facebook' | 'x' | 'instagram' | 'linkedin')}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white hover:text-[#0ABAB5]"
                          >
                            <Icon className="h-4 w-4" aria-hidden />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-[18px] font-semibold text-[#131022]">{creator.name}</h3>
                <p className="mt-1 text-[14px] text-[#6b6a82]">{creator.role}</p>

                <div className="mt-5 flex flex-wrap items-center gap-4 text-[14px] text-[#292845]">
                  <span className="flex items-center gap-2 text-[#0ABAB5]">
                    <LuStar className="h-4 w-4" aria-hidden />
                    {creator.rating}
                  </span>
                  <span className="flex items-center gap-2 text-[#6b6a82]">
                    <LuUsers className="h-4 w-4" aria-hidden />
                    {creator.followers}
                  </span>
                  <span className="flex items-center gap-2 text-[#6b6a82]">
                    <LuCirclePlay className="h-4 w-4" aria-hidden />
                    {creator.earnings}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center text-[15px] text-[#4f4a63]" data-aos="fade-left" data-aos-duration="600">
          {tHero('footerText')}{' '}
          <Link href={`/${locale}/signup?role=influencer`} className="text-[#0ABAB5] underline decoration-2 underline-offset-4 font-medium">
            {tHero('footerLink')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CreatorsHero;
