'use client';

import {Link, usePathname} from '@/i18n/routing';
import LanguageSwitcher from '@/components/Navbar/LanguageSwitcher';
import {useTranslations, useLocale} from 'next-intl';
import { LuSearch } from 'react-icons/lu';
import { useState } from 'react';
import { RiShoppingCart2Fill } from 'react-icons/ri';

type NavItem = {
  labelKey: string;
  href: string;
  hasDropdown?: boolean;
  isActive?: boolean;
};

const MainNavbar = () => {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const isAr = locale === 'ar';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {labelKey: 'home', href: '/', isActive: true},
    {labelKey: 'courses', href: '/courses', hasDropdown: true},
    {labelKey: 'events', href: '/events'},
    {labelKey: 'blog', href: '/blog'},
    {labelKey: 'about', href: '/about' },
    {labelKey: 'contact', href: '/contact'}
  ];

  const isActive = (href: string) => {
    // Remove locale prefix from pathname for comparison
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    
    if (href === '/') {
      return pathWithoutLocale === '/' || pathWithoutLocale === '';
    }
    
    // Check if the path starts with href or matches exactly
    return pathWithoutLocale.startsWith(href) && (pathWithoutLocale === href || pathWithoutLocale.startsWith(href + '/'));
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#0b0440] text-white shadow-[0_8px_24px_rgba(7,5,48,0.25)]">
      <div className={`mx-auto flex ${isAr ? 'h-26' : 'h-24'} w-full max-w-[1600px] items-center px-6`}>
        {/* Left group: Logo + Explore */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-7 w-7 text-emerald-400"
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
          <span className={`${isAr ? 'text-[22px]' : 'text-[18px]'} whitespace-nowrap font-semibold`}>{t('brandName')}</span>
        </Link>

        {/* Desktop Explore Button */}
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

        {/* Desktop Navigation */}
        <nav className={`hidden flex-1 items-center justify-center gap-8 ${isAr ? 'px-4 text-[15px]' : 'px-2 text-[15px]'} font-medium md:flex`} aria-label={t('ariaLabel')}>
          {navItems.map((item) => (
            <Link
              key={item.labelKey}
              href={item.href}
              className={
                'relative flex items-center gap-1 whitespace-nowrap transition ' +
                (isActive(item.href) ? 'text-[#44ffae]' : 'text-white/80 hover:text-white')
              }
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              <span className="whitespace-nowrap">{t(item.labelKey)}</span>
              {item.hasDropdown && (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 12 12"
                  className={`h-3 w-3 ${isActive(item.href) ? 'text-[#44ffae]' : 'opacity-70'}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m2.5 4.5 3.5 3 3.5-3" />
                </svg>
              )}
              {isActive(item.href) && (
                <span className="pointer-events-none absolute -bottom-6 left-0 right-0 h-1 bg-[#44ffae]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="ml-auto flex items-center gap-3 text-sm font-medium md:gap-6 shrink-0">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-full bg-white/10 p-2.5 transition hover:bg-white/20 md:hidden"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Search - Desktop Only */}
          <button
            type="button"
            className="hidden rounded-full bg-white/10 p-2.5 transition hover:bg-white/20 md:block"
            aria-label={t('search')}
          >
            <LuSearch className={`h-6 w-6`} />
          </button>

          {/* Cart - Always Visible */}
          <button
            type="button"
            className="relative rounded-full bg-white/10 p-2.5 transition hover:bg-white/20"
            aria-label={t('cart')}
          >
            <RiShoppingCart2Fill className={`h-6 w-6`} />
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              3
            </span>
          </button>

          {/* Language Switcher - Desktop Only */}
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          {/* Login - Desktop Only */}
          <Link href="/login" className={`hidden ${isAr ? 'text-[16px]' : 'text-[14px]'} whitespace-nowrap text-white/80 transition hover:text-white md:block`}>
            {t('login')}
          </Link>

          {/* Signup - Always Visible */}
          <Link
            href="/signup"
            className={`whitespace-nowrap rounded-full bg-white ${isAr ? 'px-7 py-3 text-[16px]' : 'px-6 py-2.5 text-[14px]'} font-semibold text-[#0b0440] transition hover:bg-white/90`}
          >
            {t('signup')}
          </Link>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#0b0440] md:hidden">
          <nav className="mx-auto max-w-[1300px] px-6 py-6">
            {/* Explore Button */}
            <button className={`flex w-full items-center gap-2 rounded-lg ${isAr ? 'px-5 py-3 text-[16px]' : 'px-4 py-2.5 text-[14px]'} font-medium text-emerald-400 transition hover:bg-white/5 mb-4`}>
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
              <span>{t('explore')}</span>
            </button>

            {/* Navigation Links */}
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.labelKey}
                  href={item.href}
                  className={`flex items-center justify-between rounded-lg px-4 py-3 transition hover:bg-white/5 ${
                    isActive(item.href) ? 'text-[#44ffae]' : 'text-white/70'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className={`${isAr ? 'text-[16px]' : 'text-[15px]'} font-medium`}>{t(item.labelKey)}</span>
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
                </Link>
              ))}
            </div>

            {/* Search */}
            <button
              type="button"
              className="mt-4 flex w-full items-center gap-3 rounded-lg bg-white/5 px-4 py-3 transition hover:bg-white/10"
              aria-label={t('search')}
            >
              <LuSearch className='h-6 w-6' />
              <span className={`${isAr ? 'text-[16px]' : 'text-[15px]'} font-medium text-white/80`}>{t('search')}</span>
            </button>
              
            {/* Login Button */}
            <Link 
              href="/login" 
              className={`mt-4 block rounded-full border-2 border-emerald-400 px-6 py-3 text-center ${isAr ? 'text-[16px]' : 'text-[15px]'} font-semibold text-emerald-300 transition hover:bg-emerald-400 hover:text-white`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('login')}
            </Link>

            {/* Language Switcher */}
            <div className="mt-4 flex justify-center">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
      
      <div className="mx-auto h-px w-full max-w-[1200px] bg-white/10" />
    </header>
  );
};

export default MainNavbar;
