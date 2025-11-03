'use client';

import Link from 'next/link';
import {useLocale, useTranslations} from 'next-intl';
import {usePathname} from 'next/navigation';
import {Fragment, useMemo} from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export type BreadCrumbProps = {
  /**
   * Provide a custom trail when automatic path detection isn't sufficient.
   * Items without `href` are rendered as the current page (non-clickable).
   */
  items?: BreadcrumbItem[];
  /** Optional className passed to root wrapper */
  className?: string;
};

const formatSegment = (segment: string) =>
  segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export default function BreadCrumb({items, className}: BreadCrumbProps) {
  const t = useTranslations('breadcrumb');
  const locale = useLocale();
  const pathname = usePathname();

  const localeSegments = useMemo(() => {
    if (!pathname) {
      return [] as string[];
    }
    const segments = pathname.split('?')[0].split('/').filter(Boolean);
    return segments[0] === locale ? segments.slice(1) : segments;
  }, [pathname, locale]);

  const shouldHide = !pathname || localeSegments.length === 0 || (localeSegments.length === 1 && localeSegments[0] === 'contact');

   const shouldHide2 = !pathname || localeSegments.length === 0 || (localeSegments.length === 1 && localeSegments[0] === 'login');

   const shouldHide3 = !pathname || localeSegments.length === 0 || (localeSegments.length === 1 && localeSegments[0] === 'signup');

  const autoItems = useMemo(() => {
    const crumbs: BreadcrumbItem[] = [
      {label: t('home'), href: `/${locale}`}
    ];

    if (localeSegments.length === 0) {
      return crumbs;
    }

    // Known translatable segments
    const knownSegments = ['courses', 'events', 'blog', 'about', 'contact', 'login', 'signup', 'privacy', 'terms'];

    localeSegments.forEach((segment, index) => {
      const href = `/${[locale, ...localeSegments.slice(0, index + 1)].join('/')}`;
      let label: string;
      
      // Check if it's a dynamic segment (contains numbers or special patterns)
      const isDynamic = /^\d+$/.test(segment) || segment.match(/^[a-z]+-\d+$/);
      
      if (isDynamic) {
        // For dynamic segments like course IDs, skip them in breadcrumb
        return;
      } else if (knownSegments.includes(segment)) {
        // Use translation for known segments
        label = t(segment as Parameters<typeof t>[0]);
      } else {
        // Format unknown segments
        label = formatSegment(segment);
      }
      
      crumbs.push({label, href});
    });

    const last = crumbs[crumbs.length - 1];
    if (last) {
      crumbs[crumbs.length - 1] = {label: last.label};
    }

    return crumbs;
  }, [locale, localeSegments, t]);

  const trail = useMemo(() => {
    if (items?.length) {
      const cloned = [...items];
      const last = cloned[cloned.length - 1];
      if (last) {
        cloned[cloned.length - 1] = {label: last.label};
      }
      return cloned;
    }
    return autoItems;
  }, [items, autoItems]);

  if (shouldHide || trail.length === 0) {
    return null;
  }
  if (shouldHide2 || trail.length === 0) {
    return null;
  }
  if (shouldHide3 || trail.length === 0) {
    return null;
  }


  return (
    <nav
      aria-label={t('ariaLabel')}
      className={`w-full border-y mt-25 border-[#e6e4f5] bg-slate-100 ${className ?? ''}`.trim()}
    >
      <div className="mx-auto  flex w-full max-w-[1480px] items-center justify-left px-4 py-4 text-xs font-medium text-[#6e6b8f]">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;
          const content = item.href && !isLast ? (
            <Link
              href={item.href}
              className="transition hover:text-[#6440fb]"
            >
              {item.label}
            </Link>
          ) : (
            <span className={isLast ? 'text-[#120a5d] font-semibold' : undefined}>{item.label}</span>
          );

          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 ? <span className="mx-2 text-[#b3b2c9]">•</span> : null}
              {content}
            </Fragment>
          );
        })}
      </div>
    </nav>
  );
}
