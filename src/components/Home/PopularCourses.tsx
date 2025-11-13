'use client';

import Link from 'next/link';
import Image from 'next/image';
import {useMemo, useState, memo} from 'react';
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

type CourseConfig = {
  id: number;
  translationIndex: number;
  category: Exclude<CourseCategory, 'All Categories'>;
  image: string;
  imageAltFallback: string;
  fallbackTitle: string;
  rating: number;
  ratingCount: number;
  lessonCount: number;
  durationMinutes: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  authorKey: string;
  authorFallback: string;
  authorAvatar: string;
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

const POPULAR_COURSES: CourseConfig[] = [
  {
    id: 1,
    translationIndex: 0,
    category: 'Design',
    image: '/coursesImages/1.jpg',
    imageAltFallback: 'Close-up of a creator applying shimmering skincare to glowing skin',
    fallbackTitle: 'Radiant Skin Rituals for Creators',
    rating: 4.3,
    ratingCount: 1891,
    lessonCount: 6,
    durationMinutes: 132,
    level: 'Beginner',
    authorKey: 'janeCooper',
    authorFallback: 'Jane Cooper',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: {original: 199, discounted: 79}
  },
  {
    id: 2,
    translationIndex: 1,
    category: 'Programming',
    image: '/coursesImages/2.jpg',
    imageAltFallback: 'Gamer livestreaming a session with a controller and laptop setup',
    fallbackTitle: 'Game Streaming Studio Secrets',
    rating: 4.7,
    ratingCount: 2891,
    lessonCount: 6,
    durationMinutes: 410,
    level: 'Expert',
    authorKey: 'jennyWilson',
    authorFallback: 'Jenny Wilson',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: {original: 189, discounted: 89},
    badges: [
      {label: 'Popular', variant: 'accent'},
      {label: 'Best Sellers', variant: 'success'}
    ]
  },
  {
    id: 3,
    translationIndex: 2,
    category: 'Programming',
    image: '/coursesImages/3.jpg',
    imageAltFallback: 'Creator sketching design concepts on a digital tablet',
    fallbackTitle: 'Designing Immersive Creator Spaces',
    rating: 4.6,
    ratingCount: 1983,
    lessonCount: 6,
    durationMinutes: 220,
    level: 'Intermediate',
    authorKey: 'albertFlores',
    authorFallback: 'Albert Flores',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: {original: 249, discounted: 129}
  },
  {
    id: 4,
    translationIndex: 3,
    category: 'Art',
    image: '/coursesImages/4.jpg',
    imageAltFallback: 'Creator applying professional makeup with a soft brush near the eye',
    fallbackTitle: 'Camera-Ready Makeup Masterclass',
    rating: 4.2,
    ratingCount: 1981,
    lessonCount: 6,
    durationMinutes: 430,
    level: 'Expert',
    authorKey: 'jacobJones',
    authorFallback: 'Jacob Jones',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: {original: 179, discounted: 99}
  },
  {
    id: 5,
    translationIndex: 4,
    category: 'Photography',
    image: '/coursesImages/5.jpg',
    imageAltFallback: 'Creator organizing social media apps on a transparent interface',
    fallbackTitle: 'Building Social Media Communities',
    rating: 4.5,
    ratingCount: 1570,
    lessonCount: 8,
    durationMinutes: 515,
    level: 'Intermediate',
    authorKey: 'theresaWebb',
    authorFallback: 'Theresa Webb',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: {original: 219, discounted: 129}
  },
  {
    id: 6,
    translationIndex: 5,
    category: 'Animation',
    image: '/coursesImages/6.jpg',
    imageAltFallback: 'Creator relaxing on a sofa with a warm drink for a mindful break',
    fallbackTitle: 'Mindful Breaks for Creator Wellbeing',
    rating: 4.4,
    ratingCount: 1250,
    lessonCount: 5,
    durationMinutes: 360,
    level: 'Intermediate',
    authorKey: 'courtneyHenry',
    authorFallback: 'Courtney Henry',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: {original: 199, discounted: 119}
  },
  {
    id: 7,
    translationIndex: 6,
    category: 'Development',
    image: '/coursesImages/7.jpg',
    imageAltFallback: 'Hair stylist perfecting a creator’s hairstyle in a studio',
    fallbackTitle: 'Signature Hairstyles for the Camera',
    rating: 4.8,
    ratingCount: 2235,
    lessonCount: 9,
    durationMinutes: 580,
    level: 'Advanced',
    authorKey: 'guyHawkins',
    authorFallback: 'Guy Hawkins',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: {original: 229, discounted: 139}
  },
  {
    id: 8,
    translationIndex: 7,
    category: 'Writing',
    image: '/coursesImages/8.jpg',
    imageAltFallback: 'Streamer celebrating a gaming victory while wearing a headset',
    fallbackTitle: 'Interactive Gaming Sessions with Followers',
    rating: 4.1,
    ratingCount: 980,
    lessonCount: 7,
    durationMinutes: 300,
    level: 'Beginner',
    authorKey: 'savannahNguyen',
    authorFallback: 'Savannah Nguyen',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: {original: 149, discounted: 79}
  }
];

const formatDuration = (minutes: number, locale: string) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const hourFormatter = new Intl.NumberFormat(locale, {minimumIntegerDigits: 1});
  const minuteFormatter = new Intl.NumberFormat(locale, {minimumIntegerDigits: 2});
  const hoursLabel = locale.startsWith('ar') ? 'س' : 'h';
  const minutesLabel = locale.startsWith('ar') ? 'د' : 'm';

  return `${hourFormatter.format(hours)}${hoursLabel} ${minuteFormatter.format(mins)}${minutesLabel}`;
};

