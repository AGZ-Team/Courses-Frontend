import CarouselHome from '@/components/Home/CarouselHome';
import HomeHero from '@/components/Home/HomeHero';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Metadata} from 'next';

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

    </section>
  );
}
