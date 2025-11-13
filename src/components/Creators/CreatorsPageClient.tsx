'use client';

import {useState, useMemo} from 'react';
import CreatorsCarousel from '@/components/Creators/CreatorsCarousel';
import CreatorsHero from '@/components/Creators/CreatorsHero';
import {useTranslations} from 'next-intl';

type CreatorsPageClientProps = {
  categoryOptions: string[];
};

const CreatorsPageClient = ({categoryOptions}: CreatorsPageClientProps) => {
  const tCats = useTranslations('creatorsCarousel.categories');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = useMemo(() => categoryOptions, [categoryOptions]);

  return (
    <main>
      <CreatorsHero />

      <section className="w-full bg-white py-6">
        <div className="mx-auto w-full max-w-[1380px] px-4 sm:px-6">
          <div className="mb-6 flex w-full items-center justify-center gap-2 overflow-x-auto py-2">
            {categories.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveCategory(key)}
                className={
                  `whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ` +
                  (activeCategory === key
                    ? `border-[#0ABAB5] bg-[#0ABAB5] text-white`
                    : `border-[#d5d6e6] bg-white text-[#0ABAB5] hover:border-[#0ABAB5] hover:bg-[#0ABAB5] hover:text-white`)
                }
                aria-pressed={activeCategory === key}
              >
                {tCats(key as any, {defaultValue: key})}
              </button>
            ))}
          </div>
        </div>
      </section>

      <CreatorsCarousel activeCategory={activeCategory} />
      <CreatorsCarousel activeCategory={activeCategory} reverseOrder />
    </main>
  );
};

export default CreatorsPageClient;
