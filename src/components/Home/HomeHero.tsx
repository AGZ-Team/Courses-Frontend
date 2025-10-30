'use client';

import React, {useRef, useState} from 'react';
import Image from 'next/image';
import {useLocale, useTranslations} from 'next-intl';

const portraitSrc = 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=760&q=80';
const smileSrc = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=520&q=80';
const teamSrc = 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=520&q=80';

const HomeHero = () => {
  const t = useTranslations('homeHero');
  const locale = useLocale();
  const isAr = locale === 'ar';
  const statsRaw = t.raw('stats');
  const stats = Array.isArray(statsRaw) ? (statsRaw as string[]) : [];
  const headlineLineB = t.rich('headline.lineBRich', {
    highlight: (chunks) => (
      <span
        className={`inline-block border-b-[6px] border-emerald-400 text-emerald-300 ${isAr ? 'mr-2' : 'ml-2'}`}
      >
        {chunks}
      </span>
    )
  });

  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [parallax, setParallax] = useState({x: 0, y: 0});

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;

    const relativeX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const relativeY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      setParallax({x: relativeX, y: relativeY});
    });
  };

  const handlePointerLeave = () => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    setParallax({x: 0, y: 0});
  };

  const parallaxStyle = (intensityX: number, intensityY?: number): React.CSSProperties => ({
    transform: `translate3d(${parallax.x * intensityX}px, ${parallax.y * (intensityY ?? intensityX)}px, 0)`,
    willChange: 'transform'
  });

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[90vh] w-full items-center overflow-hidden bg-gradient-to-b from-[#0b0440] via-[#0b0440] to-[#1a0c7a] text-white pt-24 md:pt-28"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="absolute inset-0">
        <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#140a70] opacity-60 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-16 h-64 w-64 rounded-full bg-[#120b68] opacity-65 blur-3xl" />
        <div className="pointer-events-none absolute left-1/4 top-1/3 h-16 w-16 rounded-full border border-white/10 bg-white/10" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col gap-16 px-8 py-16 sm:px-12 lg:flex-row lg:items-start lg:justify-between lg:gap-24 lg:px-16">
        <div className="max-w-3xl space-y-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
            {t('eyebrow')}
          </span>

          <div className="space-y-6">
            <h1 className="text-[2.95rem] font-extrabold leading-[1.05] tracking-tight text-white sm:text-[3.75rem] md:text-[4.25rem]">
              <span className="block">{t('headline.lineA')}</span>
              <span className="block">{headlineLineB}</span>
            </h1>
            <p className="max-w-2xl text-lg font-medium text-white/85 md:text-xl">
              {t('description')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button className="rounded-sm border border-transparent bg-[#6440fb] px-12 py-4 text-lg font-semibold text-white shadow-[0_18px_38px_rgba(79,47,255,0.45)] transition-colors duration-300 hover:border-[#6440fb] hover:bg-transparent hover:text-[#6440fb] cursor-pointer">
              {t('primaryCta')}
            </button>
            <button className=" rounded-sm border-2 border-emerald-400 px-12 py-4 text-lg font-semibold text-emerald-300 transition hover:bg-emerald-400 hover:text-white cursor-pointer">
              {t('secondaryCta')}
            </button>
          </div>
        </div>

        <div
          ref={cardsRef}
          className="relative hidden w-full max-w-[700px] items-start justify-center pt-4 md:flex lg:pt-0"
        >
          <div className="relative h-[660px] w-full">
            <div
              className="pointer-events-none absolute left-1/2 top-0 w-[360px] -translate-x-1/2 rounded-[46px] border border-white/10 bg-white/5 shadow-[0_44px_120px_rgba(18,12,68,0.55)] transition-transform duration-300 ease-out"
              style={parallaxStyle(10, 8)}
            >
              <Image src={portraitSrc} priority alt={t('images.learner')} width={420} height={520} className="h-[500px] w-full rounded-[40px] object-cover" />
            </div>

            <div
              className="pointer-events-none absolute right-6 top-24 w-[190px] rounded-[28px] border border-white/10 bg-white/5 p-3 shadow-[0_24px_70px_rgba(18,12,68,0.35)] transition-transform duration-300 ease-out"
              style={parallaxStyle(-18, 12)}
            >
              <Image src={smileSrc} priority alt={t('images.happyStudent')} width={220} height={180} className="h-[150px] w-full rounded-[22px] object-cover" />
            </div>

            <div
              className="pointer-events-none absolute left-6 bottom-16 w-[200px] rounded-[28px] border border-white/10 bg-white/5 p-3 shadow-[0_24px_70px_rgba(18,12,68,0.35)] transition-transform duration-300 ease-out"
              style={parallaxStyle(16, -12)}
            >
              <Image src={teamSrc} priority alt={t('images.collaborativeLearning')} width={240} height={200} className="h-[160px] w-full rounded-[22px] object-cover" />
            </div>

            <div
              className="pointer-events-none absolute -left-8 top-6 w-32 rounded-2xl border border-white/10 bg-white/10 p-4 text-xs text-white/85 shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur transition-transform duration-300 ease-out"
              style={parallaxStyle(22, 18)}
            >
              <div className="mb-3 h-10 w-10 rounded-full bg-[radial-gradient(circle_at_top_left,#5f4bff,rgba(255,255,255,0.2))]" />
              <p className="font-semibold text-white">{t('cards.instructor.name')}</p>
              <p className="text-[11px] text-emerald-300">{t('cards.instructor.role')}</p>
              <p className="mt-2 text-[11px] text-amber-300">★★★★★</p>
            </div>

            <div
              className="pointer-events-none absolute right-2 bottom-24 w-44 rounded-2xl border border-white/10 bg-white/10 p-4 text-xs text-white/85 shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur transition-transform duration-300 ease-out"
              style={parallaxStyle(-20, -14)}
            >
              <p className="text-[11px] text-white/70">{t('cards.admission.title')}</p>
              <p className="font-semibold text-white">{t('cards.admission.message')}</p>
            </div>

            <div
              className="pointer-events-none absolute left-1/2 bottom-6 w-44 -translate-x-1/2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-xs text-white/85 shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur transition-transform duration-300 ease-out"
              style={parallaxStyle(14, -10)}
            >
              <span className="text-lg font-semibold text-emerald-300">{t('cards.freeCourses.count')}</span>
              <span className="text-[11px] text-white/70"> {t('cards.freeCourses.label')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="waves" aria-hidden="true"/>
    </section>
  );
};

export default HomeHero;
