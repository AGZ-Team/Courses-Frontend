"use client";

import {useEffect, useMemo, useRef, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';

type SortDropdownProps = {
  options: string[];
  onChange?: (value: string) => void;
  className?: string;
};

export function SortDropdown({options, onChange, className}: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const t = useTranslations('coursesPage.sortOptions');

  const selected = useMemo(() => options[activeIndex] ?? '', [options, activeIndex]);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target)) return;
      if (listRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  // Keyboard interactions
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'Down') {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === 'ArrowUp' || e.key === 'Up') {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (open) {
        onChange?.(options[activeIndex]);
        setOpen(false);
      } else {
        setOpen(true);
      }
    } else if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      setOpen(false);
    }
  };

  const caretSideClass = isRTL ? 'left-4' : 'right-4';
  const paddingEndClass = isRTL ? 'pl-10' : 'pr-10';

  return (
    <div className={`relative ${className ?? ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`h-11 w-full rounded-xl border border-[#d9d7f0] bg-white px-4 ${paddingEndClass} text-start font-semibold text-[#433f74] shadow-[0_12px_30px_rgba(12,10,78,0.08)] transition hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 md:w-48`}
      >
        <span className="block truncate">{t(selected)}</span>
        <svg
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-[#433f74] ${caretSideClass}`}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          ref={listRef}
          role="listbox"
          aria-activedescendant={`sort-option-${activeIndex}`}
          className={`absolute z-40 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-[#d9d7f0] bg-white p-1 shadow-[0_18px_36px_rgba(12,10,78,0.14)] focus:outline-none ${
            isRTL ? 'right-0' : 'left-0'
          }`}
        >
          {options.map((opt, idx) => {
            const selected = idx === activeIndex;
            return (
              <button
                id={`sort-option-${idx}`}
                key={opt}
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setActiveIndex(idx);
                  onChange?.(options[idx]);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-start transition ${
                  selected
                    ? 'bg-[#f4f3ff] font-semibold text-[#433f74]'
                    : 'text-[#433f74] hover:bg-[#f7f7ff]'
                }`}
              >
                <span className="truncate">{t(opt)}</span>
                {selected ? (
                  <svg
                    className="text-primary"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M13.485 3.879a1 1 0 0 1 0 1.414l-6.364 6.364a1 1 0 0 1-1.414 0L2.515 8.485a1 1 0 1 1 1.414-1.414L6.5 9.643l5.657-5.657a1 1 0 0 1 1.414 0z" />
                  </svg>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
