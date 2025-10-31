"use client";

import {useEffect, useRef, useState, type Dispatch, type ReactNode, type SetStateAction} from 'react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {FaStar} from 'react-icons/fa';
import {LuBookmark, LuCircleCheck, LuClock3, LuCirclePlay, LuGraduationCap} from 'react-icons/lu';
type CourseCard = {
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
  badges?: {label: string; variant: 'accent' | 'success'}[];
  summary: string;
  highlights: string[];
  ctaLabel: string;
  ctaHref?: string;
};

type FilterOption = {
  id?: string;
  label: string;
  count?: number;
  type?: 'checkbox' | 'radio';
  isActive?: boolean;
};

type FilterGroup = {
  title: string;
  options: FilterOption[];
  footerLabel?: string;
  isExpanded?: boolean;
};

type RatingFilter = {
  label: string;
  count: number;
  threshold: number;
};

const COURSES: CourseCard[] = [
  {
    id: 1,
    title: 'Learn Figma – UI/UX Design Essential Training',
    image: '/coursesImages/1.png',
    rating: 4.3,
    ratingCount: 1991,
    lessons: 6,
    durationMinutes: 320,
    level: 'Beginner',
    author: 'Jane Cooper',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: {previous: 199, current: 79},
    badges: [{label: 'Popular', variant: 'accent'}],
    summary:
      'Master the fundamentals of UI/UX design in Figma with hands-on projects, critiques, and responsive workflows.',
    highlights: ['Design accessible component systems', 'Craft polished prototypes quickly', 'Receive expert feedback sessions'],
    ctaLabel: 'Add to Cart'
  },
  {
    id: 2,
    title: 'Complete Python Bootcamp From Zero to Hero in Python',
    image: '/coursesImages/2.png',
    rating: 4.7,
    ratingCount: 2891,
    lessons: 8,
    durationMinutes: 410,
    level: 'Expert',
    author: 'Jenny Wilson',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: {previous: 189, current: 89},
    badges: [
      {label: 'Popular', variant: 'accent'},
      {label: 'Best Sellers', variant: 'success'}
    ],
    summary: 'Build production-ready Python applications using modern tooling, testing, and deployment practices.',
    highlights: ['Write clean, maintainable Python code', 'Practice with 20+ guided projects', 'Ace technical interviews with confidence'],
    ctaLabel: 'Add to Cart'
  },
  {
    id: 3,
    title: 'Angular – The Complete Guide (2022 Edition)',
    image: '/coursesImages/3.png',
    rating: 4.5,
    ratingCount: 1983,
    lessons: 6,
    durationMinutes: 420,
    level: 'Intermediate',
    author: 'Albert Flores',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: {previous: 249, current: 129},
    summary: 'Ship enterprise Angular apps with robust architecture, state management, testing, and CI/CD integrations.',
    highlights: ['Master RxJS & NgRx patterns', 'Optimize performance with lazy loading', 'Automate deployments with pipelines'],
    ctaLabel: 'Add to Cart'
  },
  {
    id: 4,
    title: 'The Ultimate Drawing Course Beginner to Advanced',
    image: '/coursesImages/4.png',
    rating: 4.2,
    ratingCount: 1981,
    lessons: 7,
    durationMinutes: 430,
    level: 'Expert',
    author: 'Jacob Jones',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: {previous: 179, current: 99},
    badges: [{label: 'Best Sellers', variant: 'success'}],
    summary: 'Develop professional drawing skills with structured exercises, feedback, and portfolio-ready projects.',
    highlights: ['Understand light, form, and perspective', 'Create captivating compositions', 'Refine your personal illustration style'],
    ctaLabel: 'Enroll Now'
  },
  {
    id: 5,
    title: 'Creative Interface Systems: From Components to Craft',
    image: '/coursesImages/5.png',
    rating: 4.6,
    ratingCount: 1730,
    lessons: 5,
    durationMinutes: 360,
    level: 'Advanced',
    author: 'Courtney Henry',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: {previous: 219, current: 109},
    summary: 'Design and document scalable component libraries that bridge design and engineering teams.',
    highlights: ['Craft accessible component APIs', 'Automate design tokens & theming', 'Collaborate seamlessly with developers'],
    ctaLabel: 'Add to Cart'
  },
  {
    id: 6,
    title: 'Modern Web Development: Build Responsive Experiences',
    image: '/coursesImages/7.png',
    rating: 4.8,
    ratingCount: 2310,
    lessons: 9,
    durationMinutes: 480,
    level: 'Advanced',
    author: 'Guy Hawkins',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: {previous: 229, current: 139},
    summary: 'Ship modern full-stack web apps with resilient architecture, CI/CD, and best-in-class performance.',
    highlights: ['Architect scalable frontends', 'Integrate robust CI/CD pipelines', 'Deliver 90+ Lighthouse scores'],
    ctaLabel: 'Add to Cart'
  },
  {
    id: 7,
    title: 'Photography Masterclass: Complete Guide to Photography',
    image: '/coursesImages/8.png',
    rating: 4.4,
    ratingCount: 1570,
    lessons: 8,
    durationMinutes: 515,
    level: 'Intermediate',
    author: 'Theresa Webb',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: {previous: 219, current: 129},
    summary: 'Capture studio-quality photos anywhere with pro lighting, composition, and editing techniques.',
    highlights: ['Master manual camera settings', 'Design cinematic lighting setups', 'Edit confidently in Lightroom'],
    ctaLabel: 'Add to Cart'
  },
  {
    id: 8,
    title: 'Animation Fundamentals: Bring Characters to Life',
    image: '/coursesImages/6.png',
    rating: 4.4,
    ratingCount: 1250,
    lessons: 5,
    durationMinutes: 360,
    level: 'Intermediate',
    author: 'Courtney Henry',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: {previous: 199, current: 119},
    summary: 'Animate expressive characters with professional principles, workflows, and cinematic storytelling.',
    highlights: ['Animate believable motion arcs', 'Develop timing & spacing intuition', 'Polish renders with pro workflows'],
    ctaLabel: 'Enroll Now'
  },
  {
    id: 9,
    title: 'Creative Writing Mastery: Craft Compelling Stories',
    image: '/coursesImages/9.png',
    rating: 4.1,
    ratingCount: 980,
    lessons: 6,
    durationMinutes: 300,
    level: 'Intermediate',
    author: 'Esther Howard',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: {previous: 199, current: 109},
    summary: 'Strengthen your narrative voice with practical storytelling frameworks and constructive critique.',
    highlights: ['Outline page-turning plots', 'Create memorable characters', 'Workshop chapters with peers'],
    ctaLabel: 'Add to Cart'
  },
  {
    id: 10,
    title: 'Data Visualization with D3 & Observable',
    image: '/coursesImages/10.png',
    rating: 4.6,
    ratingCount: 1675,
    lessons: 7,
    durationMinutes: 390,
    level: 'Advanced',
    author: 'Devon Lane',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: {previous: 239, current: 139},
    summary: 'Tell powerful stories with interactive visualizations powered by D3, Observable, and modern tooling.',
    highlights: ['Design data-first narratives', 'Build reusable chart components', 'Deploy interactive dashboards'],
    ctaLabel: 'Join the Cohort'
  },
  {
    id: 11,
    title: 'Product Strategy: From Discovery to Delivery',
    image: '/coursesImages/11.png',
    rating: 4.9,
    ratingCount: 2450,
    lessons: 6,
    durationMinutes: 340,
    level: 'Advanced',
    author: 'Leslie Alexander',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: {previous: 259, current: 149},
    summary: 'Align product teams around outcomes with actionable discovery frameworks and facilitation skills.',
    highlights: ['Run impactful discovery sessions', 'Build outcome-driven roadmaps', 'Measure success with clarity'],
    ctaLabel: 'Enroll Now'
  },
  {
    id: 12,
    title: 'Full-Stack TypeScript with Next.js & GraphQL',
    image: '/coursesImages/12.png',
    rating: 4.7,
    ratingCount: 2120,
    lessons: 9,
    durationMinutes: 500,
    level: 'Advanced',
    author: 'Cameron Williamson',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: {previous: 279, current: 159},
    summary: 'Build production-grade SaaS apps with typed APIs, server actions, and performance-focused tooling.',
    highlights: ['Design resilient GraphQL schemas', 'Automate E2E testing with Playwright', 'Deploy globally with Vercel Edge'],
    ctaLabel: 'Add to Cart'
  }
];

