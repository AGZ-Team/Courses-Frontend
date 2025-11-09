'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, ChevronDown, ChevronUp, Play, Star } from 'lucide-react';
import type { CourseCard } from '../CourseCard';
import Image from 'next/image';

interface CourseContentProps {
  course: CourseCard;
}

export function CourseContent({ course }: CourseContentProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'instructor' | 'reviews'>('overview');
  const [expandedSection, setExpandedSection] = useState<number | null>(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const t = useTranslations('courseDetails');

  const tabs = [
    { id: 'overview' as const, label: t('tabs.overview') },
    { id: 'content' as const, label: t('tabs.content') },
    { id: 'instructor' as const, label: t('tabs.instructor') },
    { id: 'reviews' as const, label: t('tabs.reviews') }
  ];

  // For accordion smooth height animation, keep refs of content nodes
  const sectionRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const setSectionRef = (id: number) => (el: HTMLDivElement | null) => {
    sectionRefs.current[id] = el;
  };
  const getSectionStyle = (id: number): React.CSSProperties => {
    const expanded = expandedSection === id;
    const el = sectionRefs.current[id];
    const target = expanded && el ? el.scrollHeight : 0;
    return {
      maxHeight: target,
      opacity: expanded ? 1 : 0,
      transition: 'max-height 350ms ease, opacity 250ms ease',
      overflow: 'hidden'
    };
  };

  const courseSections = [
    {
      id: 1,
      title: 'Course Content',
      lectures: 6,
      duration: '87 min',
      lessons: [
        { title: 'Introduction to the User', duration: '03:56' },
        { title: 'Getting started with your', duration: '03:56' },
        { title: 'What is UI vs UX - User Interface vs User Experience', duration: '03:56' },
        { title: 'Wireframing (low fidelity) in', duration: '03:56' },
        { title: 'Viewing your prototype on', duration: '03:56' },
        { title: 'Sharing your design', duration: '03:56' }
      ]
    },
    {
      id: 2,
      title: 'The Brief',
      lectures: 6,
      duration: '87 min',
      lessons: [
        { title: 'Introduction to the User', duration: '03:56' },
        { title: 'Getting started with your', duration: '03:56' },
        { title: 'What is UI vs UX', duration: '03:56' },
        { title: 'Wireframing basics', duration: '03:56' }
      ]
    },
    {
      id: 3,
      title: 'Type, Color & Icon Introduction',
      lectures: 6,
      duration: '87 min',
      lessons: [
        { title: 'Typography fundamentals', duration: '03:56' },
        { title: 'Color theory basics', duration: '03:56' },
        { title: 'Icon design principles', duration: '03:56' }
      ]
    }
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-6 py-4 rounded-xl font-medium transition-all border ${
                    activeTab === tab.id
                      ? 'border-transparent bg-primary text-white shadow-lg'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-primary/40 hover:text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-8">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
            <div className="space-y-12 animate-in fade-in duration-300">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('overview.description')}</h2>
                <div className={`text-gray-600 leading-relaxed space-y-4 ${!showFullDescription ? 'line-clamp-6' : ''}`}>
                  <p>{t('overview.p1')}</p>
                  <p>{t('overview.p2')}</p>
                  <p>{t('overview.p3')}</p>
                </div>
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-4 text-primary font-medium hover:text-primary/80 underline"
                >
                  {showFullDescription ? t('overview.showLess') : t('overview.showMore')}
                </button>
              </div>

              {/* What you'll learn */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("overview.whatYouLearn")}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {course.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="shrink-0 w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-gray-600" />
                      </div>
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('overview.requirements')}</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-gray-700"><span className="text-primary mt-1">•</span><span>{t('overview.req1')}</span></li>
                  <li className="flex items-start gap-3 text-gray-700"><span className="text-primary mt-1">•</span><span>{t('overview.req2')}</span></li>
                  <li className="flex items-start gap-3 text-gray-700"><span className="text-primary mt-1">•</span><span>{t('overview.req3')}</span></li>
                </ul>
              </div>
            </div>
            )}

            {/* CONTENT TAB */}
            {activeTab === 'content' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">{t('tabs.content')}</h2>
                <button className="text-primary hover:text-primary/80 font-medium underline">
                  {t('content.expandAll')}
                </button>
              </div>
              <p className="text-gray-600">27 {t('content.sections')} • 95 {t('content.lectures')}</p>

              <div className="space-y-3">
                {courseSections.map((section) => (
                  <div key={section.id} className="border border-slate-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                      className="w-full px-6 py-4 bg-slate-50 flex items-center justify-between hover:bg-white transition-colors duration-300"
                    >
                      <div className="flex items-center gap-3">
                        {expandedSection === section.id ? (
                          <ChevronUp className="w-5 h-5 text-slate-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-500" />
                        )}
                        <span className="font-semibold text-gray-900">{section.title}</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {section.lectures} lectures • {section.duration}
                      </span>
                    </button>

                      <div
                        ref={setSectionRef(section.id)}
                        style={getSectionStyle(section.id)}
                        className="px-6 bg-white"
                      >
                        <div className="py-4 space-y-3">
                          {section.lessons.map((lesson, idx) => (
                            <div key={idx} className="flex items-center justify-between py-2">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-300">
                                  <Play className="w-3 h-3 text-primary fill-primary" />
                                </div>
                                <span className="text-gray-700">{lesson.title}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <button className="text-primary hover:text-primary/80 text-sm underline">
                                  {t('content.preview')}
                                </button>
                                <span className="text-sm text-gray-500">{lesson.duration}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
            )}

            {/* INSTRUCTOR TAB */}
            {activeTab === 'instructor' && (
            <div className="space-y-8 animate-in fade-in duration-300">
                <h2 className="text-2xl font-bold text-gray-900">{t('instructor.title')}</h2>
                
                <div className="flex gap-6 items-start">
                  <Image
                    src={course.authorAvatar}
                    alt={course.author}
                    width={128}
                    height={128}
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{course.author}</h3>
                    <p className="text-gray-600 mt-1">{t('instructor.title')}</p>
                    
                    <div className="flex flex-wrap gap-6 mt-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium">4.5</span>
                        <span className="text-gray-600">{t('instructor.rating')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>23,987 {t('instructor.reviews')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>692 {t('instructor.students')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>15 {t('instructor.courses')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Back in 2010, I started brainspin with a desire to design compelling and engaging apps. For over 7 years, I have designed many high profile web and iPhone applications. The applications range from 3D medical aided web applications to project management applications for niche industries.
                  </p>
                  <p>
                    I am also the founder of a large local design organization, Salt Lake Designers, where I and other local influencers help cultivate the talents of up and coming UX designers through workshops and panel discussions.
                  </p>
                </div>
            </div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === 'reviews' && (
            <div className="space-y-8 animate-in fade-in duration-300">
                <h2 className="text-2xl font-bold text-gray-900">{t('reviews.studentFeedback')}</h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-8 flex flex-col items-center justify-center text-center">
                    <div className="text-5xl font-bold text-gray-900">4.8</div>
                    <div className="flex gap-1 mt-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 mt-2">{t('reviews.courseRating')}</p>
                  </div>

                  <div className="md:col-span-2 bg-gray-50 rounded-lg p-6 space-y-3">
                    {[
                      { stars: 5, percentage: 70 },
                      { stars: 4, percentage: 15 },
                      { stars: 3, percentage: 20 },
                      { stars: 2, percentage: 3 },
                      { stars: 1, percentage: 2 }
                    ].map((rating) => (
                      <div key={rating.stars} className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${rating.percentage}%` }}
                          />
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < rating.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-700 w-12 text-right">{rating.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6 mt-12">
                  <h3 className="text-xl font-bold text-gray-900">{t('reviews.reviewsTitle')}</h3>
                  {[1, 2].map((review) => (
                    <div key={review} className="border-b border-gray-200 pb-6">
                      <div className="flex gap-4">
                        <Image
                          src="/coursesImages/avatar-1.png"
                          alt="Reviewer"
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">Ali Tufan</h4>
                              <p className="text-sm text-gray-500">3 Days ago</p>
                            </div>
                          </div>
                          <h5 className="font-medium text-gray-900 mt-3">The best LMS Design</h5>
                          <p className="text-gray-600 mt-2">
                            This course is very applicable. Professor Ng explains precisely each algorithm and even tries to give an intuition for mathematical and statistic concepts behind each algorithm. Thank you very much.
                          </p>
                          <div className="flex gap-2 mt-4">
                            <span className="text-sm text-primary">{t('reviews.wasHelpful')}</span>
                            <button className="px-4 py-1 bg-primary text-white text-sm rounded hover:bg-primary/90">
                              {t('reviews.yes')}
                            </button>
                            <button className="px-4 py-1 bg-slate-200 text-slate-600 text-sm rounded hover:bg-slate-300">
                              {t('reviews.no')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="text-primary hover:text-primary/80 font-medium underline">
                    {t('reviews.viewAll')}
                  </button>
                </div>

                {/* Write Review */}
                <div className="mt-12 border-t border-gray-200 pt-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">{t('reviews.writeReview')}</h3>
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        {t('reviews.reviewTitle')}
                      </label>
                      <input
                        type="text"
                        placeholder={t('reviews.reviewTitle')}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        {t('reviews.reviewContent')}
                      </label>
                      <textarea
                        rows={6}
                        placeholder={t('reviews.reviewContent')}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      {t('reviews.submit')}
                    </button>
                  </form>
                </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
