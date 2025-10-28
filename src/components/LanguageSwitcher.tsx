'use client';

import {useTransition} from 'react';
import {routing, usePathname, useRouter, Locale} from '@/i18n/routing';

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChange = (nextLocale: Locale) => {
    startTransition(() => {
      router.replace(pathname, {locale: nextLocale});
    });
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      {routing.locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => handleChange(locale)}
          disabled={isPending}
          className="rounded border border-zinc-300 px-3 py-1 transition hover:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
