'use client';

import { useLocale } from 'next-intl';

export function Pagination() {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  return (
    <nav
      className="flex items-center justify-center gap-2 pt-6 sm:gap-3"
      aria-label="Courses pagination"
    >
      <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9d7f0] text-[#433f74] transition hover:border-[#6440fb] hover:text-[#6440fb] sm:h-11 sm:w-11">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points={isRTL ? "9 18 15 12 9 6" : "15 18 9 12 15 6"} />
        </svg>
      </button>
      {[1, 2, 3, 4].map((page) => (
        <button
          key={page}
          className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition sm:h-11 sm:w-11 ${
            page === 1
              ? 'border-[#6440fb] bg-[#6440fb] text-white shadow-[0_12px_30px_rgba(100,64,251,0.35)]'
              : 'border-transparent text-[#433f74] hover:border-[#6440fb] hover:text-[#6440fb]'
          }`}
        >
          {page}
        </button>
      ))}
      <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9d7f0] text-[#433f74] transition hover:border-[#6440fb] hover:text-[#6440fb] sm:h-11 sm:w-11">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points={isRTL ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
        </svg>
      </button>
    </nav>
  );
}
