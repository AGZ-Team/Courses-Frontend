"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {useTranslations} from "next-intl";

type Testimonial = {
  name: string;
  role: string;
  avatar: string;
  quote: string;
};

// Content from i18n messages
function useI18nTestimonials(): Testimonial[] {
  const t = useTranslations('about.testimonials.items');
  return [1,2,3,4,5].map((i) => ({
    name: t(`${i}.name`),
    role: t(`${i}.role`),
    avatar: `/aboutImages/Testimonials/${i}.png`,
    quote: t(`${i}.quote`),
  }));
}

export default function Testimonials() {
  const t = useTranslations('about.testimonials');
  const testimonials: Testimonial[] = useI18nTestimonials();
  const [active, setActive] = useState(0);
  const [animateIn, setAnimateIn] = useState(true);

  // autoplay rotate
  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const current: Testimonial = useMemo(() => testimonials[active], [active]);

  // Smooth fade/slide on quote change
  useEffect(() => {
    setAnimateIn(false);
    const t = setTimeout(() => setAnimateIn(true), 30);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="mt-2 text-5xl sm:text-6xl font-bold text-slate-900">
            {t('title')}
          </h1>
          <p className="mt-4 text-slate-600 font-semibold">
            {t('subtitle')}
          </p>
        </div>

        {/* Single centered quote like reference */}
        <div className="mt-12 text-center">
          <div className="mx-auto flex items-center justify-center">
            <Image
              src="/aboutImages/Testimonials/quote.svg"
              alt="quote icon"
              width={72}
              height={72}
              className="opacity-90"
              priority={false}
            />
          </div>
          <p
            className={
              "mt-6 mx-auto max-w-5xl text-2xl sm:text-3xl lg:text-4xl font-semibold leading-relaxed text-indigo-950 transition-all duration-500 " +
              (animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")
            }
          >
            {current.quote}
          </p>
          <div
            className={
              "mt-8 transition-opacity duration-500 " +
              (animateIn ? "opacity-100" : "opacity-0")
            }
          >
            <p className="font-semibold text-slate-900">{current.name}</p>
            <p className="text-sm text-slate-500">{current.role}</p>
          </div>

          {/* avatar carousel */}
          <div className="mt-10 flex items-center justify-center gap-6 sm:gap-8">
            {testimonials.map((item, idx) => {
              const isActive = idx === active;
              return (
                <button
                  key={item.name}
                  aria-label={t('aria.showBy', {name: item.name})}
                  aria-current={isActive}
                  onClick={() => setActive(idx)}
                  className="relative rounded-full focus:outline-none transition-transform duration-300 ease-out hover:-translate-y-1"
                >
                  <span
                    className={
                      "inline-flex items-center justify-center rounded-full overflow-hidden transition-all duration-300 ease-out " +
                      (isActive
                        ? "h-16 w-16 ring-4 ring-indigo-600"
                        : "h-14 w-14 ring-2 ring-slate-200 opacity-80 hover:opacity-100")
                    }
                  >
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      width={isActive ? 64 : 56}
                      height={isActive ? 64 : 56}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
