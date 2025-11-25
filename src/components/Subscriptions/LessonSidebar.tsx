'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, Play, CheckCircle, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

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

interface LessonSidebarProps {
  sections: CourseSection[];
  currentLesson: Lesson | null;
  onLessonClick: (lesson: Lesson) => void;
  totalLessons: number;
  totalDuration: string;
  enrolledCount: number;
}

export function LessonSidebar({
  sections,
  currentLesson,
  onLessonClick,
  totalLessons,
  totalDuration,
  enrolledCount
}: LessonSidebarProps) {
  const t = useTranslations('lessonPage.sidebar');
  const [activeSection, setActiveSection] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const displayedSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sections;
    return sections
      .map((s) => ({
        ...s,
        lessons: s.lessons.filter((l) => l.title.toLowerCase().includes(q))
      }))
      .filter((s) => s.lessons.length > 0);
  }, [searchQuery, sections]);

  const toggleSection = (sectionId: number) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  return (
    <div className="p-7" style={{ marginTop: 'clamp(0px, calc(100vw - 360px) * 10, 30px)' }}>
      <h3 className="text-xl font-bold text-slate-900 mb-8">{t('courseContent')}</h3>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search')}
            className="w-full rounded-xl border border-primary pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 bg-white/90 outline-none focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Sections Accordion */}
      <div className="space-y-3">
        {displayedSections.map((section) => (
          <div key={section.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md hover:border-primary transition-all">
            <button
              onClick={() => toggleSection(section.id)}
              aria-expanded={activeSection === section.id}
              className={`w-full px-5 py-4 bg-white flex items-center justify-between group rounded-xl border transition-all duration-300 ${
                activeSection === section.id
                  ? 'border-primary shadow-[0_6px_24px_rgba(10,186,181,0.12)] bg-primary/10'
                  : 'border-slate-200 hover:border-primary hover:bg-primary/5'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 text-left min-w-0">
                <div className={`transition-transform duration-300 shrink-0 ${activeSection === section.id ? 'rotate-180' : ''}`}>
                  <ChevronDown className="w-5 h-5 text-slate-600 shrink-0" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-slate-900 text-base group-hover:text-primary transition-colors truncate">{section.title}</div>
                </div>
              </div>
            </button>

            {/* Lessons List with smooth transition */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                activeSection === section.id ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'
              }`}
              aria-hidden={activeSection !== section.id}
            >
              <div className="bg-white space-y-2 p-3 border-t border-slate-200">
                {section.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => onLessonClick(lesson)}
                    className={`w-full px-4 py-3 rounded-lg text-left transition-all duration-300 group ${
                      currentLesson?.id === lesson.id
                        ? 'bg-primary/10 border border-primary shadow-sm'
                        : 'hover:bg-slate-50 border border-transparent hover:translate-x-0.5'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 min-w-0 ">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 transition-all ${
                          lesson.completed
                            ? 'bg-green-100'
                            : 'bg-primary/10 group-hover:bg-primary/20'
                        }`}>
                          {lesson.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Play className="w-3.5 h-3.5 text-primary fill-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium leading-5 overflow-hidden ${
                            currentLesson?.id === lesson.id
                              ? 'text-primary'
                              : 'text-slate-700'
                          }`} style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                            {lesson.title}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs shrink-0">
                        <span className="px-2.5 py-1.5 rounded-md bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-colors whitespace-nowrap">{t('preview')}</span>
                        <span className="text-slate-500 whitespace-nowrap">{lesson.duration}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
