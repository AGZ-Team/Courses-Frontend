"use client";

import Image from 'next/image';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';
import { LuCirclePlay, LuClock3, LuGraduationCap } from 'react-icons/lu';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';

export type CourseCard = {
  id: number;
  title: string;
  image: string;
  rating: number;
  ratingCount: number;
  lessons: number;
  durationMinutes: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  author: string;
  authorAvatar: string;
  price: {
    previous?: number;
    current: number;
    isFree?: boolean;
  };
  badges?: { label: string; variant: 'accent' | 'success' }[];
  summary: string;
  highlights: string[];
  ctaLabel: string;
  ctaHref?: string;
};

type CourseCardItemProps = {
  course: CourseCard;
  index: number;
  columns: number;
  hoveredCourseId: number | null;
  onHoverChange: Dispatch<SetStateAction<number | null>>;
};

export function CourseCardItem({
  course,
  index,
  columns,
  hoveredCourseId,
  onHoverChange
}: CourseCardItemProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimeout.current) {
        clearTimeout(hoverTimeout.current);
      }
    };
  }, []);

  const handleEnter = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    onHoverChange(course.id);
  };

  const handleLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    hoverTimeout.current = setTimeout(() => {
      onHoverChange((current) => (current === course.id ? null : current));
    }, 140);
  };

  const isSingleColumn = columns <= 1;
  const columnIndex = columns > 0 ? index % columns : 0;
  
  // Determine hover direction based on column position and language direction
  let hoverDirection: 'left' | 'right' | 'bottom';
  if (isSingleColumn) {
    hoverDirection = 'bottom';
  } else if (isRTL) {
    // In RTL: last column (rightmost visually) should show modal on left (inside page)
    // Other columns show on right
    hoverDirection = columnIndex === columns - 1 ? 'left' : 'right';
  } else {
    // In LTR: last column (rightmost) should show modal on left (inside page)
    // Other columns show on right
    hoverDirection = columnIndex === columns - 1 ? 'left' : 'right';
  }
  
  const isHovered = hoveredCourseId === course.id;

  const positionClass =
    hoverDirection === 'bottom'
      ? 'left-1/2 top-full mt-4 -translate-x-1/2'
      : hoverDirection === 'left'
        ? isRTL
          ? 'left-full top-1/2 ml-4 -translate-y-1/2'
          : 'right-full top-1/2 mr-4 -translate-y-1/2'
        : isRTL
          ? 'right-full top-1/2 mr-4 -translate-y-1/2'
          : 'left-full top-1/2 ml-4 -translate-y-1/2';

  const transformClass =
    hoverDirection === 'bottom'
      ? isHovered
        ? 'translate-y-0'
        : 'translate-y-2'
      : hoverDirection === 'left'
        ? isHovered
          ? 'translate-x-0'
          : '-translate-x-2'
        : isHovered
          ? 'translate-x-0'
          : 'translate-x-2';

  const panelVisibilityClass = isHovered
    ? 'pointer-events-auto opacity-100'
    : 'pointer-events-none opacity-0';

  return (
    <article
      className="relative h-full"
      onMouseEnter={() => handleEnter()}
      onMouseLeave={() => handleLeave()}
    >
      <Link
        href={`/${locale}/courses/${course.id}`}
        className={`flex h-full flex-col overflow-hidden rounded-2xl border border-[#e5e7fb] bg-white shadow-[0_24px_60px_rgba(12,10,78,0.08)] transition duration-300 sm:rounded-3xl ${
          isHovered ? 'sm:translate-y-2 sm:shadow-[0_38px_90px_rgba(12,10,78,0.18)]' : ''
        }`}
      >
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={course.image}
              alt={course.title}
              fill
              sizes="(min-width: 1280px) 320px, (min-width: 768px) 45vw, 90vw"
              className={`object-cover transition duration-500 ${isHovered ? 'scale-105' : ''}`}
              priority
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent transition ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
          {course.badges?.length ? (
            <div className="absolute inset-x-5 top-5 flex flex-wrap gap-2">
              {course.badges.map((badge) => (
                <span
                  key={badge.label}
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                    badge.variant === 'accent'
                      ? 'bg-[#6440fb] text-white'
                      : 'bg-[#00d97e] text-white'
                  }`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-3 px-4 pb-5 pt-4 sm:gap-4 sm:px-6 sm:pb-6 sm:pt-5">
          <div className="flex items-center gap-2 text-sm text-[#514d78]">
            <span className="flex items-center gap-1 text-[#f6c160]">
              <FaStar size={14} />
              {course.rating.toFixed(1)}
            </span>
            <span className="text-xs text-[#8e8aa9]">({course.ratingCount.toLocaleString()})</span>
          </div>

          <h3
            className={`text-base font-semibold leading-snug transition sm:text-lg ${
              isHovered ? 'sm:text-[#6440fb]' : 'text-[#120a5d]'
            }`}
          >
            {course.title}
          </h3>

          <div className="flex flex-wrap gap-3 text-xs font-medium text-[#6e6b8f] sm:gap-4">
            <span className="inline-flex items-center gap-1">
              <LuCirclePlay className="text-[#6440fb]" size={16} />
              {course.lessons} lesson{course.lessons !== 1 ? 's' : ''}
            </span>
            <span className="inline-flex items-center gap-1">
              <LuClock3 className="text-[#6440fb]" size={16} />
              {Math.floor(course.durationMinutes / 60)}h {course.durationMinutes % 60}m
            </span>
            <span className="inline-flex items-center gap-1">
              <LuGraduationCap className="text-[#6440fb]" size={16} />
              {course.level}
            </span>
          </div>

          <p className="line-clamp-3 text-sm leading-6 text-[#433f74]">{course.summary}</p>

          <div className="mt-auto flex items-center justify-between border-t border-[#eceaf8] pt-3 sm:pt-4">
            <div className="flex items-center gap-2">
              <Image
                src={course.authorAvatar}
                alt={course.author}
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-sm font-medium text-[#433f74]">{course.author}</span>
            </div>

            <div className="text-right">
              {course.price.previous ? (
                <span className="block text-xs text-[#8e8aa9] line-through">
                  ${course.price.previous}
                </span>
              ) : null}
              <span className="block text-lg font-bold text-[#6440fb]">
                ${course.price.current}
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div
        className={`absolute z-20 hidden w-[360px] max-w-[calc(100vw-48px)] rounded-3xl border border-[#e5e7fb] bg-white p-6 shadow-[0_32px_80px_rgba(12,10,78,0.16)] transition duration-200 ease-out lg:block ${positionClass} ${transformClass} ${panelVisibilityClass}`}
      >
        {course.badges?.length ? (
          <div className="mb-3 flex flex-wrap gap-2">
            {course.badges.map((badge) => (
              <span
                key={badge.label}
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                  badge.variant === 'accent'
                    ? 'bg-[#6440fb] text-white'
                    : 'bg-[#00d97e] text-white'
                }`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        ) : null}

        <h3 className="text-xl font-semibold leading-snug text-[#120a5d]">{course.title}</h3>

        <div className="mt-3 flex flex-wrap gap-4 text-sm font-medium text-[#6e6b8f]">
          <span className="inline-flex items-center gap-2">
            <LuCirclePlay className="text-[#6440fb]" />
            {course.lessons} lesson{course.lessons !== 1 ? 's' : ''}
          </span>
          <span className="inline-flex items-center gap-2">
            <LuClock3 className="text-[#6440fb]" />
            {Math.floor(course.durationMinutes / 60)}h {course.durationMinutes % 60}m
          </span>
          <span className="inline-flex items-center gap-2">
            <LuGraduationCap className="text-[#6440fb]" />
            {course.level}
          </span>
        </div>

        <p className="mt-4 text-sm leading-6 text-[#433f74]">{course.summary}</p>

        <ul className="mt-4 space-y-2 text-sm text-[#5f5c7b]">
          {course.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-2">
              <svg
                className="mt-0.5 shrink-0 text-[#6440fb]"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm3.97 4.97a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
              </svg>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xl font-semibold text-[#6440fb]">${course.price.current}</span>
          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9d7f0] text-[#433f74] transition hover:border-[#6440fb] hover:text-[#6440fb]">
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
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <button className="rounded-xl bg-[#6440fb] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(100,64,251,0.35)] transition hover:bg-[#5533db]">
              {course.ctaLabel}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
