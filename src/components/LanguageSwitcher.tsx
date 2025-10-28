'use client';

import {useTransition} from 'react';
import {routing, usePathname, useRouter, Locale} from '@/i18n/routing';
import {useLocale} from 'next-intl';

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
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
          className={`rounded border px-3 py-1 transition disabled:cursor-not-allowed disabled:opacity-70 ${
            currentLocale === locale
              ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
              : 'border-zinc-300 hover:border-zinc-400'
          }`}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
