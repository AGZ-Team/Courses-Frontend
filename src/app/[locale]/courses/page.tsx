import { HeaderSection } from '@/components/Courses/HeaderSection';
import { CoursesClient } from '@/components/Courses/CoursesClient';
import type { CourseCard } from '@/components/Courses/CourseCard';
import type { FilterGroup } from '@/components/Courses/CoursesClient';
import type { RatingFilter } from '@/components/Courses/RatingList';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic';

type CoursesMetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: CoursesMetadataProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.courses' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

const COURSES: CourseCard[] = [
  {
    id: 1,
    title: 'Radiant Skin Rituals for Creators',
    image: '/coursesImages/1.jpg',
    rating: 4.3,
    ratingCount: 1991,
    lessons: 6,
    durationMinutes: 320,
    level: 'Beginner',
    author: 'Jane Cooper',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: { previous: 199, current: 79 },
    badges: [{ label: 'Popular', variant: 'accent' }],
    summary:
      'Glow up on camera with skincare creators who share daily rituals, ingredient deep dives, and content-ready routines.',
    highlights: [
      'Build morning and evening glow routines',
      'Choose products that pop under studio lights',
      'Shoot soothing ASMR-style skincare reels'
    ],
    ctaLabel: 'Add to Cart'
  },
  {
    id: 2,
    title: 'Game Streaming Studio Secrets',
    image: '/coursesImages/2.jpg',
    rating: 4.7,
    ratingCount: 2891,
    lessons: 8,
    durationMinutes: 410,
    level: 'Expert',
    author: 'Jenny Wilson',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: { previous: 189, current: 89 },
    badges: [
      { label: 'Popular', variant: 'accent' },
      { label: 'Best Sellers', variant: 'success' }
    ],
    summary:
      'Transform your gaming space into a pro studio, from gear selection to stream engagement strategies.',
    highlights: [
      'Optimize lighting and camera angles for streams',
      'Design overlays followers instantly recognize',
      'Monetize live sessions with interactive goals'
    ],
    ctaLabel: 'Add to Cart'
  },
  {
    id: 3,
    title: 'Designing Immersive Creator Spaces',
    image: '/coursesImages/3.jpg',
    rating: 4.5,
    ratingCount: 1983,
    lessons: 6,
    durationMinutes: 420,
    level: 'Intermediate',
    author: 'Albert Flores',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: { previous: 249, current: 129 },
    summary:
      'Craft set designs, mood boards, and lighting plans that make every frame scroll-stopping.',
    highlights: [
      'Style creator desks for multiple camera angles',
      'Blend physical props with digital overlays',
      'Plan color palettes that reinforce your brand'
    ],
    ctaLabel: 'Add to Cart'
  },
  {
    id: 4,
    title: 'Camera-Ready Makeup Masterclass',
    image: '/coursesImages/4.jpg',
    rating: 4.2,
    ratingCount: 1981,
    lessons: 7,
    durationMinutes: 430,
    level: 'Expert',
    author: 'Jacob Jones',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: { previous: 179, current: 99 },
    badges: [{ label: 'Best Sellers', variant: 'success' }],
    summary:
      'Blend tutorials and live demos to teach camera-proof makeup that keeps audiences watching.',
    highlights: [
      'Prep skin for long filming sessions',
      'Switch looks fast between segments',
      'Use lighting tricks to enhance pigments'
    ],
    ctaLabel: 'Enroll Now'
  },
  {
    id: 5,
    title: 'Building Social Media Communities',
    image: '/coursesImages/5.jpg',
    rating: 4.6,
    ratingCount: 1730,
    lessons: 5,
    durationMinutes: 360,
    level: 'Advanced',
    author: 'Courtney Henry',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: { previous: 219, current: 109 },
    summary:
      'Grow loyal followers across platforms with authentic storytelling, analytics, and collaborations.',
    highlights: [
      'Map content pillars for consistent posting',
      'Automate reporting to track real engagement',
      'Co-create with ambassadors and superfans'
    ],
    ctaLabel: 'Add to Cart'
  },
  {
    id: 6,
    title: 'Mindful Breaks for Creator Wellbeing',
    image: '/coursesImages/6.jpg',
    rating: 4.8,
    ratingCount: 2310,
    lessons: 9,
    durationMinutes: 480,
    level: 'Advanced',
    author: 'Guy Hawkins',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: { previous: 229, current: 139 },
    summary:
      'Protect your creative energy with guided breathwork, stretch sessions, and restorative rituals.',
    highlights: [
      'Schedule micro-breaks that prevent burnout',
      'Host calming live check-ins with followers',
      'Build a mindfulness library for members'
    ],
    ctaLabel: 'Add to Cart'
  },
  {
    id: 7,
    title: 'Signature Hairstyles for the Camera',
    image: '/coursesImages/7.jpg',
    rating: 4.4,
    ratingCount: 1570,
    lessons: 8,
    durationMinutes: 515,
    level: 'Intermediate',
    author: 'Theresa Webb',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: { previous: 219, current: 129 },
    summary:
      'Style hair that holds up under studio lights, weather changes, and rapid-fire shoots.',
    highlights: [
      'Match hairstyles to brand archetypes',
      'Demonstrate quick refresh hacks on live video',
      'Prepare kit bags for travel shoots'
    ],
    ctaLabel: 'Add to Cart'
  },
  {
    id: 8,
    title: 'Interactive Gaming Sessions with Followers',
    image: '/coursesImages/8.jpg',
    rating: 4.4,
    ratingCount: 1250,
    lessons: 5,
    durationMinutes: 360,
    level: 'Intermediate',
    author: 'Courtney Henry',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: { previous: 199, current: 119 },
    summary:
      'Host collaborative game nights that turn casual viewers into a thriving supporter community.',
    highlights: [
      'Run polls and challenges between matches',
      'Feature follower spotlights on stream',
      'Package VOD highlights for socials'
    ],
    ctaLabel: 'Enroll Now'
  },
  {
    id: 9,
    title: 'Creator Strength Lab: Training & Gym Systems',
    image: '/coursesImages/9.jpg',
    rating: 4.1,
    ratingCount: 980,
    lessons: 6,
    durationMinutes: 300,
    level: 'Intermediate',
    author: 'Esther Howard',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: { previous: 199, current: 109 },
    summary:
      'Blend strength training templates with content ideas that keep your fitness community energized.',
    highlights: [
      'Program effective weekly gym routines',
      'Film form checks and accountability clips',
      'Launch challenge calendars for members'
    ],
    ctaLabel: 'Add to Cart'
  },
  {
    id: 10,
    title: 'Storytelling Blueprints for Creators',
    image: '/coursesImages/10.jpg',
    rating: 4.6,
    ratingCount: 1675,
    lessons: 7,
    durationMinutes: 390,
    level: 'Advanced',
    author: 'Devon Lane',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: { previous: 239, current: 139 },
    summary:
      'Plan hooks, arcs, and cliffhangers that turn casual viewers into binge-watchers across formats.',
    highlights: [
      'Map hero journeys for short and long form',
      'Script interactive endings with polls',
      'Batch record narration with crystal clarity'
    ],
    ctaLabel: 'Join the Cohort'
  },
  {
    id: 11,
    title: 'Creator Career Compass: Guidance & Growth',
    image: '/coursesImages/11.jpg',
    rating: 4.9,
    ratingCount: 2450,
    lessons: 6,
    durationMinutes: 340,
    level: 'Advanced',
    author: 'Leslie Alexander',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: { previous: 259, current: 149 },
    summary:
      'Set multi-year creator career plans with revenue streams, networking cadences, and portfolio boosters.',
    highlights: [
      'Diversify income with scalable offers',
      'Pitch brands with data-backed media kits',
      'Plan rest cycles to preserve creativity'
    ],
    ctaLabel: 'Enroll Now'
  },
  {
    id: 12,
    title: 'Arabian Fashion Diaries: Styling Tips',
    image: '/coursesImages/12.jpg',
    rating: 4.7,
    ratingCount: 2120,
    lessons: 9,
    durationMinutes: 500,
    level: 'Advanced',
    author: 'Cameron Williamson',
    authorAvatar: '/coursesImages/avatar-1.png',
    price: { previous: 279, current: 159 },
    summary:
      'Fuse traditional motifs with modern silhouettes and teach followers to style every occasion with confidence.',
    highlights: [
      'Curate capsule wardrobes around abayas and kaftans',
      'Accessorize looks for on-camera impact',
      'Source ethical regional designers to spotlight'
    ],
    ctaLabel: 'Add to Cart'
  }
];

