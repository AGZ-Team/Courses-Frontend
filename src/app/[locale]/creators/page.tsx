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
  params: {
    locale: string;
  };
};

export default function CreatorsPage({params}: CreatorsPageProps) {
  setRequestLocale(params.locale);

  return <CreatorsPageClient categoryOptions={[...CATEGORY_OPTIONS]} />;
}
