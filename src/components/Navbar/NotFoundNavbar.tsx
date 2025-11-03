'use client';

import Link from 'next/link';
import { LuSearch } from 'react-icons/lu';
import { useState } from 'react';

type NavItem = {
  label: string;
  href: string;
};

const NotFoundNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {label: 'Home', href: '/en'},
    {label: 'Courses', href: '/en/courses'},
    {label: 'Blog', href: '/en/blog'},
    {label: 'About', href: '/en/about'},
    {label: 'Contact', href: '/en/contact'}
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-100 border-b border-white/10 bg-[#0b0440] text-white shadow-[0_8px_24px_rgba(7,5,48,0.25)]">
      <div className="mx-auto flex h-24 w-full max-w-[1600px] items-center px-6">
        {/* Left group: Logo */}
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/en" className="flex items-center gap-3">
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
            <span className="text-[18px] whitespace-nowrap font-semibold">Educrat</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden flex-1 items-center justify-center gap-8 px-2 text-[15px] font-medium md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="relative flex items-center gap-1 whitespace-nowrap transition text-white/80 hover:text-white"
            >
              <span className="whitespace-nowrap">{item.label}</span>
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
            aria-label="Search"
          >
            <LuSearch className="h-6 w-6" />
          </button>


          {/* Login - Desktop Only */}
          <Link href="/en/login" className="hidden text-[14px] whitespace-nowrap text-white/80 transition hover:text-white md:block">
            Log in
          </Link>

          {/* Signup - Always Visible */}
          <Link
            href="/en/signup"
            className="whitespace-nowrap rounded-full bg-white px-6 py-2.5 text-[14px] font-semibold text-[#0b0440] transition hover:bg-white/90"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#0b0440] md:hidden">
          <nav className="mx-auto max-w-[1300px] px-6 py-6">
            {/* Navigation Links */}
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between rounded-lg px-4 py-3 transition hover:bg-white/5 text-white/70"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-[15px] font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Search */}
            <button
              type="button"
              className="mt-4 flex w-full items-center gap-3 rounded-lg bg-white/5 px-4 py-3 transition hover:bg-white/10"
              aria-label="Search"
            >
              <LuSearch className="h-6 w-6" />
              <span className="text-[15px] font-medium text-white/80">Search</span>
            </button>

            {/* Login Button */}
            <Link
              href="/en/login"
              className="mt-4 block rounded-full border-2 border-emerald-400 px-6 py-3 text-center text-[15px] font-semibold text-emerald-300 transition hover:bg-emerald-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Log in
            </Link>

            {/* Language Selection */}
            <div className="mt-4 flex justify-center gap-3">
              <Link
                href="/en"
                className="rounded-full border-2 border-white/20 px-4 py-2 text-[14px] font-medium text-white/80 transition hover:border-emerald-400 hover:text-emerald-400"
              >
                English
              </Link>
              <Link
                href="/ar"
                className="rounded-full border-2 border-white/20 px-4 py-2 text-[14px] font-medium text-white/80 transition hover:border-emerald-400 hover:text-emerald-400"
              >
                العربية
              </Link>
            </div>
          </nav>
        </div>
      )}

      <div className="mx-auto h-px w-full max-w-[1200px] bg-white/10" />
    </header>
  );
};

export default NotFoundNavbar;
