'use client';

import {Link, usePathname, useRouter} from '@/i18n/routing';
import LanguageSwitcher from '@/components/Navbar/LanguageSwitcher';
import {useTranslations, useLocale} from 'next-intl';
import { LuSearch } from 'react-icons/lu';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { RiShoppingCart2Fill, RiUser3Line, RiArrowDownSLine, RiSettings3Line, RiDashboardLine, RiLogoutCircleLine } from 'react-icons/ri';
import { NavDropdown, DropdownItem } from './NavDropdown';
import NavRightBanner from './NavRightBanner';
import { clearTokens } from '@/lib/auth';
import Image from 'next/image';
import { Input } from '@/components/ui/input';

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
  const router = useRouter();
  const isAr = locale === 'ar';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState<{courses: boolean; explore: boolean}>({courses: false, explore: false});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');

  const resolveFirstName = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return 'User';
    const [first] = trimmed.split(/\s+/);
    return first || 'User';
  }, []);

  useEffect(() => {
    const applyAuthState = () => {
      const token = localStorage.getItem('access');
      const storedUsername = localStorage.getItem('username') || '';

      if (token) {
        const effectiveName = storedUsername || 'User';
        setIsLoggedIn(true);
        setUsername(storedUsername);
        setDisplayName(resolveFirstName(effectiveName));
      } else {
        setIsLoggedIn(false);
        setUsername('');
        setDisplayName('');
      }
    };

    applyAuthState();

    // Listen for auth change events within the same tab
    const onAuthChanged = () => {
      applyAuthState();
    };

    // Listen for cross-tab changes
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'access' || e.key === 'username' || e.key === 'access_token' || e.key === null) {
        applyAuthState();
      }
    };

    window.addEventListener('auth-changed', onAuthChanged);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('auth-changed', onAuthChanged);
      window.removeEventListener('storage', onStorage);
    };
  }, [resolveFirstName]);

  const handleLogout = useCallback(() => {
    // Clear tokens centrally and notify listeners
    clearTokens();
    setIsLoggedIn(false);
    setUsername('');
    setDisplayName('');
    router.push('/login');
  }, [router]);

  // Course categories dropdown items
  const courseCategoriesItems: Array<DropdownItem & {href: string}> = useMemo(() => [
    { labelKey: 'all', label: t('courseCategories.all'), href: '/courses' },
    { labelKey: 'design', label: t('courseCategories.design'), href: '/courses?category=design' },
    { labelKey: 'development', label: t('courseCategories.development'), href: '/courses?category=development' },
    { labelKey: 'business', label: t('courseCategories.business'), href: '/courses?category=business' },
    { labelKey: 'marketing', label: t('courseCategories.marketing'), href: '/courses?category=marketing' },
    { labelKey: 'photography', label: t('courseCategories.photography'), href: '/courses?category=photography' },
    { labelKey: 'art', label: t('courseCategories.art'), href: '/courses?category=art' },
  ], [t]);

  // My Courses dropdown items
  const myCoursesItems: Array<DropdownItem & {href: string}> = useMemo(() => [
    { labelKey: 'course1', label: t('myCoursesDropdown.course1'), href: '/lesson' },
    { labelKey: 'course2', label: t('myCoursesDropdown.course2'), href: '/lesson' },
    { labelKey: 'course3', label: t('myCoursesDropdown.course3'), href: '/lesson' },
    { labelKey: 'allcourses', label: t('myCoursesDropdown.allcourses'), href: '/lesson' },
  ], [t]);

  const navItems: NavItem[] = [
    {labelKey: 'home', href: '/', isActive: true},
    {labelKey: 'about', href: '/about' },
    {labelKey: 'creators', href: '/creators'},
    {labelKey: 'explore', href: '/courses', hasDropdown: true},
    {labelKey: 'contact', href: '/contact'}
  ];

  const profileDropdownItems: DropdownItem[] = useMemo(() => [
    {
      labelKey: 'dashboard',
      label: t('profile.dashboard'),
      href: '/dashboard',
      icon: <RiDashboardLine className="h-4 w-4" aria-hidden="true" />
    },
    {
      labelKey: 'profile',
      label: t('profile.profile'),
      href: '/dashboard?view=profile',
      icon: <RiUser3Line className="h-4 w-4" aria-hidden="true" />
    },
    {
      labelKey: 'logout',
      label: t('profile.logout'),
      onSelect: handleLogout,
      icon: <RiLogoutCircleLine className="h-4 w-4" aria-hidden="true" />
    }
  ], [t, handleLogout]);

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
    <header className="fixed inset-x-0 top-0 z-100 border-b border-white/10 bg-primary text-white shadow-[0_8px_24px_rgba(10,186,181,0.25)]">
      <div className={`mx-auto flex ${isAr ? 'h-26' : 'h-24'} w-full max-w-[1180px] items-center px-6 sm:px-8 md:px-10 lg:px-12 min-[1000px]:max-[1399px]:px-8 min-[1400px]:px-16 min-[1400px]:max-w-[1400px]`}>
        {/* Left group: Logo + Explore */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/logo/Logo.png" alt="Logo" width={200} height={60} className="h-12 md:h-14 w-auto" priority />
          </Link>

        {/* Desktop My Courses Dropdown */}
        <NavDropdown
          trigger={
            <Link
              href="/lesson"
              className={`hidden lg:flex items-center gap-2 rounded-full ${isAr ? 'px-5 py-2.5 text-[16px]' : 'px-4 py-2 text-[14px]'} font-medium text-white transition hover:text-white/80 whitespace-nowrap`}
            >
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
              <span className="whitespace-nowrap">{t('myCourses')}</span>
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
            </Link>
          }
          items={myCoursesItems}
          align="left"
          rightPanel = {<NavRightBanner />}
        />

        </div>

        {/* Desktop Navigation (only on extra-large screens to avoid crowding at 1000–1200px) */}
        <nav className={`hidden flex-1 items-center justify-center gap-6 ${isAr ? 'px-3 text-[15px]' : 'px-2 text-[15px]'} font-medium xl:flex`} aria-label={t('ariaLabel')}>
          {navItems.map((item) => {
            if (item.hasDropdown && item.labelKey === 'explore') {
              return (
                <NavDropdown
                  key={item.labelKey}
                  trigger={
                    <div className={
                      'relative flex items-center gap-1 whitespace-nowrap transition cursor-pointer ' +
                      (isActive(item.href) ? 'text-white' : 'text-white/80 hover:text-white')
                    }>
                      <span className="whitespace-nowrap">{t(item.labelKey)}</span>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 12 12"
                        className={`h-3 w-3 ${isActive(item.href) ? 'text-white' : 'opacity-70'}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.6}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m2.5 4.5 3.5 3 3.5-3" />
                      </svg>
                      {isActive(item.href) && (
                        <span className="pointer-events-none absolute -bottom-6 left-0 right-0 h-1 bg-white" />
                      )}
                    </div>
                  }
                  items={courseCategoriesItems}
                  align="center"
                  rightPanel={<NavRightBanner />}
                />
              );
            }
            return (
              <Link
                key={item.labelKey}
                href={item.href}
                className={
                  'relative flex items-center gap-1 whitespace-nowrap transition ' +
                  (isActive(item.href) ? 'text-white' : 'text-white/80 hover:text-white')
                }
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                <span className="whitespace-nowrap">{t(item.labelKey)}</span>
                {isActive(item.href) && (
                  <span className="pointer-events-none absolute -bottom-6 left-0 right-0 h-1 bg-white" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div
          className={`${isAr ? 'mr-auto' : 'ml-auto'} flex items-center gap-3 text-sm font-medium md:gap-6 shrink-0`}
          // Force LTR inside this small group so we can control visual order with flex `order` classes
          dir="ltr"
        >
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-full bg-white/10 p-2.5 transition hover:bg-white/20 xl:hidden"
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
            onClick={() => setIsSearchOpen((v) => !v)}
            className={`hidden rounded-full p-2.5 transition lg:block ${
              isSearchOpen ? 'bg-white text-primary' : 'bg-white/10 hover:bg-white/20'
            } ${isAr ? 'lg:order-4' : 'lg:order-1'}`}
            aria-label={t('search')}
            aria-expanded={isSearchOpen}
          >
            <LuSearch className="h-6 w-6" />
          </button>

          {/* Cart - Always Visible */}
          <button
            type="button"
            className={`relative rounded-full bg-white/10 p-2.5 transition hover:bg-white/20 ${isAr ? 'lg:order-3' : 'lg:order-2'}`}
            aria-label={t('cart')}
          >
            <RiShoppingCart2Fill className={`h-6 w-6`} />
            {/* <span className={`absolute ${isAr ? '-left-1' : '-right-1'} -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white`}>
              3
            </span> */}
          </button>

          {/* Language Switcher - Desktop Only */}
          <div className={`hidden lg:block ${isAr ? 'lg:order-2' : 'lg:order-3'}`}>
            <LanguageSwitcher />
          </div>

          {isLoggedIn ? (
            <NavDropdown
              align="right"
              className={`hidden md:block ${isAr ? 'lg:order-1' : 'lg:order-4'}`}
              items={profileDropdownItems}
              profileMode
              trigger={
                <div
                  className={`flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 transition hover:bg-white/20 ${isAr ? 'flex-row-reverse' : ''}`}
                >
                  <RiUser3Line className="h-5 w-5" aria-hidden="true" />
                  <span className={`${isAr ? 'text-[16px]' : 'text-[14px]'} font-semibold text-white`}>{displayName || 'User'}</span>
                  <RiArrowDownSLine className="h-4 w-4 opacity-75" aria-hidden="true" />
                </div>
              }
            />
          ) : (
            <>
              {/* Login - Desktop Only */}
              <Link href="/login" className={`hidden ${isAr ? 'text-[16px]' : 'text-[14px]'} whitespace-nowrap text-white/80 transition hover:text-white md:block`}>
                {t('login')}
              </Link>

              {/* Signup - Desktop Only */}
              <Link
                href={`/signup`}
                className={`hidden md:block whitespace-nowrap rounded-full bg-white ${isAr ? 'px-7 py-3 text-[16px]' : 'px-6 py-2.5 text-[14px]'} font-semibold text-primary transition hover:bg-white/90`}
              >
                {t('signup')}
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Desktop Search Bar */}
      <div className="hidden lg:block">
        <div
          className={`mx-auto w-full max-w-[1180px] px-6 sm:px-8 md:px-10 lg:px-12 min-[1000px]:max-[1399px]:px-8 min-[1400px]:px-16 min-[1400px]:max-w-[1400px] origin-top transition-all duration-200 ease-out ${
            isSearchOpen
              ? 'pointer-events-auto max-h-16 translate-y-0 opacity-100 pb-3'
              : 'pointer-events-none max-h-0 -translate-y-2 opacity-0'
          }`}
          dir={isAr ? 'rtl' : 'ltr'}
        >
          <div className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <LuSearch className="h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder={t('search')}
              className="border-none bg-transparent text-sm text-gray-800 shadow-none focus-visible:ring-0 focus-visible:border-0"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="border-t border-white/10 bg-primary lg:hidden">
          <nav className="mx-auto max-w-[1180px] px-6 sm:px-8 md:px-10 min-[1000px]:max-[1399px]:px-8 min-[1400px]:px-16 min-[1400px]:max-w-[1400px] py-6 max-h=[calc(100vh-7rem)] overflow-y-auto overscroll-contain" dir={isAr ? 'rtl' : 'ltr'}>
            {/* My Courses - mobile accordion */}
            <div className="mb-4">
              <button
                type="button"
                className={`flex w-full items-center justify-between rounded-lg ${isAr ? 'px-5 py-3 text-[16px]' : 'px-4 py-2.5 text-[14px]'} font-medium text-white bg-white/5`}
                aria-expanded={mobileOpen.courses}
                onClick={() => setMobileOpen((s) => ({...s, courses: !s.courses}))}
              >
                <span className="flex items-center gap-2">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 6h16" />
                    <path d="M4 12h16" />
                    <path d="M4 18h10" />
                  </svg>
                  {t('myCourses')}
                </span>
                <svg aria-hidden="true" viewBox="0 0 12 12" className={`h-3 w-3 transition-transform ${mobileOpen.courses ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <path d="m2.5 4.5 3.5 3 3.5-3" />
                </svg>
              </button>
              <div className={`mt-2 space-y-1 pl-4 overflow-hidden transition-all duration-300 ease-out ${mobileOpen.courses ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                {myCoursesItems.map((course) => (
                  <Link
                    key={course.labelKey}
                    href={course.href}
                    className={`block rounded-lg px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {course.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Navigation Links (with Courses accordion) */}
            <div className="space-y-1">
              {navItems.map((item) => {
                if (item.hasDropdown && item.labelKey === 'explore') {
                  return (
                    <div key={item.labelKey} className="rounded-lg">
                      <button
                        type="button"
                        className={`flex w-full items-center justify-between rounded-lg px-4 py-3 transition hover:bg-white/5 ${isActive(item.href) ? 'text-white' : 'text-white/70'}`}
                        aria-expanded={mobileOpen.explore}
                        onClick={() => setMobileOpen((s) => ({...s, explore: !s.explore}))}
                      >
                        <span className={`${isAr ? 'text-[16px]' : 'text-[15px]'} font-medium`}>{t(item.labelKey)}</span>
                        <svg aria-hidden="true" viewBox="0 0 12 12" className={`h-3 w-3 transition-transform ${mobileOpen.explore ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                          <path d="m2.5 4.5 3.5 3 3.5-3" />
                        </svg>
                      </button>
                      <div className={`pl-4 overflow-hidden transition-all duration-300 ease-out ${mobileOpen.explore ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="mt-1 space-y-1">
                          {courseCategoriesItems.map((cat) => (
                            <Link
                              key={cat.labelKey}
                              href={cat.href}
                              className="block rounded-lg px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {cat.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.labelKey}
                    href={item.href}
                    className={`flex items-center justify-between rounded-lg px-4 py-3 transition hover:bg-white/5 ${
                      isActive(item.href) ? 'text-white' : 'text-white/70'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className={`${isAr ? 'text-[16px]' : 'text-[15px]'} font-medium`}>{t(item.labelKey)}</span>
                  </Link>
                );
              })}
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

            {isLoggedIn ? (
              <>
                {/* Username - Mobile */}
                <div className="mt-4 rounded-lg bg-white/5 px-4 py-3">
                  <p className={`${isAr ? 'text-[16px]' : 'text-[15px]'} font-medium text-white/80`}>
                    {isAr ? 'مرحبا' : 'Hello'}, {displayName || 'User'}
                  </p>
                </div>

                <div className="mt-3 space-y-2">
                  {profileDropdownItems.map((item) => {
                    if (item.href) {
                      return (
                        <Link
                          key={item.labelKey}
                          href={item.href}
                          className={`flex items-center gap-2 rounded-lg px-4 py-3 text-white/80 transition hover:bg-white/5 ${item.labelKey === 'logout' ? 'hover:text-red-400' : 'hover:text-white'}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.icon && <span className="shrink-0 text-white">{item.icon}</span>}
                          <span className={`${isAr ? 'text-[16px]' : 'text-[15px]'} font-medium`}>{item.label}</span>
                        </Link>
                      );
                    }

                    return (
                      <button
                        key={item.labelKey}
                        type="button"
                        onClick={() => {
                          item.onSelect?.();
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex w-full items-center gap-2 rounded-lg px-4 py-3 text-left text-white/80 transition hover:bg-white/5 ${item.labelKey === 'logout' ? 'hover:text-red-400' : 'hover:text-white'} ${isAr ? 'flex-row-reverse' : ''}`}
                      >
                        {item.icon && <span className="shrink-0 text-white">{item.icon}</span>}
                        <span className={`${isAr ? 'text-[16px]' : 'text-[15px]'} font-medium`}>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                {/* Login and Signup Buttons - Side by Side */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {/* Login Button */}
                  <Link 
                    href="/login" 
                    className={`rounded-full border-2 border-white px-4 py-3 text-center ${isAr ? 'text-[16px]' : 'text-[15px]'} font-semibold text-white transition hover:bg-white hover:text-primary`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('login')}
                  </Link>

                  {/* Signup Button */}
                  <Link
                    href="/signup"
                    className={`rounded-full bg-white px-4 py-3 text-center ${isAr ? 'text-[16px]' : 'text-[15px]'} font-semibold text-primary transition hover:bg-white/90`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('signup')}
                  </Link>
                </div>
              </>
            )}

            {/* Language Switcher */}
            <div className="mt-4 flex justify-center">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
      
      <div className="mx-auto h-px w-full max-w-[1180px] min-[1400px]:max-w-[1400px] bg-white/10" />
    </header>
  );
};

export default MainNavbar;
