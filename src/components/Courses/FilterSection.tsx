"use client";

import { ReactNode } from 'react';

type FilterSectionProps = {
  title: string;
  children: ReactNode;
  footerLabel?: string;
  isCollapsible?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
};

export function FilterSection({
  title,
  footerLabel,
  children,
  isCollapsible = false,
  isOpen = true,
  onToggle
}: FilterSectionProps) {
  const contentId = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-content`;
  const isContentVisible = !isCollapsible || isOpen;

  return (
    <section className="rounded-3xl border border-[#e5e7fb] bg-white px-6 py-6 shadow-[0_18px_50px_rgba(12,10,78,0.08)]">
      <header className="flex items-center justify-between text-sm font-semibold text-[#120a5d]">
        <span>{title}</span>
        {isCollapsible ? (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-controls={contentId}
            className="flex h-8 w-8 items-center justify-center rounded-full text-primary transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </header>
      <div
        id={contentId}
        aria-hidden={isCollapsible && !isOpen}
        className={`grid transition-all duration-300 ease-out ${
          isContentVisible
            ? 'mt-5 grid-rows-[1fr] opacity-100'
            : 'mt-0 grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}
      >
        <div className="overflow-hidden space-y-3 text-sm text-[#514d78]">{children}</div>
      </div>
      {footerLabel && isContentVisible ? (
        <button className="mt-4 text-sm font-semibold text-primary transition hover:text-primary/80">
          {footerLabel}
        </button>
      ) : null}
    </section>
  );
}
