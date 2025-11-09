import CarouselHome from '@/components/Home/CarouselHome';
import HomeHero from '@/components/Home/HomeHero';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Metadata} from 'next';
import PopularCourses from '@/components/Home/PopularCourses';
import PeopleSay from '@/components/Home/PeopleSay';
import JoinUs from '@/components/Home/JoinUs';
import What from '@/components/Home/What';
import InstructorCarousel from '@/components/Home/instructorCarousel';
import News from '@/components/Home/News';
import Ad from '@/components/Home/Ad';

type PageProps = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({namespace: 'metadata.home', locale});

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function HomePage({params}: PageProps) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <section>
      <HomeHero />
      <CarouselHome />
      <What />
      <PopularCourses />
      <PeopleSay />
      <JoinUs />
      <InstructorCarousel />
      <News />
      <Ad />
    </section>
  );
}
