import CarouselHome from '@/components/Home/CarouselHome';
import HomeHero from '@/components/Home/HomeHero';
import {getTranslations} from 'next-intl/server';




export default async function HomePage() {
  
  return (
    <section>
      <HomeHero />

      <CarouselHome />

    </section>
  );
}
