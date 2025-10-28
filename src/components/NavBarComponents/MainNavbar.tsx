'use client';

import {Link} from '@/i18n/routing';
import LanguageSwitcher from '@/components/NavBarComponents/LanguageSwitcher';

type NavItem = {
  label: string;
  href: string;
  hasDropdown?: boolean;
  isActive?: boolean;
};

const navItems: NavItem[] = [
  {label: 'Home', href: '#', hasDropdown: true, isActive: true},
  {label: 'Courses', href: '#', hasDropdown: true},
  {label: 'Events', href: '#', hasDropdown: true},
  {label: 'Blog', href: '#', hasDropdown: true},
  {label: 'Pages', href: '#', hasDropdown: true},
  {label: 'Contact', href: '#'}
];

const MainNavbar = () => {
  return (
    <header className="relative z-10 bg-[#0b0440] text-white">
      <div className="mx-auto flex h-20 w-full max-w-[1200px] items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-6 w-6 text-emerald-400"
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
            <span className="text-[18px] font-semibold">Educrat</span>
          </Link>

          <button className="hidden items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-medium text-emerald-400 transition hover:text-emerald-300 lg:flex">
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
            Explore
          </button>
        </div>

        <nav className="hidden items-center gap-8 text-[14px] font-medium md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={
                'relative flex items-center gap-1 transition hover:text-emerald-300' +
                (item.isActive ? ' text-white' : ' text-white/70')
              }
            >
              <span>{item.label}</span>
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
                <span className="pointer-events-none absolute -bottom-5 left-0 right-0 h-px bg-white/15" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6 text-sm font-medium">
          <button
            type="button"
            className="hidden rounded-full bg-white/10 p-2 transition hover:bg-white/20 md:block"
            aria-label="Search"
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
            className="relative rounded-full bg-white/10 p-2 transition hover:bg-white/20"
            aria-label="Cart"
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
            <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              3
            </span>
          </button>

          <LanguageSwitcher />

          <Link href="/signin" className="hidden text-white/80 transition hover:text-white md:block">
            Log in
          </Link>
          <Link
            href="#"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#0b0440] transition hover:bg-white/90"
          >
            Sign up
          </Link>
        </div>
      </div>
      <div className="mx-auto h-px w-full max-w-[1200px] bg-white/10" />
    </header>
  );
};

export default MainNavbar;
