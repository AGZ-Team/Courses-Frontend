'use client';

import {Link} from '@/i18n/routing';
import LanguageSwitcher from '@/components/Navbar/LanguageSwitcher';
import {useTranslations, useLocale} from 'next-intl';

type NavItem = {
  labelKey: string;
  href: string;
  hasDropdown?: boolean;
  isActive?: boolean;
};

const MainNavbar = () => {
  const t = useTranslations('nav');
  const locale = useLocale();
  const isAr = locale === 'ar';

  const navItems: NavItem[] = [
    {labelKey: 'home', href: '/', hasDropdown: true, isActive: true},
    {labelKey: 'courses', href: '/courses', hasDropdown: true},
    {labelKey: 'events', href: '/events', hasDropdown: true},
    {labelKey: 'blog', href: '/blog', hasDropdown: true},
    {labelKey: 'pages', href: '/pages', hasDropdown: true},
    {labelKey: 'contact', href: '/contact'}
  ];

  return (
    <header className="relative z-10 bg-[#0b0440] text-white">
      <div className={`mx-auto flex ${isAr ? 'h-28' : 'h-24'} w-full max-w-[1200px] items-center justify-between px-6`}>
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <span className={`flex ${isAr ? 'h-14 w-14' : 'h-12 w-12'} items-center justify-center rounded-full bg-white/10`}>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className={`${isAr ? 'h-8 w-8' : 'h-7 w-7'} text-emerald-400`}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 8.5 12 5l9 3.5-9 3.5-9-3.5Z" />
                <path d="M7 11v5l5 3 5-3v-5" />
                <path d="M12 12.5v6" />
              </svg>
            </span>
            <span className={`${isAr ? 'text-[22px]' : 'text-[20px]'} whitespace-nowrap font-semibold`}>{t('brandName')}</span>
          </Link>

          <button className={`hidden items-center gap-2 rounded-full ${isAr ? 'px-5 py-2.5 text-[16px]' : 'px-4 py-2 text-[14px]'} font-medium text-emerald-400 transition hover:text-emerald-300 lg:flex`}>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h10" />
            </svg>
            <span className="whitespace-nowrap">{t('explore')}</span>
          </button>
        </div>

  <nav className={`hidden items-center ${isAr ? 'gap-6' : 'gap-8'} ${isAr ? 'text-[16px]' : 'text-[15px]'} font-medium md:flex`} aria-label={t('ariaLabel')}>
          {navItems.map((item) => (
            <Link
              key={item.labelKey}
              href={item.href}
              className={
                'relative flex items-center gap-1 whitespace-nowrap transition hover:text-emerald-300' +
                (item.isActive ? ' text-white' : ' text-white/70')
              }
            >
              <span className="whitespace-nowrap">{t(item.labelKey)}</span>
              {item.hasDropdown && (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 12 12"
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m2.5 4.5 3.5 3 3.5-3" />
                </svg>
              )}
              {item.isActive && (
                <span className={`pointer-events-none absolute ${isAr ? '-bottom-7' : '-bottom-6'} left-0 right-0 h-px bg-white/15`} />
              )}
            </Link>
          ))}
        </nav>

  <div className="flex items-center gap-6 text-sm font-medium">
          <button
            type="button"
            className={`hidden rounded-full bg-white/10 ${isAr ? 'p-3 mr-3' : 'p-2.5 m-4'} transition hover:bg-white/20 md:block `}
            aria-label={t('search')}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx={11} cy={11} r={6} />
              <path d="m20 20-3-3" />
            </svg>
          </button>

          <button
            type="button"
            className={`relative rounded-full bg-white/10 ${isAr ? 'p-3' : 'p-2.5'} transition hover:bg-white/20`}
            aria-label={t('cart')}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 6 1.5 12h9L18 6" />
              <path d="M9 6V4a3 3 0 0 1 6 0v2" />
            </svg>
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              3
            </span>
          </button>

          <LanguageSwitcher />

          <Link href="/login" className={`hidden ${isAr ? 'text-[16px]' : 'text-[15px]'} whitespace-nowrap text-white/80 transition hover:text-white md:block`}>
            {t('login')}
          </Link>


          <Link
            href="/signup"
            className={`whitespace-nowrap rounded-full bg-white ${isAr ? 'px-7 py-3 text-[16px]' : 'px-6 py-2.5 text-[15px]'} font-semibold text-[#0b0440] transition hover:bg-white/90`}
          >
            {t('signup')}
          </Link>
        </div>
      </div>
      <div className="mx-auto h-px w-full max-w-[1200px] bg-white/10" />
    </header>
  );
};

export default MainNavbar;