const FILTER_GROUPS: FilterGroup[] = [
  {
    title: 'Category',
    options: [
      {label: 'All', count: 43, type: 'checkbox', isActive: true},
      {label: 'Art', count: 4, type: 'checkbox'},
      {label: 'Animation', count: 6, type: 'checkbox'},
      {label: 'Design', count: 10, type: 'checkbox'},
      {label: 'Photography', count: 9, type: 'checkbox'},
      {label: 'Programming', count: 7, type: 'checkbox'},
      {label: 'Writing', count: 7, type: 'checkbox'}
    ],
    footerLabel: 'Show more'
  },
  {
    title: 'Instructors',
    options: [
      {label: 'All', count: 43, type: 'checkbox', isActive: true},
      {label: 'Jane Cooper', count: 9, type: 'checkbox'},
      {label: 'Jenny Wilson', count: 7, type: 'checkbox'},
      {label: 'Albert Flores', count: 6, type: 'checkbox'},
      {label: 'Jacob Jones', count: 6, type: 'checkbox'}
    ],
    footerLabel: 'Show more'
  },
  {
    title: 'Price',
    options: [
      {label: 'All', count: 43, type: 'radio', isActive: true},
      {label: 'Free', count: 11, type: 'radio'},
      {label: 'Paid', count: 32, type: 'radio'}
    ]
  },
  {
    title: 'Level',
    options: [
      {label: 'All', count: 43, type: 'checkbox', isActive: true},
      {label: 'Beginner', count: 12, type: 'checkbox'},
      {label: 'Intermediate', count: 14, type: 'checkbox'},
      {label: 'Advanced', count: 10, type: 'checkbox'},
      {label: 'Expert', count: 7, type: 'checkbox'}
    ]
  },
  {
    title: 'Language',
    options: [
      {label: 'All', count: 43, type: 'checkbox', isActive: true},
      {label: 'English', count: 18, type: 'checkbox'},
      {label: 'Spanish', count: 7, type: 'checkbox'},
      {label: 'German', count: 6, type: 'checkbox'},
      {label: 'French', count: 5, type: 'checkbox'}
    ]
  },
  {
    title: 'Duration',
    options: [
      {label: 'All', count: 43, type: 'checkbox', isActive: true},
      {label: '0 - 1 hour', count: 8, type: 'checkbox'},
      {label: '1 - 3 hours', count: 14, type: 'checkbox'},
      {label: '3 - 6 hours', count: 11, type: 'checkbox'},
      {label: '6+ hours', count: 10, type: 'checkbox'}
    ]
  }
];

