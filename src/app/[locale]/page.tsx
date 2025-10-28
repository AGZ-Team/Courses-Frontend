import {getTranslations} from 'next-intl/server';

type PageProps = {
  params: {locale: string};
};

export default async function HomePage({params}: PageProps) {
  const t = await getTranslations({namespace: 'home', locale: params.locale});
  const nav = await getTranslations({namespace: 'nav', locale: params.locale});
  const navItems = ['home', 'about', 'projects', 'services', 'contact'] as const;

  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-12">
      <div>
        <span className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
          {t('welcome')}
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {t('heroHeadline')}{' '}
          <span className="text-primary-600">{t('heroSub')}</span>
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300">
          {t('description')}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            href="#get-started"
          >
            {t('heroCtaA')}
          </a>
          <a
            className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-500 hover:text-zinc-900 dark:border-zinc-600 dark:text-zinc-200 dark:hover:border-zinc-400 dark:hover:text-white"
            href="#projects"
          >
            {t('heroCtaB')}
          </a>
          <a
            className="rounded-full border border-transparent px-6 py-3 text-sm font-semibold text-primary-600 transition hover:text-primary-500"
            href="#contact"
          >
            {t('heroCtaC')}
          </a>
        </div>
      </div>

      <nav aria-label={nav('ariaLabel')} className="flex flex-wrap gap-4">
        {navItems.map((item) => (
          <span
            key={item}
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
          >
            {nav(item)}
          </span>
        ))}
      </nav>
    </section>
  );
}
