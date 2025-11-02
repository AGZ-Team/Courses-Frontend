"use client";
import React from "react";
import Image from "next/image";
import {useTranslations} from "next-intl";

export default function LearningJourney() {
  const t = useTranslations('about.learningJourney');
  const items = [
    {
      key: 'experts',
      title: t('features.experts.title'),
      desc: t('features.experts.description'),
      icon: "/aboutImages/LearningJourney/1.svg",
    },
    {
      key: 'anything',
      title: t('features.anything.title'),
      desc: t('features.anything.description'),
      icon: "/aboutImages/LearningJourney/2.svg",
    },
    {
      key: 'flexible',
      title: t('features.flexible.title'),
      desc: t('features.flexible.description'),
      icon: "/aboutImages/LearningJourney/3.svg",
    },
    {
      key: 'standard',
      title: t('features.standard.title'),
      desc: t('features.standard.description'),
      icon: "/aboutImages/LearningJourney/4.svg",
    },
  ];
  return (
    <section className="relative">
      {/* dark top background to match reference */}
      <div className="absolute inset-x-0 top-0 h-64 sm:h-72 lg:h-100 bg-[#282664]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
            {t('title')}
          </h2>
          <p className="mt-4 text-indigo-100">{t('subtitle')}</p>
        </div>

        {/* cards slightly overlapping white area */}
  <div className="relative mt-12 lg:-mb-12 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.key}
              className="rounded-2xl bg-white p-10 text-center shadow-xl shadow-slate-200/60 ring-1 ring-slate-100 hover:shadow-2xl transition-shadow"
            >
              <div className="mx-auto h-14 w-14">
                <Image src={it.icon} alt={it.title} width={56} height={56} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{it.title}</h3>
              <p className="mt-2 text-slate-700">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
