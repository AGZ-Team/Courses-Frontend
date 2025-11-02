"use client";
import React from "react";
import Image from "next/image";
import {useTranslations, useLocale} from "next-intl";

export default function BecomeInstructor() {
  const t = useTranslations('about.whyChooseUs.instructor');
  const locale = useLocale();
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              {t('title')}
            </h3>
            <p className="mt-4 text-slate-600 max-w-xl leading-7">
              {t('description')}
            </p>
            <div className="mt-8">
              <a
                href={`/${locale}/signup`}
                className="inline-flex h-16 items-center justify-center rounded-xl border-2 border-indigo-800 bg-transparent px-16 text-indigo-800 font-bold hover:bg-indigo-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors duration-200"
              >
                {t('cta')}
              </a>
            </div>
          </div>
          <div>
            <Image
              src="/aboutImages/BecomeInstructor/1.png"
              alt={t('imageAlt')}
              width={960}
              height={700}
              className="w-full h-auto rounded-2xl border border-slate-200 shadow-sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
