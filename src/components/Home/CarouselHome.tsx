'use client';

import Image from 'next/image';
import {useEffect, useRef, useState} from 'react';
import {useTranslations, useLocale} from 'next-intl';

type BrandTranslationKey = 'amazon' | 'amd' | 'cisco' | 'dropcam' | 'logitech' | 'spotify';

type Brand = {
  translationKey: BrandTranslationKey;
  image: string;
  width: number;
  height: number;
};

const BRANDS = [
  {
    translationKey: 'amazon',
    image: 'svgs/c1.svg',
    width: 90,
    height: 32
  },
  {
    translationKey: 'amd',
    image: 'svgs/c2.svg',
    width: 72,
    height: 28
  },
  {
    translationKey: 'cisco',
    image: 'svgs/c3.svg',
    width: 76,
    height: 32
  },
  {
    translationKey: 'dropcam',
    image: 'svgs/c4.svg',
    width: 68,
    height: 30
  },
  {
    translationKey: 'logitech',
    image: 'svgs/c5.svg',
    width: 92,
    height: 32
  },
  {
    translationKey: 'spotify',
    image: 'svgs/c6.svg',
    width: 88,
    height: 28
  }
] as const satisfies readonly Brand[];

type CategoryTranslationKey =
  | 'engineering'
  | 'personal'
  | 'finance'
  | 'design'
  | 'marketing'
  | 'development'
  | 'social'
  | 'ai'
  | 'languages';

type Category = {
  translationKey: CategoryTranslationKey;
  image: string;
  gradient: string;
};

const CATEGORIES = [
  {
    translationKey: 'engineering',
    image: '/svgs/4.svg',
    gradient: 'from-[#f4f7ff] via-[#edf2ff] to-[#e7ecff]'
  },
  {
    translationKey: 'personal',
    image: '/svgs/5.svg',
    gradient: 'from-[#f5efff] via-[#eee4ff] to-[#e7d8ff]'
  },
  {
    translationKey: 'finance',
    image: '/svgs/6.svg',
    gradient: 'from-[#eff8ff] via-[#e5f2ff] to-[#dcecff]'
  },
  {
    translationKey: 'design',
    image: '/svgs/1.svg',
    gradient: 'from-[#f6f2ff] via-[#eee6ff] to-[#e3d7ff]'
  },
  {
    translationKey: 'marketing',
    image: '/svgs/2.svg',
    gradient: 'from-[#f5f4ff] via-[#ecebff] to-[#e3e2ff]'
  },
  {
    translationKey: 'development',
    image: '/svgs/3.svg',
    gradient: 'from-[#f1f5ff] via-[#e7edff] to-[#dee6ff]'
  },
  {
    translationKey: 'social',
    image: '/svgs/5.svg',
    gradient: 'from-[#f5efff] via-[#eee4ff] to-[#e7d8ff]'
  },
  {
    translationKey: 'ai',
    image: '/svgs/2.svg',
    gradient: 'from-[#f0f9ff] via-[#e0f2fe] to-[#cfe7fd]'
  },
  {
    translationKey: 'languages',
    image: '/svgs/1.svg',
    gradient: 'from-[#fef6ff] via-[#f5e9ff] to-[#ebdbff]'
  }
] as const satisfies readonly Category[];

const SCROLL_AMOUNT = 320;
const ITEMS_PER_VIEW = 3;

