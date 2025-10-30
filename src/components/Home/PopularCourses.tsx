'use client';

import Link from 'next/link';
import {useMemo, useState} from 'react';
import {FaStar} from 'react-icons/fa';
import {LuCirclePlay, LuClock3, LuTrendingUp} from 'react-icons/lu';
import {useTranslations, useLocale} from 'next-intl';

const CATEGORY_OPTIONS = [
  'All Categories',
  'Animation',
  'Design',
  'Development',
  'Photography',
  'Art',
  'Programming',
  'Writing'
] as const;

type CourseCategory = (typeof CATEGORY_OPTIONS)[number];

type Course = {
  id: number;
  title: string;
  category: Exclude<CourseCategory, 'All Categories'>;
  image: string;
  imageAlt: string;
  rating: number;
  ratingCount: number;
  lessonCount: number;
  durationMinutes: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  author: {
    name: string;
    avatar: string;
  };
  price: {
    original: number;
    discounted: number;
    isFree?: boolean;
  };
  href?: string;
  badges?: {
    label: string;
    variant: 'accent' | 'success';
  }[];
};

const POPULAR_COURSES: Course[] = [
  {
    id: 1,
    title: 'Learn Figma – UI/UX Design Essential Training',
    category: 'Design',
    image: 'https://educrat-react.vercel.app/assets/img/coursesCards/1.png',
    imageAlt: 'Students collaborating on a UI design project',
    rating: 4.3,
    ratingCount: 1891,
    lessonCount: 6,
    durationMinutes: 132,
    level: 'Beginner',
    author: {
      name: 'Jane Cooper',
      avatar: 'https://educrat-react.vercel.app/assets/img/general/avatar-1.png'
    },
    price: {original: 199, discounted: 79}
  },
  {
    id: 2,
    title: 'Complete Python Bootcamp From Zero to Hero in Python',
    category: 'Programming',
    image: 'https://educrat-react.vercel.app/assets/img/coursesCards/2.png',
    imageAlt: 'Instructor teaching a Python course online',
    rating: 4.7,
    ratingCount: 2891,
    lessonCount: 6,
    durationMinutes: 410,
    level: 'Expert',
    author: {
      name: 'Jenny Wilson',
      avatar: 'https://educrat-react.vercel.app/assets/img/general/avatar-2.png'
    },
    price: {original: 189, discounted: 89},
    badges: [
      {label: 'Popular', variant: 'accent'},
      {label: 'Best Sellers', variant: 'success'}
    ]
  },
  {
    id: 3,
    title: 'Angular – The Complete Guide (2022 Edition)',
    category: 'Programming',
    image: 'https://educrat-react.vercel.app/assets/img/coursesCards/3.png',
    imageAlt: 'Angular developer working on a laptop',
    rating: 4.6,
    ratingCount: 1983,
    lessonCount: 6,
    durationMinutes: 220,
    level: 'Intermediate',
    author: {
      name: 'Albert Flores',
      avatar: 'https://educrat-react.vercel.app/assets/img/general/avatar-3.png'
    },
    price: {original: 249, discounted: 129}
  },
  {
    id: 4,
    title: 'The Ultimate Drawing Course Beginner to Advanced',
    category: 'Art',
    image: 'https://educrat-react.vercel.app/assets/img/coursesCards/4.png',
    imageAlt: 'Artist practicing drawing techniques',
    rating: 4.2,
    ratingCount: 1981,
    lessonCount: 6,
    durationMinutes: 430,
    level: 'Expert',
    author: {
      name: 'Jacob Jones',
      avatar: 'https://educrat-react.vercel.app/assets/img/general/avatar-4.png'
    },
    price: {original: 179, discounted: 99}
  },
  {
    id: 5,
    title: 'Photography Masterclass: Complete Guide to Photography',
    category: 'Photography',
    image: 'https://educrat-react.vercel.app/assets/img/coursesCards/5.png',
    imageAlt: 'Photographer capturing a portrait in a studio',
    rating: 4.5,
    ratingCount: 1570,
    lessonCount: 8,
    durationMinutes: 515,
    level: 'Intermediate',
    author: {
      name: 'Theresa Webb',
      avatar: 'https://educrat-react.vercel.app/assets/img/general/avatar-5.png'
    },
    price: {original: 219, discounted: 129}
  },
  {
    id: 6,
    title: 'Animation Fundamentals: Bring Characters to Life',
    category: 'Animation',
    image: 'https://educrat-react.vercel.app/assets/img/coursesCards/6.png',
    imageAlt: 'Animator working on character designs',
    rating: 4.4,
    ratingCount: 1250,
    lessonCount: 5,
    durationMinutes: 360,
    level: 'Intermediate',
    author: {
      name: 'Courtney Henry',
      avatar: 'https://educrat-react.vercel.app/assets/img/general/avatar-6.png'
    },
    price: {original: 199, discounted: 119}
  },
  {
    id: 7,
    title: 'Modern Web Development: Build Responsive Experiences',
    category: 'Development',
    image: 'https://educrat-react.vercel.app/assets/img/coursesCards/7.png',
    imageAlt: 'Developer coding a modern web application',
    rating: 4.8,
    ratingCount: 2235,
    lessonCount: 9,
    durationMinutes: 580,
    level: 'Advanced',
    author: {
      name: 'Guy Hawkins',
      avatar: 'https://educrat-react.vercel.app/assets/img/general/avatar-7.png'
    },
    price: {original: 229, discounted: 139}
  },
  {
    id: 8,
    title: 'Creative Writing Mastery: Craft Compelling Stories',
    category: 'Writing',
    image: 'https://educrat-react.vercel.app/assets/img/coursesCards/8.png',
    imageAlt: 'Writer drafting a story on a laptop',
    rating: 4.1,
    ratingCount: 980,
    lessonCount: 7,
    durationMinutes: 300,
    level: 'Beginner',
    author: {
      name: 'Savannah Nguyen',
      avatar: 'https://educrat-react.vercel.app/assets/img/general/avatar-8.png'
    },
    price: {original: 149, discounted: 79}
  }
];

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins.toString().padStart(2, '0')}m`;
};

const PopularCourses = () => {
  const t = useTranslations('popularCourses');
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState<CourseCategory>('All Categories');

  const filteredCourses = useMemo(() => {
    if (activeCategory === 'All Categories') {
      return POPULAR_COURSES;
    }

    return POPULAR_COURSES.filter((course) => course.category === activeCategory);
  }, [activeCategory]);

  const categoryMap: Record<CourseCategory, string> = {
    'All Categories': t('categories.all'),
    'Animation': t('categories.animation'),
    'Design': t('categories.design'),
    'Development': t('categories.development'),
    'Photography': t('categories.photography'),
    'Art': t('categories.art'),
    'Programming': t('categories.programming'),
    'Writing': t('categories.writing')
  };

  return (
    <section className="w-full bg-white py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-[28px] sm:text-[32px] md:text-[36px] font-semibold leading-tight text-[#221f3d]">
            {t('title')}
          </h2>
          <p className="mt-3 text-sm sm:text-base md:text-lg text-[#6f7289]">
            {t('subtitle')}
          </p>
        </div>

        <div className="mt-8 sm:mt-10 md:mt-12 flex flex-wrap justify-center gap-2">
          {CATEGORY_OPTIONS.map((category) => {
            const isActive = category === activeCategory;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-lg border border-transparent px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'border-[#6440fb] bg-[#6440fb] text-white shadow-[0_20px_40px_rgba(100,64,251,0.25)]'
                    : 'border-[#e6e7f2] bg-white text-[#6f7289] hover:border-[#6440fb] hover:text-[#1f1c3a]'
                }`}
              >
                {categoryMap[category]}
              </button>
            );
          })}
        </div>

        <div className="mt-16 grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
          {filteredCourses.map((course) => (
            <article
              key={course.id}
              className="flex h-full flex-col overflow-hidden rounded-xl border border-[#e6e7f2] bg-white transition-all duration-300 hover:-translate-y-[6px] hover:shadow-[0_25px_55px_rgba(32,36,69,0.12)]"
            >
              <div className="relative h-[220px] w-full overflow-hidden">
                <img
                  src={course.image}
                  alt={course.imageAlt}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />

                {course.badges && (
                  <div className="absolute left-4 right-4 top-4 flex items-center gap-3">
                    {course.badges.map((badge) => (
                      <span
                        key={badge.label}
                        className={`rounded-full px-[14px] py-[6px] text-[11px] font-semibold uppercase tracking-[1.2px] ${
                          badge.variant === 'accent'
                            ? 'bg-[#6440fb] text-white'
                            : 'bg-[#22c55e] text-[#10254d]'
                        }`}
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col px-6 pb-7 pt-6">
                <div className="flex items-center gap-2 text-sm font-medium text-[#f7b347]">
                  <span className="flex items-center gap-1 text-[15px] text-[#f58634]">
                    {course.rating.toFixed(1)}
                    <FaStar className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-normal text-[#8b8fad]">
                    ({course.ratingCount.toLocaleString()})
                  </span>
                </div>

                <h3 className="mt-4 text-[18px] font-semibold leading-[1.35] text-[#221f3d]">
                  <Link
                    href={course.href ?? '#'}
                    className="block max-w-full overflow-hidden text-ellipsis transition-colors hover:text-[#6440fb]"
                    style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}
                    title={course.title}
                  >
                    {course.title}
                  </Link>
                </h3>

                <dl className="mt-5 flex flex-wrap gap-x-2 text-[13px] text-[#6f7289]">
                  <div className="flex items-center gap-2">
                    <LuCirclePlay className="h-4 w-4 text-[#6440fb]" />
                    <dt className="sr-only">Lessons</dt>
                    <dd>{course.lessonCount} lesson</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <LuClock3 className="h-4 w-4 text-[#6440fb]" />
                    <dt className="sr-only">Duration</dt>
                    <dd>{formatDuration(course.durationMinutes)}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <LuTrendingUp className="h-4 w-4 text-[#6440fb]" />
                    <dt className="sr-only">Level</dt>
                    <dd>{course.level}</dd>
                  </div>
                </dl>

                <div className=" flex items-center justify-between pt-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={course.author.avatar}
                      alt={course.author.name}
                      className="h-11 w-11 rounded-full object-cover"
                      loading="lazy"
                    />
                    <span className="text-sm font-semibold text-[#221f3d]">{course.author.name}</span>
                  </div>

                  <div className="text-right">
                    {course.price.isFree ? (
                      <span className="text-lg font-semibold text-[#22c55e]">Free</span>
                    ) : (
                      <>
                        <span className="block text-[13px] text-[#8b8fad] line-through">
                          ${course.price.original}
                        </span>
                        <span className="text-lg font-semibold text-[#221f3d]">
                          ${course.price.discounted}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCourses;