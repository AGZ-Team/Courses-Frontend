'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { LessonSidebar } from './LessonSidebar';
import { LessonVideo } from './LessonVideo';
import { LessonContent } from './LessonContent';

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed?: boolean;
}
 
interface CourseSection {
  id: number;
  title: string;
  lectures: number;
  duration: string;
  lessons: Lesson[];
}

interface CourseData {
  title: string;
  subtitle: string;
  videoId: string;
  thumbnailUrl: string;
  totalLessons: number;
  totalDuration: string;
  enrolledCount: number;
  description: string;
  additionalDescription: string;
  whatYouLearn: string[];
  requirements: string[];
}

interface LessonPageClientProps {
  courseData: CourseData;
  sections: CourseSection[];
  locale?: string;
}

export function LessonPageClient({ courseData, sections, locale }: LessonPageClientProps) {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(sections[0]?.lessons[0] || null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const t = useTranslations('lessonPage');

  // Listen for page-level toggle events
  useEffect(() => {
    const handler = () => setSidebarOpen((prev) => !prev);
    window.addEventListener('lesson-sidebar-toggle', handler as EventListener);
    return () => window.removeEventListener('lesson-sidebar-toggle', handler as EventListener);
  }, []);

  const handleLessonClick = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  return (
    <div className="flex flex-col h-screen ">
      {/* Main Content Area - Fills remaining height */}
      <div className="flex flex-1 overflow-hidden bg-white">
        {/* Sidebar - Course Content (LEFT SIDE) */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 bg-linear-to-br from-slate-50 to-slate-100 fixed lg:static inset-y-0 left-0 w-full xs:w-64 sm:w-72 md:w-80 lg:w-96 xl:w-[420px] max-w-full bg-white/95 backdrop-blur border-r border-slate-200 shadow-sm overflow-y-auto scrollbar-hide gutter-stable transition-transform duration-300 z-30 lg:z-0`}
        >
          {/* Sidebar header with close button (mobile) */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-3 flex items-center justify-between lg:hidden">
            <span className="text-sm font-medium text-slate-700">Menu</span>
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
              className="inline-flex items-center justify-center h-8 w-8 rounded-md text-slate-600 hover:bg-slate-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <LessonSidebar
            sections={sections}
            currentLesson={currentLesson}
            onLessonClick={handleLessonClick}
            totalLessons={courseData.totalLessons}
            totalDuration={courseData.totalDuration}
            enrolledCount={courseData.enrolledCount}
          />
        </aside>

        {/* Main Content (RIGHT SIDE) */}
        <main className="flex-1 overflow-y-auto gutter-stable w-full">
          <div className="w-full max-w-4xl sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 md:py-10 lg:py-12">
            <LessonVideo
              title={currentLesson?.title || 'Introduction to the User'}
              description={courseData.description}
              videoId={courseData.videoId}
              thumbnailUrl={courseData.thumbnailUrl}
              duration={currentLesson?.duration || '03:56'}
            />
            <LessonContent
              description={courseData.description}
              additionalDescription={courseData.additionalDescription}
              whatYouLearn={courseData.whatYouLearn}
              requirements={courseData.requirements}
            />
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
