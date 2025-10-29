"use client";
import React, {useEffect, useRef, useState} from 'react';
import type {IconType} from 'react-icons';
import {SiAmazon, SiAmd, SiCisco, SiLogitech, SiSpotify} from 'react-icons/si';
import {IoCameraOutline} from 'react-icons/io5';
import {
  MdArchitecture,
  MdSelfImprovement,
  MdOutlinePriceCheck,
  MdDesignServices,
  MdOutlineCampaign,
  MdOutlineComputer
} from 'react-icons/md';

const brandLogos: {name: string; icon: IconType}[] = [
  {name: 'Amazon', icon: SiAmazon},
  {name: 'AMD', icon: SiAmd},
  {name: 'Cisco', icon: SiCisco},
  {name: 'Dropcam', icon: IoCameraOutline},
  {name: 'Logitech', icon: SiLogitech},
  {name: 'Spotify', icon: SiSpotify}
];

type CategoryCard = {
  name: string;
  courses: string;
  icon: IconType;
  accent: string;
};

const categories: CategoryCard[] = [
  {
    name: 'Engineering Architecture',
    courses: '35+ Courses',
    icon: MdArchitecture,
    accent: 'from-[#eef3ff] via-[#e5ecff] to-[#dbe4ff]'
  },
  {
    name: 'Personal Development',
    courses: '908+ Courses',
    icon: MdSelfImprovement,
    accent: 'from-[#f4ecff] via-[#efe3ff] to-[#e9d8ff]'
  },
  {
    name: 'Finance Accounting',
    courses: '129+ Courses',
    icon: MdOutlinePriceCheck,
    accent: 'from-[#f0f9ff] via-[#e0f2ff] to-[#d4ecff]'
  },
  {
    name: 'Design Creative',
    courses: '573+ Courses',
    icon: MdDesignServices,
    accent: 'from-[#f6f1ff] via-[#efe7ff] to-[#e4daff]'
  },
  {
    name: 'Sales Marketing',
    courses: '565+ Courses',
    icon: MdOutlineCampaign,
    accent: 'from-[#f6f5ff] via-[#eae8ff] to-[#dedcff]'
  },
  {
    name: 'Development IT',
    courses: '126+ Courses',
    icon: MdOutlineComputer,
    accent: 'from-[#f1f5ff] via-[#e1ebff] to-[#d7e4ff]'
  }
];

const scrollAmount = 320;
const itemsPerView = 3;

const CarouselHome = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);
  const dotCount = Math.max(1, Math.ceil(categories.length / itemsPerView));

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

    const delta = direction === 'left' ? -scrollAmount : scrollAmount;
    node.scrollBy({left: delta, behavior: 'smooth'});
    requestAnimationFrame(syncIndicator);
  };

  return (
    <section className="relative z-10 w-full bg-white py-44 sm:pt-36 lg:pt-44">
      <div className="mx-auto flex w-full max-w-[1480px] flex-col items-center gap-16 px-6 text-center mt-5">
        <div className="space-y-10">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.38em] text-[#6440fb]" style={{letterSpacing: '0.38em'}}>
              Trusted by the world&apos;s best
            </p>
            <div className="flex flex-wrap items-center justify-center gap-14 text-[#2d2a67] opacity-90">
              {brandLogos.map(({name, icon: BrandIcon}) => (
                <div
                  key={name}
                  className="flex h-24 w-44 items-center justify-center rounded-xl  bg-white/80 text-4xl  backdrop-blur-sm transition hover:-translate-y-1 hover:border-[#d6daf2]"
                  aria-label={name}
                >
                  <BrandIcon className="opacity-80" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-[2.25rem] font-bold text-[#10085d] sm:text-[2.5rem]">Top Categories</h2>
            <p className="text-base text-[#6e6b7b]">Lorem ipsum dolor sit amet, consectetur.</p>
          </div>
        </div>

        <div className="relative w-full">
          <div
            ref={carouselRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-1 py-6"
          >
            {categories.map(({name, courses, icon: IconComponent, accent}) => (
              <article
                key={name}
                className="group relative flex min-w-[232px] max-w-[232px] flex-1 snap-center flex-col items-center gap-5 overflow-hidden rounded-[26px] border border-[#eef0f7] bg-slate-100 p-8 text-center shadow-[0_12px_26px_rgba(18,13,80,0.06)] transition duration-300 ease-out hover:-translate-y-3 hover:border-transparent hover:bg-[#14085d] hover:shadow-[0_34px_60px_rgba(20,12,88,0.2)]"
              >
                <span
                  className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-[#6440fb] shadow-[0_12px_28px_rgba(100,64,251,0.16)] transition group-hover:scale-[1.07] group-hover:shadow-[0_18px_36px_rgba(16,10,80,0.22)]`}
                  aria-hidden
                >
                  <IconComponent className="text-[1.75rem]" />
                </span>
                <div className="relative z-10 space-y-1 transition duration-300 group-hover:translate-y-px">
                  <h3 className="text-lg font-semibold text-[#10085d] transition duration-300 group-hover:text-white">{name}</h3>
                  <p className="text-sm font-medium text-[#6e6b7b] transition duration-300 group-hover:text-[#d9d6ff]">{courses}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="pointer-events-none absolute -bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#e3e2f4] bg-white text-[#120a5c] shadow-[0_10px_24px_rgba(21,11,85,0.12)] transition hover:border-[#6440fb] hover:text-[#6440fb]"
              >
                <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.5 12.5L0 6.5L5.5 0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M0.75 6.5H15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="sr-only">Previous categories</span>
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#e3e2f4] bg-white text-[#120a5c] shadow-[0_10px_24px_rgba(21,11,85,0.12)] transition hover:border-[#6440fb] hover:text-[#6440fb]"
              >
                <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.5 0.5L16 6.5L10.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15.25 6.5H0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="sr-only">Next categories</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              {Array.from({length: dotCount}).map((_, index) => (
                <span
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${index === activeDot ? 'w-7 bg-[#6440fb]' : 'w-3 bg-[#d8d7e9]'}`}
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
