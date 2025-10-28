import {defineRouting} from 'next-intl/routing';
import {createSharedPathnamesNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export type Locale = (typeof routing.locales)[number];

export const isLocale = (locale: string): locale is Locale =>
  routing.locales.includes(locale as Locale);

export const {Link, redirect, usePathname, useRouter} =
  createSharedPathnamesNavigation(routing);