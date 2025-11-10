'use client';

import {useEffect, useRef, useState, useTransition} from 'react';
import {useLocale} from 'next-intl';
import {routing, usePathname, useRouter, Locale} from '@/i18n/routing';
import { GrLanguage } from 'react-icons/gr';

const localeLabels: Record<Locale, string> = {
  en: 'English',
  ar: 'Arabic'
};

type LanguageSwitcherProps = {
  placement?: 'up' | 'down';
};

const LanguageSwitcher = ({placement = 'down'}: LanguageSwitcherProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleSelect = (nextLocale: Locale) => {
    setIsOpen(false);

    if (nextLocale === locale) {
      return;
    }

    startTransition(() => {
      const raw = pathname || '/';
      // Defensively strip any leading locale to prevent paths like /ar/en/... or /en/ar/...
      const normalized = raw.replace(/^\/(en|ar)(?=\/|$)/, '') || '/';
      router.replace(normalized, {locale: nextLocale});
    });
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={isPending}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-70"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Change language, current: ${localeLabels[locale]}`}
      >
        <GrLanguage className={`h-6 w-6`} />
        <span className="pointer-events-none absolute -bottom-1 right-1 rounded-full bg-white px-1 text-[10px] font-semibold text-[#0ABAB5]">
          {locale.toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Select language"
          className={`absolute right-0 ${placement === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'} w-36 rounded-md border border-white/10 bg-[#0ABAB5] py-1 text-sm shadow-lg`}
        >
          {routing.locales.map((availableLocale) => {
            const isActive = availableLocale === locale;

            return (
              <button
                key={availableLocale}
                type="button"
                role="option"
                aria-selected={isActive}
                disabled={isPending}
                onClick={() => handleSelect(availableLocale)}
                className={`flex w-full items-center justify-between px-3 py-1.5 text-left transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70 ${
                  isActive ? 'text-white' : 'text-white/80'
                }`}
              >
                <span>{localeLabels[availableLocale]}</span>
                {isActive && (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3.5 8.5 2.5 2.5 6-6" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
