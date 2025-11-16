import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LessonPageClient } from '@/components/Lesson/LessonPageClient';
import SidebarToggleButton from '@/components/Lesson/SidebarToggleButton';

// Mock data - replace with actual API calls
// Section titles will be populated from translations in the page component
const COURSE_SECTIONS_TEMPLATE = [
    {
      id: 1,
      titleKey: 'sections.proPlaythroughs',
      lectures: 5,
      duration: '65 min',
      lessons: [
        { id: 1, title: 'Creator warm-up & aim labs', duration: '07:42', completed: true },
        { id: 2, title: 'Shot-calling fundamentals', duration: '08:19', completed: true },
        { id: 3, title: 'Meta breakdown: current ranked season', duration: '12:33', completed: false },
        { id: 4, title: 'Tempo control & mid-match pivots', duration: '18:05', completed: false },
        { id: 5, title: 'Clutch montage storytelling', duration: '19:21', completed: false }
      ]
    },
    {
      id: 2,
      titleKey: 'sections.strategyLabs',
      lectures: 5,
      duration: '58 min',
      lessons: [
        { id: 6, title: 'VOD review: converting viewers to subs', duration: '09:47', completed: false },
        { id: 7, title: 'Building hype segments with your mods', duration: '06:58', completed: false },
        { id: 8, title: 'Sponsorship overlays that click', duration: '11:36', completed: false },
        { id: 9, title: 'Discord events & raid choreography', duration: '13:22', completed: false },
        { id: 10, title: 'Analytics lab: measuring retention spikes', duration: '16:01', completed: false }
      ]
    },
    {
      id: 3,
      titleKey: 'sections.creatorOps',
      lectures: 5,
      duration: '72 min',
      lessons: [
        { id: 11, title: 'Gear audit: controllers, cams & capture', duration: '14:12', completed: false },
        { id: 12, title: 'Sound design for immersive sessions', duration: '13:40', completed: false },
        { id: 13, title: 'Publishing premium drops on schedule', duration: '12:55', completed: false },
        { id: 14, title: 'Community tiers & monetization paths', duration: '17:03', completed: false },
        { id: 15, title: 'Archive workflow for content libraries', duration: '14:51', completed: false }
      ]
    }
];

const COURSE_DATA = {
  title: 'Creator Royale: Premium Gaming Vault',
  subtitle: 'Elite drops for streaming legends',
  videoId: 'uL6O_0G-U48',
  thumbnailUrl: '/coursesImages/2.jpg',
  totalLessons: 15,
  totalDuration: '9h',
  enrolledCount: 18450,
  description: "Level up your entire streaming ecosystem with exclusive playthroughs, strategy deep-dives, and production workflows crafted for gaming creators.",
  additionalDescription: "Every session is recorded live with our coaching squad, then remastered with chapter markers, downloadables, and action checklists so you can deploy faster on stream.",
  whatYouLearn: [
    'Design warm-up routes that keep mechanics sharp before you go live.',
    'Decode meta shifts faster with pro scouting frameworks.',
    'Script cliffhanger moments that spike chat engagement.',
    'Automate highlight clips for shorts, reels, and VOD recaps.',
    'Build sponsorship overlays that integrate naturally.',
    'Plan weeklong event arcs with your mod squad.',
    'Optimize audio, lighting, and camera rigs for marathon sessions.',
    'Launch tiered membership perks without overwhelming your workflow.',
    'Run live analytics reviews with your community.',
    'Master raid etiquette that grows allied creator circles.',
    'Document post-match debriefs the audience can binge.',
    'Package premium drops into evergreen content libraries.'
  ],
  requirements: [
    'Stable internet connection capable of HD streaming.',
    'PC or console with capture setup and dual monitors recommended.',
    'Gaming headset with noise-cancelling microphone.'
  ]
};

interface LessonPageProps {
  params: Promise<{
    locale: string;
    lesson: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('lessonPage');

  // Translate section titles
  const COURSE_SECTIONS = COURSE_SECTIONS_TEMPLATE.map(section => ({
    ...section,
    title: t(section.titleKey as any)
  }));

  return (
    <>
      {/* Mobile sidebar toggle button lives at page level so it remains visible while scrolling */}
      <SidebarToggleButton />
      <LessonPageClient
        courseData={COURSE_DATA}
        sections={COURSE_SECTIONS}
        locale={locale}
      />
    </>
  );
}
