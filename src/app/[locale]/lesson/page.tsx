import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LessonPageClient } from '@/components/Lesson/LessonPageClient';
import SidebarToggleButton from '@/components/Lesson/SidebarToggleButton';

// Mock data - replace with actual API calls
// Section titles will be populated from translations in the page component
const COURSE_SECTIONS_TEMPLATE = [
    {
      id: 1,
      titleKey: 'sections.courseContent',
      lectures: 6,
      duration: '87 min',
      lessons: [
        { id: 1, title: 'Introduction to the User', duration: '03:56', completed: true },
        { id: 2, title: 'Getting started with your', duration: '03:56', completed: true },
        { id: 3, title: 'What is UI vs UX - User Interface vs User Experience', duration: '03:56', completed: false },
        { id: 4, title: 'Wireframing (low fidelity) in', duration: '03:56', completed: false },
        { id: 5, title: 'Viewing your prototype on', duration: '03:56', completed: false },
        { id: 6, title: 'Sharing your design', duration: '03:56', completed: false }
      ]
    },
    {
      id: 2,
      titleKey: 'sections.theBrief',
      lectures: 6,
      duration: '87 min',
      lessons: [
        { id: 7, title: 'Introduction to the User', duration: '03:56', completed: false },
        { id: 8, title: 'Getting started with your', duration: '03:56', completed: false },
        { id: 9, title: 'What is UI vs UX', duration: '03:56', completed: false },
        { id: 10, title: 'Wireframing basics', duration: '03:56', completed: false }
      ]
    },
    {
      id: 3,
      titleKey: 'sections.typeColorIcon',
      lectures: 6,
      duration: '87 min',
      lessons: [
        { id: 11, title: 'Typography fundamentals', duration: '03:56', completed: false },
        { id: 12, title: 'Color theory basics', duration: '03:56', completed: false },
        { id: 13, title: 'Icon design principles', duration: '03:56', completed: false }
      ]
    }
];

const COURSE_DATA = {
  title: 'The Ultimate Drawing Course',
  subtitle: 'Beginner to Advanced',
  videoId: 'LlCwHnp3kL4',
  thumbnailUrl: '/coursesImages/4.png',
  totalLessons: 27,
  totalDuration: '13h',
  enrolledCount: 853,
  description: "This course is aimed at people interested in UI/UX Design. We'll start from the very beginning and work all the way through, step by step. If you already have some UI/UX Design experience but want to get up to speed using Adobe XD, then this course is perfect for you too!",
  additionalDescription: "First, we will go over the differences between UX and UI Design. We will look at what our brief for this real-world project is then we will learn about low-fidelity wireframes and how to make use of existing UI design kits.",
  whatYouLearn: [
    'Become a UX designer.',
    'You will be able to add UX design to your CV',
    'Become a UI designer.',
    'Build & test a full website design.',
    'Create your first UI kit & icon persona.',
    'How to use personas UX.',
    'Create quick wireframes.',
    'Downloadable exercise files',
    'Build a UX project from beginning to end.',
    'Learn to design websites & mobile phone apps.',
    'All the techniques used by UX professionals',
    'You will be able to talk correctly with other UX design.'
  ],
  requirements: [
    'You will need a copy of Adobe XD 2019 or above. A free trial can be downloaded from Adobe.',
    'No previous design experience is needed.',
    'No previous Adobe XD skills are needed.'
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
