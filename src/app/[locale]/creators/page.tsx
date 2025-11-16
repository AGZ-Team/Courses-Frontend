import {getTranslations, setRequestLocale} from 'next-intl/server';
import CreatorsPageClient from '@/components/Creators/CreatorsPageClient';

const CATEGORY_OPTIONS = [
  'all',
  'design',
  'marketing',
  'development',
  'photography',
  'art',
  'animation',
  'writing'
] as const;

type CreatorsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

type CreatorsMetadataProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({params}: CreatorsMetadataProps) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'metadata.creators'});

  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function CreatorsPage({params}: CreatorsPageProps) {
  const {locale} = await params;
  setRequestLocale(locale);

  return <CreatorsPageClient categoryOptions={[...CATEGORY_OPTIONS]} />;
}
