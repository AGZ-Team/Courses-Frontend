import HomeHero from '@/components/HomeComponents/HomeHer';
import {getTranslations} from 'next-intl/server';


type PageProps = {
  params: Promise<{locale: string}>;
};

export default async function HomePage({params}: PageProps) {
  const {locale} = await params;
  const t = await getTranslations({namespace: 'home', locale});
  const nav = await getTranslations({namespace: 'nav', locale});
  const navItems = ['home', 'about', 'projects', 'services', 'contact'] as const;

  return (
    <section>
      <HomeHero />
    </section>
  );
}