const RATING_FILTERS: RatingFilter[] = [
  {label: '4.5 & up', count: 21, threshold: 4.5},
  {label: '4.0 & up', count: 19, threshold: 4},
  {label: '3.5 & up', count: 3, threshold: 3.5},
  {label: '3.0 & up', count: 0, threshold: 3}
];

const SORT_OPTIONS = ['Default', 'Popular', 'Price (low to high)', 'Price (high to low)', 'Rating'];

export default function CoursesPage() {
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>(() =>
    FILTER_GROUPS.map((group) => ({
      ...group,
      isExpanded: true,
      options: group.options.map((option, index) => ({
        ...option,
        id: `${group.title}-${index}`
      }))
    }))
  );
  const [isRatingsExpanded, setIsRatingsExpanded] = useState(true);
  const [gridColumns, setGridColumns] = useState(1);
  const [hoveredCourseId, setHoveredCourseId] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setGridColumns(3);
      } else if (width >= 640) {
        setGridColumns(2);
      } else {
        setGridColumns(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggle = (groupIndex: number, optionIndex: number) => {
    setFilterGroups((prev) =>
      prev.map((group, gIdx) => {
        if (gIdx !== groupIndex) {
          return group;
        }

        const clickedOption = group.options[optionIndex];
        if (!clickedOption) {
          return group;
        }

        if (clickedOption.type === 'radio') {
          const updatedRadioOptions = group.options.map((option, oIdx) => ({
            ...option,
            isActive: oIdx === optionIndex
          }));
          return {...group, options: updatedRadioOptions};
        }

        let updatedOptions = group.options.map((option, oIdx) => {
          if (oIdx === optionIndex) {
            const nextActive = !Boolean(option.isActive);
            return {...option, isActive: nextActive};
          }
          return option;
        });

        if (updatedOptions.length > 0) {
          if (optionIndex === 0) {
            if (updatedOptions[0]?.isActive) {
              updatedOptions = updatedOptions.map((option, idx) =>
                idx === 0 ? option : {...option, isActive: false}
              );
            }
          } else {
            const selectedNonAllCount = updatedOptions.filter(
              (option, idx) => idx !== 0 && option.isActive
            ).length;
            updatedOptions[0] = {
              ...updatedOptions[0],
              isActive: selectedNonAllCount === 0
            };
          }
        }

        return {...group, options: updatedOptions};
      })
    );
  };

  const [primaryGroup, ...additionalGroups] = filterGroups;

  const handleSectionToggle = (groupIndex: number) => {
    setFilterGroups((prev) =>
      prev.map((group, idx) => {
        if (idx !== groupIndex) {
          return group;
        }
        return {...group, isExpanded: !group.isExpanded};
      })
    );
  };

  return (
    <main className="w-full bg-white pb-24 text-[#1f1c3b]">
      <HeaderSection /> 

      <section className="mx-auto mt-16 w-full max-w-[1480px] px-4 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm font-medium text-[#6e6b8f]">
            Showing <span className="text-[#120a5d]">43</span> total results
          </p>

          <div className="flex w-full items-center gap-3 text-sm text-[#433f74] md:w-auto">
            <span className="hidden font-medium md:inline">Sort by:</span>
            <div className="relative w-full md:w-48">
              <select
                aria-label="Sort courses"
                defaultValue="Default"
                className="h-11 w-full appearance-none rounded-xl border border-[#d9d7f0] bg-white px-4 pr-10 text-sm font-semibold text-[#433f74] shadow-[0_12px_30px_rgba(12,10,78,0.08)] transition focus:border-[#7c5cff] focus:outline-none"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#7c5cff]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,300px)_1fr]">
          <aside className="hidden space-y-6 lg:block">
            {primaryGroup ? (
              <FilterSection
                title={primaryGroup.title}
                footerLabel={primaryGroup.footerLabel}
                isCollapsible
                isOpen={primaryGroup.isExpanded !== false}
                onToggle={() => handleSectionToggle(0)}
              >
                <FilterList
                  options={primaryGroup.options}
                  onOptionToggle={(optionIndex) => handleToggle(0, optionIndex)}
                />
              </FilterSection>
            ) : null}

            <FilterSection
              title="Ratings"
              isCollapsible
              isOpen={isRatingsExpanded}
              onToggle={() => setIsRatingsExpanded((prev) => !prev)}
            >
              {isRatingsExpanded ? <RatingList ratings={RATING_FILTERS} /> : null}
            </FilterSection>

            {additionalGroups.map((group, groupIndex) => (
              <FilterSection
                key={group.title}
                title={group.title}
                footerLabel={group.footerLabel}
                isCollapsible
                isOpen={group.isExpanded !== false}
                onToggle={() => handleSectionToggle(groupIndex + 1)}
              >
                <FilterList
                  options={group.options}
                  onOptionToggle={(optionIndex) => handleToggle(groupIndex + 1, optionIndex)}
                />
              </FilterSection>
            ))}
          </aside>

          <div className="space-y-10">
            <div className="grid auto-rows-[1fr] items-start gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {COURSES.map((course, index) => (
                <CourseCardItem
                  key={course.id}
                  course={course}
                  index={index}
                  columns={gridColumns}
                  hoveredCourseId={hoveredCourseId}
                  onHoverChange={setHoveredCourseId}
                />
              ))}
            </div>

            <Pagination />
          </div>
        </div>
      </section>
    </main>
  );
}

