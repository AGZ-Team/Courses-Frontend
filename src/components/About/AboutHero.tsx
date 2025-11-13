"use client";
import React from "react";
import Image from "next/image";
import {useLocale, useTranslations} from "next-intl";

export default function AboutHero() {
  const tHero = useTranslations('about.hero');
  const tWelcome = useTranslations('about.welcome');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8 py-16 lg:py-24 min-[1400px]:max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image collage (left on desktop) */}
          <div className="order-first lg:order-first">
            <div className="relative mx-auto w-full max-w-[520px] h-[420px] sm:h-[460px] md:h-[500px]">
              {/* Large image */}
              <div
                className={
                  // Mirror the offset in RTL and reduce negative offset on small screens
                  `absolute top-0 h-[78%] w-[64%] rounded-3xl ${
                    isRTL ? 'rounded-tl-4xl' : 'rounded-tr-4xl'
                  } overflow-hidden shadow-xl ` +
                  (isRTL
                    ? 'right-0 sm:right-[-8%] lg:right-[-20%]'
                    : 'left-0 sm:left-[-8%] lg:left-[-20%]')
                }
              >
                <Image
                  src="/aboutImages/AboutHero/main.png"
                  alt={tHero('images.collaboration')}
                  fill
                  sizes="(max-width: 1024px) 60vw, 520px"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Top-right small */}
              <div
                className={
                  `absolute top-[-3%] h-[38%] w-[38%] rounded-2xl mr-9 ${
                    isRTL ? 'rounded-tl-4xl' : 'rounded-tr-4xl'
                  } overflow-hidden shadow-md ` +
                  (isRTL
                    ? 'left-[15px] sm:left-6 md:left-8'
                    : 'right-[15px] sm:right-6 md:right-8')
                }
              >
                <Image
                  src="/aboutImages/AboutHero/second.jpg"
                  alt={tHero('images.learning')}
                  fill
                  sizes="(max-width: 1024px) 40vw, 260px"
                  className="object-cover"
                />
              </div>

              {/* Bottom-right medium */}
              <div
                className={
                  `absolute bottom-20 h-[46%] w-[48%] rounded-2xl ${
                    isRTL ? 'rounded-tl-4xl' : 'rounded-tr-4xl'
                  } overflow-hidden shadow-lg ` +
                  (isRTL ? 'left-4' : 'right-4')
                }
              >
                <Image
                  src="/aboutImages/AboutHero/thirdWithFlag.jpg"
                  alt={tHero('images.community')}
                  fill
                  sizes="(max-width: 1024px) 50vw, 300px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Text (right on desktop) */}
          <div className="order-last lg:order-last">
            <p className="text-3xl font-semibold tracking-widest uppercase text-primary mb-3">
              {tHero('badge')}
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-slate-900">
              {tWelcome('title')}
              <span className="block text-slate-700 mt-2">
                {tWelcome('highlight')}
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg leading-7 text-slate-600 max-w-2xl">
              {tWelcome('description')}
            </p>
            <div className="mt-8">
              <a
                href={`/${locale}/signup`}
                className="inline-flex h-16 items-center justify-center rounded-xl border-2 border-primary bg-transparent px-12 text-primary font-bold hover:bg-primary hover:text-white focus:outline-none focus:ring-2 ring-primary/50 transition-colors duration-200"
              >
                {tWelcome('cta')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
