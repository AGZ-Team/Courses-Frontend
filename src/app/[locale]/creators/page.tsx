import {setRequestLocale} from 'next-intl/server';
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

export default async function CreatorsPage({params}: CreatorsPageProps) {
  const {locale} = await params;
  setRequestLocale(locale);

  return <CreatorsPageClient categoryOptions={[...CATEGORY_OPTIONS]} />;
}