const CarouselHome = () => {
  const t = useTranslations('carouselHome');
  const locale = useLocale();
  const isAr = locale === 'ar';
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);
  const dotCount = Math.max(1, Math.ceil(CATEGORIES.length / ITEMS_PER_VIEW));

  const syncIndicator = () => {
    const node = carouselRef.current;
    if (!node) return;

    const maxScroll = Math.max(node.scrollWidth - node.clientWidth, 1);
    const progress = node.scrollLeft / maxScroll;
    const nextActive = Math.round(progress * (dotCount - 1));
    setActiveDot(nextActive);
  };

  useEffect(() => {
    const node = carouselRef.current;
    if (!node) return;

    node.addEventListener('scroll', syncIndicator, {passive: true});
    return () => node.removeEventListener('scroll', syncIndicator);
  }, [dotCount]);

  const handleScroll = (direction: 'left' | 'right') => {
    const node = carouselRef.current;
    if (!node) return;

    const delta = direction === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT;
    const adjustedDelta = isAr ? -delta : delta;
    node.scrollBy({left: adjustedDelta, behavior: 'smooth'});
    requestAnimationFrame(syncIndicator);
  };

 
  return (
    <section className="relative z-10 w-full bg-white py-28 sm:py-32">
      <div className="mx-auto flex w-full max-w-[1380px] flex-col items-center gap-16 px-4 text-center sm:px-6">
        <div className="space-y-10">
          <div className="space-y-6">
            <p className="text-base font-semibold uppercase tracking-[0.32em] text-[#0ABAB5] mb-10">
              {t('trustedHeading')}
            </p>

            <div className="flex w-full flex-wrap items-center justify-center gap-x-16 gap-y-8 text-[#6b6b8c]" >
              {BRANDS.map(({translationKey, image, width, height}) => {
                const label = t(`brands.${translationKey}`);
                return (
                  <div key={translationKey} className="flex h-16 w-42 items-center justify-center text-sm" aria-label={label}>
                    <Image
                      src={image}
                      alt={label}
                      width={width}
                      height={height}
                      className="h-auto w-full max-w-[102px] object-contain opacity-70 transition hover:opacity-100"
                      style={{ width: 'auto', height: 'auto' }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-[2.25rem] font-bold text-[#120a5d] sm:text-[2.55rem]">{t('title')}</h2>
            <p className="text-[15px] text-[#6d6a7f]">{t('description')}</p>
          </div>
        </div>

        <div className="relative w-full">
          <div
            ref={carouselRef}
            className="no-scrollbar w-full flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-1 py-6"
            aria-label={t('title')}
          >
            {CATEGORIES.map(({translationKey, image, gradient}, index) => {
              const name = t(`categories.${translationKey}.name`);
              const courses = t(`categories.${translationKey}.courses`);
              const [firstLine, secondLine] = (() => {
                const parts = name.split(' ');
                if (parts.length > 1) {
                  return [parts[0], parts.slice(1).join(' ')];
                }

                const midpoint = Math.ceil(name.length / 2);
                return [name.slice(0, midpoint), name.slice(midpoint)];
              })();

              return (
                <article
                  key={translationKey}
                  className={`group relative flex min-w-[208px] max-w-[248px] flex-1 snap-center flex-col items-center gap-6  bg-slate-100 px-8 py-10 text-center text-[#140a5b]  transition duration-300 ease-out  focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0ABAB5] hover:bg-[#0ABAB5] hover:text-white`}
                  
                  tabIndex={0}
                >
                  <span
                    className={`flex h-[88px] w-[88px] items-center justify-center rounded-[28px] bg-white text-[#0ABAB5] transition duration-300`}
                    aria-hidden
                  >
                    <div className={`flex h-[72px] w-[72px] items-center justify-center`}>
                      <Image src={image} alt="" width={42} height={42} className="h-10 w-10 object-contain" style={{ width: 'auto', height: 'auto' }} />
                    </div>
                  </span>

                  <div className="space-y-2 transition duration-300 group-hover:translate-y-[1px]">
                    <h3 className="text-lg font-semibold leading-snug group-hover:text-white">
                      <span className="block">{firstLine}</span>
                      <span className="block">{secondLine}</span>
                    </h3>
                    <p className={`text-[13px] font-medium 'text-[#716f86] group-hover:text-white/90'}`}>{courses}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="pointer-events-none absolute -bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center gap-4">
            <div className="flex items-center gap-4" dir='ltr'>
              <button
                type="button"
                onClick={() => handleScroll(isAr ? 'right' : 'left')}
                className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#e3e2f4] bg-white text-[#0ABAB5] shadow-[0_12px_32px_rgba(21,11,85,0.12)] transition hover:border-[#0ABAB5] hover:text-[#0ABAB5]"
              >
                <svg
                  width="16"
                  height="13"
                  viewBox="0 0 16 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5.5 12.5L0 6.5L5.5 0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M0.75 6.5H15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="sr-only">{t('aria.prev')}</span>
              </button>
              <button
                type="button"
                onClick={() => handleScroll(isAr ? 'left' : 'right')}
                className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#e3e2f4] bg-white text-[#0ABAB5] shadow-[0_12px_32px_rgba(21,11,85,0.12)] transition hover:border-[#0ABAB5] hover:text-[#0ABAB5]"
              >
                <svg
                  width="16"
                  height="13"
                  viewBox="0 0 16 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.5 0.5L16 6.5L10.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15.25 6.5H0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="sr-only">{t('aria.next')}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {Array.from({length: dotCount}).map((_, index) => (
                <span
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeDot ? 'w-7 bg-[#0ABAB5]' : 'w-3 bg-[#d8d7e9]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarouselHome;
