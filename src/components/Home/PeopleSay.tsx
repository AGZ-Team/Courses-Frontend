'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {IoArrowBack, IoArrowForward} from 'react-icons/io5';

const POSITION_TOLERANCE = 6;

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
  const locale = useLocale();
  const isAr = locale === 'ar';
  const t = useTranslations('peopleSay');
  const tAria = useTranslations('peopleSay.aria');
  const {slidesPerScroll} = useVisibleConfig();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  
  const testimonialsRaw = t.raw('testimonials');
  const testimonials = Array.isArray(testimonialsRaw)
    ? (testimonialsRaw as Array<{heading: string; quote: string; name: string; role: string}>).map((item, idx) => ({
        id: idx,
        ...item,
        avatar: `https://educrat-react.vercel.app/assets/img/testimonials/${(idx % 4) + 1}.png`
      }))
    : [];

  // Add two more cards by duplicating from the start to enable arrow scrolling
  const extendedTestimonials = testimonials.concat(
    testimonials.slice(0, 2).map((t, i) => ({...t, id: testimonials.length + i}))
  );
    
  const countersRaw = t.raw('counters');
  const counters = countersRaw && typeof countersRaw === 'object' 
    ? Object.entries(countersRaw as Record<string, {value: string; label: string}>).map(([key, val], idx) => ({
        id: idx + 1,
        ...val
      }))
    : [];

  const getNormalizedScrollLeft = useCallback(
    (container: HTMLElement) => {
      const {scrollLeft, scrollWidth, clientWidth} = container;
      if (!isAr) {
        return scrollLeft;
      }

      const maxScrollLeft = scrollWidth - clientWidth;

      if (scrollLeft >= 0 && scrollLeft <= maxScrollLeft) {
        return maxScrollLeft - scrollLeft;
      }

      if (scrollLeft < 0) {
        return maxScrollLeft + scrollLeft;
      }

      return Math.max(0, Math.min(maxScrollLeft, scrollLeft));
    },
    [isAr]
  );

  const updateNavState = useCallback(() => {
    const container = sliderRef.current;
    if (!container) return;

    const {scrollLeft, scrollWidth, clientWidth} = container;
    const normalizedLeft = Math.max(scrollLeft, 0);
    const maxScrollLeft = Math.max(scrollWidth - clientWidth, 0);

    setIsAtStart(normalizedLeft <= POSITION_TOLERANCE);
    setIsAtEnd(normalizedLeft >= maxScrollLeft - POSITION_TOLERANCE);
  }, [getNormalizedScrollLeft]);

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
      // In LTR: next = scroll right (+), prev = scroll left (-)
      // Container is always dir="ltr", so we always scroll in LTR direction
      const scrollDirection = direction === 'next' ? 1 : -1;

      container.scrollBy({left: distance * scrollDirection, behavior: 'smooth'});
    },
    [slidesPerScroll]
  );

  return (
    <section className="w-full bg-[#6440fb] py-28">
      <div className="mx-auto flex w-full flex-col px-4 sm:px-6 lg:px-0">
        <div className="text-center">
          <p className="text-4xl font-semibold uppercase tracking-[4px] text-[#00ff84]">{t('title')}</p>
          <h3 className="mx-auto mt-3 max-w-[640px] text-base font-semibold leading-[1.35] text-white sm:text-base">
            {t('subtitle')}
          </h3>
        </div>

        <div className="mx-auto mt-16 w-full">
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth px-2 pb-9 [scrollbar-width:none] sm:px-4 [&::-webkit-scrollbar]:hidden"
            aria-label={tAria('slider')}
            dir="ltr"
          >
            {extendedTestimonials.map((testimonial) => (
              <article
                key={testimonial.id}
                data-testimonial-card
                className="snap-start rounded-[10px] border border-[#e0e4f5] bg-white px-8 pb-7 pt-8 shadow-[0_25px_45px_rgba(12,5,78,0.14)] transition-transform duration-300 hover:-translate-y-1"
                style={{minWidth: '440px', maxWidth: '480px'}}
              >
                <h3 className="text-[18px] font-normal leading-9 text-[#6440fb]">{testimonial.heading}</h3>
                <p className="mt-4 text-[15px] leading-[30px] text-[#221f3d]">“{testimonial.quote}”</p>
                <div className="mt-5 h-px w-full bg-[#ededed]" />
                <div className="mt-6 flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-15 w-15 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div className="text-left text-sm leading-[1.2]">
                    <p className="text-[15px] font-medium text-[#221f3d]">{testimonial.name}</p>
                    <p className="mt-1 text-[13px] text-[#7f839b]">{testimonial.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 flex justify-center gap-5" dir="ltr">
            <button
              type="button"
              onClick={() => scrollBySlides('prev')}
              className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white/80 text-white transition hover:bg-white hover:cursor-pointer hover:text-[#2f19ff] disabled:cursor-not-allowed disabled:border-white/40 disabled:text-white/40"
              aria-label={tAria('prev')}
              disabled={isAtStart}
            >
              <IoArrowBack className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBySlides('next')}
              className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white/80 text-white transition hover:bg-white hover:cursor-pointer hover:text-[#2f19ff] disabled:cursor-not-allowed disabled:border-white/40 disabled:text-white/40"
              aria-label={tAria('next')}
              disabled={isAtEnd}
            >
              <IoArrowForward className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-24 grid gap-8 text-center mx-auto max-w-[1540px] sm:grid-cols-2 lg:grid-cols-4">
          {counters.map((counter) => (
            <div
              key={counter.id}
              className="rounded-xl px-8 py-10"
            >
              <p className="text-[34px] font-semibold leading-[42px] text-[#00ff84]">{counter.value}</p>
              <p className="mt-3 text-[13px] font-medium uppercase tracking-[3px] text-white">{counter.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PeopleSay;