const FILTER_GROUPS: FilterGroup[] = [
  {
    title: 'Category',
    options: [
      { labelKey: 'all', count: 43, type: 'checkbox', isActive: true },
      { labelKey: 'art', count: 4, type: 'checkbox' },
      { labelKey: 'animation', count: 6, type: 'checkbox' },
      { labelKey: 'design', count: 10, type: 'checkbox' },
      { labelKey: 'photography', count: 9, type: 'checkbox' },
      { labelKey: 'programming', count: 7, type: 'checkbox' },
      { labelKey: 'writing', count: 7, type: 'checkbox' }
    ],
    footerLabel: 'Show more'
  },
  {
    title: 'Instructors',
    options: [
      { labelKey: 'all', count: 43, type: 'checkbox', isActive: true },
      { labelKey: 'janeCooper', count: 9, type: 'checkbox' },
      { labelKey: 'jennyWilson', count: 7, type: 'checkbox' },
      { labelKey: 'albertFlores', count: 6, type: 'checkbox' },
      { labelKey: 'jacobJones', count: 6, type: 'checkbox' }
    ],
    footerLabel: 'Show more'
  },
  {
    title: 'Price',
    options: [
      { labelKey: 'all', count: 43, type: 'radio', isActive: true },
      { labelKey: 'free', count: 11, type: 'radio' },
      { labelKey: 'paid', count: 32, type: 'radio' }
    ]
  },
  {
    title: 'Level',
    options: [
      { labelKey: 'all', count: 43, type: 'checkbox', isActive: true },
      { labelKey: 'beginner', count: 12, type: 'checkbox' },
      { labelKey: 'intermediate', count: 14, type: 'checkbox' },
      { labelKey: 'advanced', count: 10, type: 'checkbox' },
      { labelKey: 'expert', count: 7, type: 'checkbox' }
    ]
  },
  {
    title: 'Language',
    options: [
      { labelKey: 'all', count: 43, type: 'checkbox', isActive: true },
      { labelKey: 'english', count: 18, type: 'checkbox' },
      { labelKey: 'spanish', count: 7, type: 'checkbox' },
      { labelKey: 'german', count: 6, type: 'checkbox' },
      { labelKey: 'french', count: 5, type: 'checkbox' }
    ]
  },
  {
    title: 'Duration',
    options: [
      { labelKey: 'all', count: 43, type: 'checkbox', isActive: true },
      { labelKey: 'zeroToOneHour', count: 8, type: 'checkbox' },
      { labelKey: 'oneToThreeHours', count: 14, type: 'checkbox' },
      { labelKey: 'threeToSixHours', count: 11, type: 'checkbox' },
      { labelKey: 'sixPlusHours', count: 10, type: 'checkbox' }
    ]
  }
];

const RATING_FILTERS_KEYS = [
  { labelKey: 'fourPointFive', count: 21, threshold: 4.5 },
  { labelKey: 'fourPointZero', count: 19, threshold: 4 },
  { labelKey: 'threePointFive', count: 3, threshold: 3.5 },
  { labelKey: 'threePointZero', count: 0, threshold: 3 }
];

const SORT_OPTIONS_KEYS = [
  'default',
  'popular',
  'priceLowHigh',
  'priceHighLow',
  'rating'
];

interface CoursesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CoursesPage({ params }: CoursesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('coursesPage');
  
  const ratingFilters: RatingFilter[] = RATING_FILTERS_KEYS.map((item) => ({
    labelKey: item.labelKey,
    count: item.count,
    threshold: item.threshold
  }));

  const sortOptions = SORT_OPTIONS_KEYS;

  return (
    <main className="w-full bg-white pb-24 text-[#1f1c3b]">
      <HeaderSection locale={locale} />
      <CoursesClient
        courses={COURSES}
        filterGroups={FILTER_GROUPS}
        ratingFilters={ratingFilters}
        sortOptions={sortOptions}
      />
    </main>
  );
}