function HeaderSection() {
  return (
    <header className="w-full border-b border-[#e6e4f5] bg-white">
      <div className="mx-auto w-full max-w-[1180px] px-4 py-14 sm:px-6 sm:py-16">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d1cff4] bg-[#f3f2ff] px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#5f58c6]">
            Explore
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-[#120a5d] sm:text-[2.85rem]">
            User Interface Courses
          </h1>
          <p className="mt-4 text-base leading-7 text-[#5f5c7b] sm:text-lg">
            Write an introductory description of the category. Discover curated experiences designed to elevate your design workflow.
          </p>
        </div>
      </div>
    </header>
  );
}

type FilterSectionProps = {
  title: string;
  children: ReactNode;
  footerLabel?: string;
  isCollapsible?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
};

function FilterSection({title, footerLabel, children, isCollapsible = false, isOpen = true, onToggle}: FilterSectionProps) {
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
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#7c5cff] transition hover:bg-[#f2f1ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c5cff]"
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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c5cff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </header>
      <div
        id={contentId}
        aria-hidden={isCollapsible && !isOpen}
        className={`grid transition-all duration-300 ease-out ${isContentVisible ? 'mt-5 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0 pointer-events-none'}`}
      >
        <div className="overflow-hidden space-y-3 text-sm text-[#514d78]">{children}</div>
      </div>
      {footerLabel && isContentVisible ? (
        <button className="mt-4 text-sm font-semibold text-[#6440fb] transition hover:text-[#8360ff]">
          {footerLabel}
        </button>
      ) : null}
    </section>
  );
}

