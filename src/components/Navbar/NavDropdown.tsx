'use client';

import { useState, useRef, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';

export interface DropdownItem {
  labelKey: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onSelect?: () => void;
}

interface NavDropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right' | 'center';
  className?: string;
  onItemClick?: () => void;
  rightPanel?: React.ReactNode; // optional marketing panel on the right
  profileMode?: boolean; // special RTL handling for profile dropdown
}

export function NavDropdown({
  trigger,
  items,
  align = 'left',
  className = '',
  onItemClick,
  rightPanel,
  profileMode = false
}: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [supportsHover, setSupportsHover] = useState(true);

  useEffect(() => {
    // Determine if the device supports hover (e.g., desktop vs touch devices)
    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      const mq = window.matchMedia('(hover: hover)');
      setSupportsHover(mq.matches);
      const handler = (e: MediaQueryListEvent) => setSupportsHover(e.matches);
      mq.addEventListener?.('change', handler);
      return () => mq.removeEventListener?.('change', handler);
    }
  }, [isOpen]);

  useEffect(() => {
    const handlePointerOutside = (event: Event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handlePointerOutside);
      document.addEventListener('touchstart', handlePointerOutside, { passive: true });
    }
    return () => {
      document.removeEventListener('mousedown', handlePointerOutside);
      document.removeEventListener('touchstart', handlePointerOutside);
    };
  }, [isOpen]);

  const handleSelect = (callback?: () => void) => {
    callback?.();
    setIsOpen(false);
    onItemClick?.();
  };

  const alignmentClasses = {
    left: isAr ? 'right-0' : 'left-0',
    right: isAr ? 'left-0' : 'right-0',
    center: 'left-1/2 -translate-x-1/2'
  } as const;

  // Hover handling on the container to avoid flicker between trigger and menu
  const onEnter = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setIsOpen(true);
  };
  const onLeave = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div
      className={`relative ${className}`}
      ref={dropdownRef}
      onMouseEnter={supportsHover ? onEnter : undefined}
      onMouseLeave={supportsHover ? onLeave : undefined}
      onMouseDown={(e) => {
        // Prevent outside handlers from firing while interacting with dropdown
        e.stopPropagation();
      }}
      onTouchStart={(e) => {
        // Prevent outside touchstart from closing immediately on open
        e.stopPropagation();
      }}
    >
      {/* Trigger */}
      <div
        className="cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((v) => !v);
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          setIsOpen((v) => !v);
        }}
      >
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute top-full ${alignmentClasses[align]} mt-2 z-50 max-h-[80vh] overflow-y-auto overflow-x-hidden rounded-xl border border-white/15 bg-white backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-max max-w-[calc(100vw-2rem)] md:max-w-none`}
        >
          <div className={`grid grid-cols-1 gap-2 px-3 py-2 ${rightPanel ? 'md:grid-cols-[minmax(200px,auto)_minmax(340px,420px)] md:gap-3' : ''}`}>
            {/* Items column */}
            <div className="py-1">
              {items.map((item) => {
                const isLogout = item.labelKey === 'logout';
                const rtlProfileClasses = profileMode && isAr ? 'flex-row-reverse text-right' : 'text-left';
                const commonClassName = `flex items-center ${rtlProfileClasses} gap-3 px-5 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isLogout
                    ? 'text-red-400 hover:bg-red-400/10 hover:text-red-400'
                    : 'text-[#0ABAB5] hover:bg-[#0ABAB5]/10 hover:text-[#0ABAB5]'
                }`;

                const content = (
                  <>
                    {item.icon && <span className="shrink-0">{item.icon}</span>}
                    <span className={isAr ? 'text-[15px]' : 'text-[14px]'}>{item.label}</span>
                  </>
                );

                if (item.href) {
                  return (
                    <Link
                      key={item.labelKey}
                      href={item.href}
                      onClick={() => handleSelect(item.onSelect)}
                      className={commonClassName}
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.labelKey}
                    type="button"
                    onClick={() => handleSelect(item.onSelect)}
                    className={`${commonClassName} w-full`}
                  >
                    {content}
                  </button>
                );
              })}
            </div>

            {/* Optional right panel */}
            {rightPanel && (
              <div className="rounded-lg  p-3 md:p-4">
                {rightPanel}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
