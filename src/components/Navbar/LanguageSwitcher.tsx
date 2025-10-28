'use client';

import {useEffect, useRef, useState, useTransition} from 'react';
import {useLocale} from 'next-intl';
import {routing, usePathname, useRouter, Locale} from '@/i18n/routing';
import { FaGlobe, FaLanguage } from 'react-icons/fa';
import { BiGlobe } from 'react-icons/bi';
import { BsGlobe2 } from 'react-icons/bs';
import { GrLanguage } from 'react-icons/gr';
import { HiMiniGlobeAlt } from 'react-icons/hi2';
import { IoLanguageOutline } from 'react-icons/io5';
import { LuGlobe, LuGlobeLock, LuLanguages } from 'react-icons/lu';

const localeLabels: Record<Locale, string> = {
  en: 'English',
  ar: 'Arabic'
};

const LanguageSwitcher = () => {
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
      router.replace(pathname, {locale: nextLocale});
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
        <LuLanguages className={`h-4 w-5`} />
        <span className="pointer-events-none absolute -bottom-1 right-1 rounded-full bg-emerald-400 px-1 text-[10px] font-semibold text-[#0b0440]">
          {locale.toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Select language"
          className="absolute right-0 mt-2 w-36 rounded-md border border-white/10 bg-[#0b0440] py-1 text-sm shadow-lg"
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
                  isActive ? 'text-emerald-400' : 'text-white/80'
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
