import { getTranslations, setRequestLocale } from 'next-intl/server';

interface HeaderSectionProps {
  locale?: string;
}

export async function HeaderSection({ locale }: HeaderSectionProps = {}) {
  if (locale) {
    setRequestLocale(locale);
  }
  const t = await getTranslations('coursesPage.header');
  return (
    <header className="w-full border-b border-[#e6e4f5] bg-white">
      <div className="mx-auto w-full max-w-[1180px] px-4 py-14 sm:px-6 sm:py-16">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d1cff4] bg-[#f3f2ff] px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#5f58c6]">
            {t('eyebrow')}
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-[#120a5d] sm:text-[2.85rem]">
            {t('title')}
          </h1>
          <p className="mt-4 text-base leading-7 text-[#5f5c7b] sm:text-lg">{t('description')}</p>
        </div>
      </div>
    </header>
  );
}
