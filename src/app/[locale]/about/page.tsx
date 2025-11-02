import React from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import AboutHero from '@/components/About/AboutHero';
import HowItWorks from '@/components/About/HowItWorks';
import LearningJourney from '@/components/About/LearningJourney';
import Testimonials from '@/components/About/Testimonials';
import BecomeInstructor from '@/components/About/BecomeInstructor';
import BecomeStudent from '@/components/About/BecomeStudent';
import GetApp from '@/components/About/GetApp';
import Ad from '@/components/Home/Ad';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.about' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="w-full bg-white">
      <AboutHero />
      <HowItWorks />
      <LearningJourney />
      <Testimonials />
      <BecomeInstructor />
      <BecomeStudent />
      <GetApp />
      <Ad />
    </main>
  );
}

