'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {IoArrowBack, IoArrowForward} from 'react-icons/io5';

const TESTIMONIALS = [
  {
    id: 0,
    heading: 'Great Work',
    quote:
      'I think Educrat is the best theme I ever seen this year. Amazing design, easy to customize and a design quality superlative account on its cloud platform for the optimized performance.',
    name: 'Courtney Henry',
    role: 'Web Designer',
    avatar: 'https://educrat-react.vercel.app/assets/img/testimonials/1.png'
  },
  {
    id: 1,
    heading: 'Great Work',
    quote:
      'I think Educrat is the best theme I ever seen this year. Amazing design, easy to customize and a design quality superlative account on its cloud platform for the optimized performance.',
    name: 'Ronald Richards',
    role: 'President of Sales',
    avatar: 'https://educrat-react.vercel.app/assets/img/testimonials/2.png'
  },
  {
    id: 2,
    heading: 'Great Work',
    quote:
      'I think Educrat is the best theme I ever seen this year. Amazing design, easy to customize and a design quality superlative account on its cloud platform for the optimized performance.',
    name: 'Annette Black',
    role: 'Nursing Assistant',
    avatar: 'https://educrat-react.vercel.app/assets/img/testimonials/3.png'
  },
  {
    id: 3,
    heading: 'Great Work',
    quote:
      'I think Educrat is the best theme I ever seen this year. Amazing design, easy to customize and a design quality superlative account on its cloud platform for the optimized performance.',
    name: 'Courtney Henry',
    role: 'Web Designer',
    avatar: 'https://educrat-react.vercel.app/assets/img/testimonials/4.png'
  },{ id: 4,
    heading: 'Great Work',
    quote:
      'I think Educrat is the best theme I ever seen this year. Amazing design, easy to customize and a design quality superlative account on its cloud platform for the optimized performance.',
    name: 'Courtney Henry',
    role: 'Web Designer',
    avatar: 'https://educrat-react.vercel.app/assets/img/testimonials/1.png'
  },{ id: 5,
    heading: 'Great Work',
    quote:
      'I think Educrat is the best theme I ever seen this year. Amazing design, easy to customize and a design quality superlative account on its cloud platform for the optimized performance.',
    name: 'Courtney Henry',
    role: 'Web Designer',
    avatar: 'https://educrat-react.vercel.app/assets/img/testimonials/4.png'
  }

] as const;

const COUNTERS = [
  {id: 1, label: 'Students worldwide', value: '350,000+'},
  {id: 2, label: 'Total course views', value: '496,000+'},
  {id: 3, label: 'Five-star course reviews', value: '19,000+'},
  {id: 4, label: 'Students community', value: '987,000+'}
] as const;

type Testimonial = (typeof TESTIMONIALS)[number];

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
  const {slidesPerScroll} = useVisibleConfig();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

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
          <p className="text-4xl font-semibold uppercase tracking-[4px] text-[#00ff84]">What People Say</p>
          <h3 className="mx-auto mt-3 max-w-[640px] text-base font-semibold leading-[1.35] text-white sm:text-base">
            Learn ipsum dolor sit amet, consectetur.
          </h3>
        </div>

        <div className="mx-auto mt-16 w-full">
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth px-2 pb-9 [scrollbar-width:none] sm:px-4 [&::-webkit-scrollbar]:hidden"
            aria-label="Testimonial slider"
          >
            {TESTIMONIALS.map((testimonial) => (
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

        <div className="mt-24 grid gap-8 text-center mx-auto max-w-[1540px] sm:grid-cols-2 lg:grid-cols-4">
          {COUNTERS.map((counter) => (
            <div
              key={counter.id}
              className="rounded-[12px]  px-8 py-10"
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
