'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {IoArrowBack, IoArrowForward} from 'react-icons/io5';
import {useTranslations} from 'next-intl';

const TESTIMONIAL_AVATARS = [
  'https://educrat-react.vercel.app/assets/img/testimonials/1.png',
  'https://educrat-react.vercel.app/assets/img/testimonials/2.png',
  'https://educrat-react.vercel.app/assets/img/testimonials/3.png'
] as const;

const COUNTER_KEYS = ['studentsWorldwide', 'courseViews', 'fiveStarReviews', 'community'] as const;

type VisibleConfig = {
  slidesPerScroll: number;
};

const useVisibleConfig = () => {
  const [config, setConfig] = useState<VisibleConfig>({slidesPerScroll: 1});

  useEffect(() => {
    const compute = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setConfig({slidesPerScroll: 4});
      } else if (width >= 1024) {
        setConfig({slidesPerScroll: 3});
      } else if (width >= 768) {
        setConfig({slidesPerScroll: 2});
      } else {
        setConfig({slidesPerScroll: 1});
      }
    };

    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  return config;
};

const PeopleSay = () => {
  const t = useTranslations('peopleSay');
  const {slidesPerScroll} = useVisibleConfig();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const testimonialsRaw = t.raw('testimonials');
  const testimonials = Array.isArray(testimonialsRaw) ? (testimonialsRaw as Array<{heading: string; quote: string; name: string; role: string}>) : [];

  const updateNavState = useCallback(() => {
    const container = sliderRef.current;
    if (!container) return;

    const {scrollLeft, scrollWidth, clientWidth} = container;
    const maxScrollLeft = scrollWidth - clientWidth - 1;
    setIsAtStart(scrollLeft <= 1);
    setIsAtEnd(scrollLeft >= maxScrollLeft);
  }, []);

  useEffect(() => {
    updateNavState();
  }, [slidesPerScroll, updateNavState]);

  const handleScroll = useCallback(() => {
    updateNavState();
  }, [updateNavState]);

  const scrollBySlides = useCallback(
    (direction: 'prev' | 'next') => {
      const container = sliderRef.current;
      if (!container) return;

      const card = container.querySelector<HTMLElement>('[data-testimonial-card]');
      if (!card) return;

      const offset = card.getBoundingClientRect().width + parseFloat(getComputedStyle(container).gap || '0');
      const distance = offset * slidesPerScroll;

      container.scrollBy({left: direction === 'next' ? distance : -distance, behavior: 'smooth'});
    },
    [slidesPerScroll]
  );

  return (
    <section className="w-full bg-[#6440fb] py-28">
      <div className="mx-auto flex w-full flex-col px-4 sm:px-6 lg:px-0">
        <div className="text-center">
          <p className="text-[32px] sm:text-4xl font-semibold uppercase tracking-[4px] text-[#00ff84]">{t('title')}</p>
          <h3 className="mx-auto mt-3 max-w-[640px] text-sm sm:text-base font-semibold leading-[1.35] text-white">
            {t('subtitle')}
          </h3>
        </div>

        <div className="mx-auto mt-16 w-full">
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex snap-x snap-mandatory gap-6 sm:gap-8 overflow-x-auto scroll-smooth px-2 pb-9 [scrollbar-width:none] sm:px-4 [&::-webkit-scrollbar]:hidden"
            aria-label="Testimonial slider"
          >
            {testimonials.map((testimonial, index) => (
              <article
                key={index}
                data-testimonial-card
                className="snap-start rounded-[10px] border border-[#e0e4f5] bg-white px-6 sm:px-8 pb-6 sm:pb-7 pt-6 sm:pt-8 shadow-[0_25px_45px_rgba(12,5,78,0.14)] transition-transform duration-300 hover:-translate-y-1"
                style={{minWidth: '320px', maxWidth: '480px'}}
              >
                <h3 className="text-[16px] sm:text-[18px] font-normal leading-7 sm:leading-9 text-[#6440fb]">{testimonial.heading}</h3>
                <p className="mt-3 sm:mt-4 text-[14px] sm:text-[15px] leading-[26px] sm:leading-[30px] text-[#221f3d]">"{testimonial.quote}"</p>
                <div className="mt-4 sm:mt-5 h-px w-full bg-[#ededed]" />
                <div className="mt-5 sm:mt-6 flex items-center gap-3 sm:gap-4">
                  <img
                    src={TESTIMONIAL_AVATARS[index]}
                    alt={testimonial.name}
                    className="h-14 w-14 sm:h-15 sm:w-15 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div className="text-left text-sm leading-[1.2]">
                    <p className="text-[14px] sm:text-[15px] font-medium text-[#221f3d]">{testimonial.name}</p>
                    <p className="mt-1 text-[12px] sm:text-[13px] text-[#7f839b]">{testimonial.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 flex justify-center gap-5">
            <button
              type="button"
              onClick={() => scrollBySlides('prev')}
              className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white/80 text-white transition hover:bg-white hover:cursor-pointer hover:text-[#2f19ff] disabled:cursor-not-allowed disabled:border-white/40 disabled:text-white/40"
              aria-label="Previous testimonials"
              disabled={isAtStart}
            >
              <IoArrowBack className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBySlides('next')}
              className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white/80 text-white transition hover:bg-white hover:cursor-pointer hover:text-[#2f19ff] disabled:cursor-not-allowed disabled:border-white/40 disabled:text-white/40"
              aria-label="Next testimonials"
              disabled={isAtEnd}
            >
              <IoArrowForward className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-20 sm:mt-24 grid gap-6 sm:gap-8 text-center mx-auto max-w-[1540px] grid-cols-2 lg:grid-cols-4 px-4">
          {COUNTER_KEYS.map((key) => (
            <div
              key={key}
              className="rounded-xl px-6 sm:px-8 py-8 sm:py-10"
            >
              <p className="text-[28px] sm:text-[34px] font-semibold leading-9 sm:leading-[42px] text-[#00ff84]">{t(`counters.${key}.value`)}</p>
              <p className="mt-2 sm:mt-3 text-[11px] sm:text-[13px] font-medium uppercase tracking-[2px] sm:tracking-[3px] text-white">{t(`counters.${key}.label`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PeopleSay;