// Memoized Course Card Component
type CourseTranslation = {
  title?: string;
  imageAlt?: string;
};

const CourseCard = memo(
  ({
    course,
    t,
    translation,
    authorName,
    locale
  }: {
    course: CourseConfig;
    t: any;
    translation: CourseTranslation;
    authorName: string;
    locale: string;
  }) => (
  <article
    className="flex h-full flex-col overflow-hidden rounded-xl border border-[#e6e7f2] bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_25px_55px_rgba(32,36,69,0.12)]"
  >
    <div className="relative h-[220px] w-full overflow-hidden">
      <Image
        src={course.image}
        alt={translation.imageAlt ?? course.imageAltFallback}
        fill
        className="object-cover transition-transform duration-300 hover:scale-105"
        loading="lazy"
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
      />

      {course.badges && (
        <div className="absolute left-4 right-4 top-4 flex items-center gap-3">
          {course.badges.map((badge) => (
            <span
              key={badge.label}
              className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[1.2px] ${
                badge.variant === 'accent'
                  ? 'bg-primary text-white'
                  : 'bg-white text-primary'
              }`}
            >
              {badge.label === 'Popular' ? t('courseCard.badges.popular') : t('courseCard.badges.bestSellers')}
            </span>
          ))}
        </div>
      )}
    </div>

    <div className="flex flex-1 flex-col px-6 pb-7 pt-6">
      <div className="flex items-center gap-2 text-sm font-medium text-[#f7b347]">
        <span className="flex items-center gap-1 text-[15px] text-primary">
          {new Intl.NumberFormat(locale, {minimumFractionDigits: 1, maximumFractionDigits: 1}).format(course.rating)}
          <FaStar className="h-4 w-4" />
        </span>
        <span className="text-xs font-normal text-[#8b8fad]">
          ({course.ratingCount.toLocaleString(locale)})
        </span>
      </div>

      <h3 className="mt-4 text-[18px] font-semibold leading-[1.35] text-[#221f3d]">
        <Link
          href={course.href ?? '#'}
          className="block max-w-full overflow-hidden text-ellipsis transition-colors hover:text-primary"
          style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}
          title={translation.title ?? course.fallbackTitle}
        >
          {translation.title ?? course.fallbackTitle}
        </Link>
      </h3>

      <dl className="mt-5 flex flex-wrap gap-x-1 text-[12px] text-[#6f7289]">
        <div className="flex items-center gap-2">
          <LuCirclePlay className="h-4 w-3 text-primary" />
          <dt className="sr-only">Courses</dt>
          <dd>
            {new Intl.NumberFormat(locale).format(course.lessonCount)} {t('courseCard.lessons')}
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <LuClock3 className="h-4 w-3 text-primary" />
          <dt className="sr-only">{t('courseCard.duration')}</dt>
          <dd>{formatDuration(course.durationMinutes, locale)}</dd>
        </div>
        <div className="flex items-center gap-2">
          <LuTrendingUp className="h-4 w-5 text-primary" />
          <dt className="sr-only">{t('courseCard.levelLabel')}</dt>
          <dd>{t(`courseCard.level.${course.level.toLowerCase()}` as any)}</dd>
        </div>
      </dl>

      <div className="flex items-center justify-between pt-6">
        <div className="flex items-center gap-3">
          <Image
            src={course.authorAvatar}
            alt={authorName}
            width={44}
            height={44}
            className="rounded-full object-cover"
            loading="lazy"
            style={{ width: 'auto', height: 'auto' }}
          />
          <span className="text-sm font-semibold text-[#221f3d]">{authorName}</span>
        </div>

        <div className="text-right">
          {course.price.isFree ? (
            <span className="text-lg font-semibold text-primary">{t('courseCard.price.free')}</span>
          ) : (
            <>
              <span className="block text-[13px] text-[#8b8fad] line-through">
                ${new Intl.NumberFormat(locale).format(course.price.original)}
              </span>
              <span className="text-lg font-semibold text-[#221f3d]">
                ${new Intl.NumberFormat(locale).format(course.price.discounted)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  </article>
  )
);

CourseCard.displayName = 'CourseCard';

const PopularCourses = () => {
  const t = useTranslations('popularCourses');
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState<CourseCategory>('All Categories');

  const courseTranslations = useMemo(() => {
    const raw = t.raw('courses');
    if (Array.isArray(raw)) {
      return raw as CourseTranslation[];
    }
    return [] as CourseTranslation[];
  }, [t]);

  const authorTranslations = useMemo(() => {
    const raw = t.raw('authors');
    if (raw && typeof raw === 'object') {
      return raw as Record<string, string>;
    }
    return {} as Record<string, string>;
  }, [t]);

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
                    ? 'border-primary bg-primary text-white shadow-[0_20px_40px_rgba(10,186,181,0.25)]'
                    : 'border-[#e6e7f2] bg-white text-[#6f7289] hover:border-primary hover:text-[#1f1c3a]'
                }`}
              >
                {categoryMap[category]}
              </button>
            );
          })}
        </div>

        <div className="mt-16 grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
          {filteredCourses.map((course) => {
            const translation = courseTranslations[course.translationIndex] ?? {};
            const authorName = authorTranslations[course.authorKey] ?? course.authorFallback;

            return (
              <CourseCard
                key={course.id}
                course={course}
                t={t}
                translation={translation}
                authorName={authorName}
                locale={locale}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PopularCourses;