type FilterListProps = {
  options: FilterOption[];
  onOptionToggle: (optionIndex: number) => void;
};

function FilterList({options, onOptionToggle}: FilterListProps) {
  return (
    <ul className="space-y-3">
      {options.map((option, index) => (
        <li key={option.id ?? option.label}>
          <button
            type="button"
            onClick={() => onOptionToggle(index)}
            className="flex w-full items-center justify-between gap-3 rounded-[10px] px-2 py-1.5 text-left transition hover:bg-[#f4f3ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c5cff]"
            aria-pressed={Boolean(option.isActive)}
          >
            <span className="flex items-center gap-3 text-sm">
              <span
                className={`flex h-[18px] w-[18px] items-center justify-center border ${
                  option.type === 'radio' ? 'rounded-full' : 'rounded-[6px]'
                } ${option.isActive ? 'border-[#6440fb] bg-[#6440fb] text-white' : 'border-[#c9c7e6] bg-white text-transparent'}`}
              >
                {option.isActive ? (
                  option.type === 'radio' ? (
                    <span className="block h-[8px] w-[8px] rounded-full bg-white" />
                  ) : (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="2 6.5 4.5 9 10 3" />
                    </svg>
                  )
                ) : null}
              </span>
              <span>{option.label}</span>
            </span>
            {typeof option.count === 'number' ? (
              <span className="text-xs font-medium text-[#8e8aa9]">({option.count})</span>
            ) : null}
          </button>
        </li>
      ))}
    </ul>
  );
}

type RatingListProps = {
  ratings: RatingFilter[];
};

function RatingList({ratings}: RatingListProps) {
  return (
    <ul className="space-y-3">
      <li className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <StarRow value={5} />
          All
        </div>
        <span className="text-xs font-medium text-[#8e8aa9]">(43)</span>
      </li>
      {ratings.map((rating) => (
        <li key={rating.label} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <StarRow value={rating.threshold} />
            {rating.label}
          </div>
          <span className="text-xs font-medium text-[#8e8aa9]">({rating.count})</span>
        </li>
      ))}
    </ul>
  );
}

type StarRowProps = {
  value: number;
};

function StarRow({value}: StarRowProps) {
  return (
    <span className="flex items-center gap-1 text-[#f6c160]">
      {Array.from({length: 5}).map((_, index) => (
        <FaStar
          key={index}
          size={14}
          className={index + 1 <= Math.floor(value) ? 'fill-current' : 'fill-[#e0e0f4] text-[#e0e0f4]'}
        />
      ))}
    </span>
  );
}

type CourseCardItemProps = {
  course: CourseCard;
  index: number;
  columns: number;
  hoveredCourseId: number | null;
  onHoverChange: Dispatch<SetStateAction<number | null>>;
};

function CourseCardItem({course, index, columns, hoveredCourseId, onHoverChange}: CourseCardItemProps) {
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
  const hoverDirection = isSingleColumn ? 'bottom' : columnIndex === columns - 1 ? 'left' : 'right';
  const isHovered = hoveredCourseId === course.id;

  const positionClass =
    hoverDirection === 'bottom'
      ? 'left-1/2 top-full mt-4 -translate-x-1/2'
      : hoverDirection === 'left'
        ? 'right-full top-1/2 mr-4 -translate-y-1/2'
        : 'left-full top-1/2 ml-4 -translate-y-1/2';

  const transformClass =
    hoverDirection === 'bottom'
      ? isHovered ? 'translate-y-0' : 'translate-y-2'
      : hoverDirection === 'left'
        ? isHovered ? 'translate-x-0' : '-translate-x-2'
        : isHovered ? 'translate-x-0' : 'translate-x-2';

  const panelVisibilityClass = isHovered
    ? 'pointer-events-auto opacity-100'
    : 'pointer-events-none opacity-0';

  return (
    <article
      className="relative h-full"
      onMouseEnter={() => handleEnter()}
      onMouseLeave={() => handleLeave()}
    >
      <div
        className={`flex h-full flex-col overflow-hidden rounded-3xl border border-[#e5e7fb] bg-white shadow-[0_24px_60px_rgba(12,10,78,0.08)] transition duration-300 ${
          isHovered ? 'translate-y-2 shadow-[0_38px_90px_rgba(12,10,78,0.18)]' : ''
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
                    badge.variant === 'accent' ? 'bg-[#6440fb] text-white' : 'bg-[#50f0a9] text-[#10213a]'
                  }`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-4 px-6 pb-6 pt-5">
          <div className="flex items-center gap-2 text-sm text-[#514d78]">
            <span className="flex items-center gap-1 text-[#f6c160]">
              <FaStar size={14} />
              <span className="font-semibold text-[#f6c160]">{course.rating.toFixed(1)}</span>
            </span>
            <span className="text-xs text-[#8e8aa9]">({course.ratingCount.toLocaleString()})</span>
          </div>

          <h3 className={`text-lg font-semibold leading-snug transition ${isHovered ? 'text-[#6440fb]' : 'text-[#120a5d]'}`}>
            {course.title}
          </h3>

          <div className="flex flex-wrap gap-4 text-xs font-medium text-[#6e6b8f]">
            <span className="inline-flex items-center gap-1">
              <LuCirclePlay className="text-[#6440fb]" />
              {course.lessons} lesson{course.lessons > 1 ? 's' : ''}
            </span>
            <span className="inline-flex items-center gap-1">
              <LuClock3 className="text-[#6440fb]" />
              {Math.floor(course.durationMinutes / 60)}h {course.durationMinutes % 60}m
            </span>
            <span className="inline-flex items-center gap-1">
              <LuGraduationCap className="text-[#6440fb]" />
              {course.level}
            </span>
          </div>

          <p className="text-sm leading-6 text-[#433f74]">{course.summary}</p>

          <div className="mt-auto flex items-center justify-between border-t border-[#eceaf8] pt-4">
            <div className="flex items-center gap-3">
              <Image
                src={course.authorAvatar}
                alt={course.author}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-[#433f74]">{course.author}</span>
            </div>

            <div className="text-right text-sm font-semibold text-[#120a5d]">
              {course.price.isFree ? (
                <span>Free</span>
              ) : (
                <>
                  {course.price.previous ? (
                    <span className="mr-2 text-xs font-medium text-[#8e8aa9] line-through">
                      ${course.price.previous}
                    </span>
                  ) : null}
                  <span className="text-lg text-[#6440fb]">${course.price.current}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`absolute z-20 w-[360px] max-w-[calc(100vw-48px)] rounded-3xl border border-[#e5e7fb] bg-white p-6 shadow-[0_32px_80px_rgba(12,10,78,0.16)] transition duration-200 ease-out ${positionClass} ${transformClass} ${panelVisibilityClass}`}
      >
        {course.badges?.length ? (
          <div className="mb-3 flex flex-wrap gap-2">
            {course.badges.map((badge) => (
              <span
                key={`detail-${badge.label}`}
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                  badge.variant === 'accent' ? 'bg-[#6440fb] text-white' : 'bg-[#50f0a9] text-[#10213a]'
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
            {course.lessons} lesson{course.lessons > 1 ? 's' : ''}
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
            <li key={`highlight-${highlight}`} className="flex items-start gap-2">
              <LuCircleCheck className="mt-[2px] text-[#50f0a9]" size={18} />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xl font-semibold text-[#6440fb]">
            {course.price.isFree ? 'Free' : `$${course.price.current}`}
          </span>
          <div className="flex items-center gap-3">
            {course.ctaHref ? (
              <a
                href={course.ctaHref}
                className="inline-flex items-center rounded-full bg-[#6440fb] px-5 py-2 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(100,64,251,0.35)] transition hover:bg-[#5530ff]"
              >
                {course.ctaLabel}
              </a>
            ) : (
              <button
                type="button"
                className="inline-flex items-center rounded-full bg-[#6440fb] px-5 py-2 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(100,64,251,0.35)] transition hover:bg-[#5530ff]"
              >
                {course.ctaLabel}
              </button>
            )}
            <button
              type="button"
              aria-label="Save course"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e7fb] text-[#6440fb] transition hover:border-[#6440fb]"
            >
              <LuBookmark size={20} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function Pagination() {
  return (
    <nav className="flex items-center justify-center gap-3 pt-6" aria-label="Courses pagination">
      <button className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9d7f0] text-[#433f74] transition hover:border-[#6440fb] hover:text-[#6440fb]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      {[1, 2, 3, 4].map((page) => (
        <button
          key={page}
          className={`flex h-11 w-11 items-center justify-center rounded-full border text-sm font-semibold transition ${
            page === 1
              ? 'border-[#6440fb] bg-[#6440fb] text-white shadow-[0_12px_30px_rgba(100,64,251,0.35)]'
              : 'border-transparent text-[#433f74] hover:border-[#6440fb] hover:text-[#6440fb]'
          }`}
        >
          {page}
        </button>
      ))}
      <button className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9d7f0] text-[#433f74] transition hover:border-[#6440fb] hover:text-[#6440fb]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </nav>
  );
}
