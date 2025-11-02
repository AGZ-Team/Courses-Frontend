"use client";
import React from "react";
import Image from "next/image";
import {useLocale, useTranslations} from "next-intl";

export default function HowItWorks() {
  const t = useTranslations('about.howItWorks');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const steps = [
    {
      id: 1,
      label: "01",
      title: t('steps.browse.title'),
      desc: t('steps.browse.description'),
      icon: "/aboutImages/works/1.svg",
    },
    {
      id: 2,
      label: "02",
      title: t('steps.purchase.title'),
      desc: t('steps.purchase.description'),
      icon: "/aboutImages/works/2.svg",
    },
    {
      id: 3,
      label: "03",
      title: t('steps.learn.title'),
      desc: t('steps.learn.description'),
      icon: "/aboutImages/works/3.svg",
    },
  ];
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
            {t('title')}
          </h2>
          <p className="mt-4 text-slate-600 font-semibold">
            {t('subtitle')}
          </p>
        </div>

        {/* Cards with arrows between (desktop) */}
        <div className="relative mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-28">
          {steps.map((s) => (
            <div key={s.id} className="text-center">
              <div className="mx-auto w-22 h-22 sm:w-28 sm:h-28 relative">
                {/* light circle */}
                <div className="absolute inset-0 rounded-full bg-indigo-50" />
                {/* step label */}
                <div className={`absolute -top-2 h-10 w-10 rounded-full bg-indigo-900 text-white text-[10px] font-semibold flex items-center justify-center shadow-md ${isRTL ? '-right-2' : '-left-2'}`}>
                  {s.label}
                </div>
                {/* icon */}
                <div className="absolute inset-0 flex items-center justify-center p-5">
                  <Image src={s.icon} alt={s.title} width={44} height={44} />
                </div>
              </div>
              <h3 className="mt-6 font-semibold text-slate-900 max-w-xs mx-auto leading-relaxed">
                {s.title}
              </h3>
              <p className="mt-2 text-slate-600 max-w-xs mx-auto leading-relaxed">{s.desc}</p>
            </div>
          ))}

          {/* arrow 1 between card 1 and 2 */}
          <div className={`hidden lg:block absolute top-16 ${isRTL ? 'right-1/3 translate-x-1/2' : 'left-1/3 -translate-x-1/2'}`}>
            <Image
              src="/aboutImages/workArrows/1.svg"
              alt="arrow"
              width={120}
              height={40}
              priority={false}
              className={isRTL ? 'scale-x-[-1]' : ''}
            />
          </div>
          {/* arrow 2 between card 2 and 3 */}
          <div className={`hidden lg:block absolute top-16 ${isRTL ? 'right-2/3 translate-x-1/2' : 'left-2/3 -translate-x-1/2'}`}>
            <Image
              src="/aboutImages/workArrows/2.svg"
              alt="arrow"
              width={120}
              height={40}
              priority={false}
              className={isRTL ? 'scale-x-[-1]' : ''}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
